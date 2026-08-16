"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Images, LoaderCircle, Save, X } from "lucide-react";
import type { Project } from "@/lib/portfolio";

const empty = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  gallery: [],
  technologies: [],
  category: "",
  projectDate: new Date().getFullYear().toString(),
  projectUrl: "",
  githubUrl: "",
  showProjectLink: false,
  challenge: "",
  solution: "",
  result: "",
  featured: false,
  published: false,
};

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [values, setValues] = useState({
    ...empty,
    ...project,
    coverImage: project?.coverImage || "",
    projectUrl: project?.projectUrl || "",
    githubUrl: project?.githubUrl || "",
  });
  const [tech, setTech] = useState(project?.technologies.join(", ") || "");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  function update(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function titleChange(title: string) {
    setValues((current) => ({
      ...current,
      title,
      slug: project
        ? current.slug
        : title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
    }));
  }

  async function sendImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) throw new Error(data.error || "Falha no upload");
    return data.url;
  }

  async function uploadCover(file?: File) {
    if (!file) return;
    setUploadingCover(true);
    setError("");
    try {
      update("coverImage", await sendImage(file));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha no upload");
    } finally {
      setUploadingCover(false);
    }
  }

  async function uploadGallery(files?: FileList | null) {
    const selected = Array.from(files || []).slice(0, Math.max(0, 12 - values.gallery.length));
    if (!selected.length) return;
    setUploadingGallery(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of selected) urls.push(await sendImage(file));
      setValues((current) => ({ ...current, gallery: [...current.gallery, ...urls].slice(0, 12) }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha ao enviar os prints");
    } finally {
      setUploadingGallery(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      ...values,
      technologies: tech.split(",").map((item) => item.trim()).filter(Boolean),
    };
    try {
      const response = await fetch(project ? `/api/admin/projects/${project.id}` : "/api/admin/projects", {
        method: project ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar");
      router.push("/admin/projects");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar");
      setSaving(false);
    }
  }

  return (
    <form className="project-form" onSubmit={submit}>
      <div className="form-main">
        <section className="admin-card">
          <div className="card-title"><span>01</span><div><h2>Essencial</h2><p>O que identifica e apresenta o projeto.</p></div></div>
          <label>Título<input value={values.title} onChange={(event) => titleChange(event.target.value)} required placeholder="Ex.: Meu projeto" /></label>
          <div className="field-grid">
            <label>Slug<input value={values.slug} onChange={(event) => update("slug", event.target.value)} required placeholder="meu-projeto" /></label>
            <label>Categoria<input value={values.category} onChange={(event) => update("category", event.target.value)} required placeholder="Produto digital" /></label>
          </div>
          <label>Descrição curta<textarea value={values.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} required rows={2} maxLength={220} /><small>{values.shortDescription.length}/220</small></label>
          <label>Descrição completa<textarea value={values.description} onChange={(event) => update("description", event.target.value)} required rows={7} /></label>
        </section>

        <section className="admin-card">
          <div className="card-title"><span>02</span><div><h2>Narrativa do case</h2><p>O contexto por trás da entrega.</p></div></div>
          <label htmlFor="project-challenge"><span>Desafio</span><textarea id="project-challenge" value={values.challenge} onChange={(event) => update("challenge", event.target.value)} rows={4} /></label>
          <label htmlFor="project-solution"><span>Solução</span><textarea id="project-solution" value={values.solution} onChange={(event) => update("solution", event.target.value)} rows={4} /></label>
          <label htmlFor="project-result"><span>Resultado</span><textarea id="project-result" value={values.result} onChange={(event) => update("result", event.target.value)} rows={4} /></label>
        </section>
      </div>

      <aside className="form-side">
        <section className="admin-card">
          <h3>Publicação</h3>
          <div className="toggle-row"><span><b>Publicado</b><small>Visível no portfólio</small></span><input aria-label="Publicado" type="checkbox" checked={values.published} onChange={(event) => update("published", event.target.checked)} /></div>
          <div className="toggle-row"><span><b>Em destaque</b><small>Aparece primeiro na home</small></span><input aria-label="Em destaque" type="checkbox" checked={values.featured} onChange={(event) => update("featured", event.target.checked)} /></div>
          <div className="toggle-row"><span><b>Botão “Acessar projeto”</b><small>Só aparece quando esta opção estiver ativa e houver uma URL.</small></span><input aria-label="Exibir botão para acessar projeto" type="checkbox" checked={values.showProjectLink} onChange={(event) => update("showProjectLink", event.target.checked)} /></div>
          <label>Ano<input value={values.projectDate} onChange={(event) => update("projectDate", event.target.value)} required /></label>
        </section>

        <section className="admin-card">
          <h3>Imagem de capa</h3>
          <label className={`upload-box ${values.coverImage ? "has-image" : ""}`}>
            {values.coverImage ? <><img src={values.coverImage} alt="Prévia da capa" /><button type="button" onClick={(event) => { event.preventDefault(); update("coverImage", ""); }} aria-label="Remover imagem"><X size={15} /></button></> : <><ImagePlus /><b>{uploadingCover ? "Enviando..." : "Escolher imagem"}</b><small>JPG, PNG ou WebP · até 4 MB</small></>}
            <input aria-label="Escolher imagem de capa" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadCover(event.target.files?.[0])} disabled={uploadingCover} />
          </label>
        </section>

        <section className="admin-card">
          <h3>Galeria de prints</h3>
          <p className="admin-card-help">Adicione até 12 imagens. Elas aparecem dentro da página do projeto.</p>
          {values.gallery.length > 0 && (
            <div className="gallery-upload-grid">
              {values.gallery.map((image, index) => (
                <div key={`${image}-${index}`}>
                  <img src={image} alt={`Print ${index + 1} do projeto`} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <button type="button" onClick={() => update("gallery", values.gallery.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remover print ${index + 1}`}><X /></button>
                </div>
              ))}
            </div>
          )}
          <label className="gallery-upload-button">
            <Images />
            <span><b>{uploadingGallery ? "Enviando prints..." : "Adicionar prints"}</b><small>{values.gallery.length}/12 imagens</small></span>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => { uploadGallery(event.target.files); event.currentTarget.value = ""; }} disabled={uploadingGallery || values.gallery.length >= 12} />
          </label>
        </section>

        <section className="admin-card">
          <h3>Detalhes técnicos</h3>
          <label>Tecnologias<input value={tech} onChange={(event) => setTech(event.target.value)} placeholder="Lua, JavaScript, Node.js" /><small>Separe com vírgulas</small></label>
          <label>URL do projeto<input type="url" value={values.projectUrl} onChange={(event) => update("projectUrl", event.target.value)} placeholder="https://" /><small>Ative “Acessar projeto” na publicação para mostrar o botão no site.</small></label>
          <label>URL do GitHub<input type="url" value={values.githubUrl} onChange={(event) => update("githubUrl", event.target.value)} placeholder="https://github.com/" /></label>
        </section>
        <p className="admin-form-error" role="alert">{error}</p>
        <button className="admin-save" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}{saving ? "Salvando..." : "Salvar projeto"}</button>
      </aside>
    </form>
  );
}
