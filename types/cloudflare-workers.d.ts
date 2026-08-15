interface Fetcher { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>; }
interface D1Result<T=unknown> { results?: T[]; success: boolean; meta: Record<string, unknown>; error?: string; }
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T=Record<string, unknown>>(columnName?: string): Promise<T | null>;
  run<T=Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T=Record<string, unknown>>(): Promise<D1Result<T>>;
  raw<T=unknown[]>(): Promise<T[]>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T=unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
  dump(): Promise<ArrayBuffer>;
}
interface R2HTTPMetadata { contentType?: string; contentLanguage?: string; contentDisposition?: string; contentEncoding?: string; cacheControl?: string; cacheExpiry?: Date; }
interface R2ObjectBody {
  key: string; version: string; size: number; etag: string; httpEtag: string;
  uploaded: Date; httpMetadata?: R2HTTPMetadata; customMetadata?: Record<string, string>;
  body: ReadableStream; bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T>(): Promise<T>;
  blob(): Promise<Blob>;
  writeHttpMetadata(headers: Headers): void;
}
interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
  put(key: string, value: ArrayBuffer | ArrayBufferView | ReadableStream | string | Blob, options?: { httpMetadata?: R2HTTPMetadata; customMetadata?: Record<string, string> }): Promise<unknown>;
  delete(key: string | string[]): Promise<void>;
}
declare module "cloudflare:workers" {
  export const env: { DB: D1Database; MEDIA: R2Bucket; [key: string]: unknown };
}
