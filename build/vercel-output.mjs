import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const output = join(root, ".vercel", "output");
const functionDir = join(output, "functions", "index.func");
const staticDir = join(output, "static");
const shimPath = join(functionDir, "cloudflare-workers-shim.js");

if (!existsSync(join(dist, "server", "index.js"))) {
  throw new Error("O build do servidor não foi encontrado em dist/server/index.js.");
}

rmSync(output, { force: true, recursive: true });
mkdirSync(functionDir, { recursive: true });
mkdirSync(staticDir, { recursive: true });

cpSync(join(dist, "client"), staticDir, { recursive: true });
cpSync(join(dist, "server"), functionDir, { recursive: true });

function javascriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return javascriptFiles(path);
    return path.endsWith(".js") || path.endsWith(".mjs") ? [path] : [];
  });
}

for (const file of javascriptFiles(functionDir)) {
  const importPath = relative(dirname(file), shimPath).split(sep).join("/");
  const specifier = importPath.startsWith(".") ? importPath : `./${importPath}`;
  const source = readFileSync(file, "utf8")
    .replaceAll('"cloudflare:workers"', JSON.stringify(specifier))
    .replaceAll("'cloudflare:workers'", `'${specifier}'`);
  writeFileSync(file, source);
}

writeFileSync(
  shimPath,
  `const runtime = new Proxy({}, {
  get(_target, property) {
    return globalThis.__JP_CLOUDFLARE_ENV?.[property];
  },
  has(_target, property) {
    return property in (globalThis.__JP_CLOUDFLARE_ENV || {});
  }
});
export { runtime as env };
`,
);

writeFileSync(
  join(functionDir, "serve.js"),
  `import worker from "./index.js";

export default {
  async fetch(request) {
    const pending = [];
    const runtimeEnv = {
      ...process.env,
      ASSETS: {
        fetch(assetRequest) {
          return fetch(assetRequest);
        },
      },
    };
    globalThis.__JP_CLOUDFLARE_ENV = runtimeEnv;
    const context = {
      waitUntil(promise) {
        pending.push(Promise.resolve(promise));
      },
      passThroughOnException() {},
    };
    const response = await worker.fetch(request, runtimeEnv, context);
    if (pending.length) Promise.allSettled(pending).catch(() => {});
    return response;
  },
};
`,
);

writeFileSync(join(functionDir, "package.json"), JSON.stringify({ type: "module" }));
writeFileSync(
  join(functionDir, ".vc-config.json"),
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "serve.js",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
    shouldAddSourcemapSupport: true,
    supportsResponseStreaming: true,
  }),
);

writeFileSync(
  join(output, "config.json"),
  JSON.stringify({
    version: 3,
    routes: [
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index" },
    ],
  }),
);

