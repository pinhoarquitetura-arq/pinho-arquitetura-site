import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  GripVertical,
  ImagePlus,
  LayoutGrid,
  Plus,
  RectangleHorizontal,
  RectangleVertical,
  RotateCcw,
  Save,
  Settings,
  Tags,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  defaultContent,
  loadContent,
  resetContent,
  saveContent,
} from "../lib/content";
import { migrateEmbeddedImages, uploadImages } from "../lib/uploadImage";
import { supabase } from "../lib/supabase";
import "../admin-theme.css";

const clone = (o) => JSON.parse(JSON.stringify(o));

const normaliseGallery = (gallery = []) =>
  gallery.map((item, index) =>
    typeof item === "string"
      ? {
          id: `foto-antiga-${index}`,
          src: item,
          size: index % 3 === 1 ? "narrow" : "wide",
        }
      : {
          ...item,
          id: item.id || `foto-antiga-${index}`,
          src: item.src || item.image || "",
          size: item.size || "wide",
        },
  );

const prepareContent = (raw) => {
  const next = clone(raw);
  const projectCategories = [
    ...new Set(
      next.projects.map((project) => project.category).filter(Boolean),
    ),
  ];

  next.categories =
    Array.isArray(next.categories) && next.categories.length
      ? [...new Set(next.categories.filter(Boolean))]
      : projectCategories;
  next.projects = next.projects.map((project) => ({
    ...project,
    // Os projectos antigos continuam válidos e entram como projectos próprios.
    projectType:
      project.projectType === "collaboration" ? "collaboration" : "own",
    collaborationWith: project.collaborationWith || "",
    gallery: normaliseGallery(project.gallery),
  }));

  return next;
};

function FilePicker({ onValue, multiple = false }) {
  const [uploading, setUploading] = useState(false);

  const read = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;

    try {
      setUploading(true);
      const uploaded = await uploadImages(files);
      const values = uploaded.map((item) => item.url);
      onValue(multiple ? values : values[0]);
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      alert(error.message || "Não foi possível carregar a imagem.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  return (
    <label className={`admin-file ${uploading ? "is-uploading" : ""}`}>
      <ImagePlus size={17} />
      {uploading
        ? "A carregar…"
        : `Carregar ${multiple ? "imagens" : "imagem"}`}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={read}
        disabled={uploading}
      />
    </label>
  );
}

export default function Admin() {
  const [content, setContent] = useState(() => prepareContent(defaultContent));
  const [tab, setTab] = useState("projects");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [draggedPhoto, setDraggedPhoto] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !session) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    loadContent()
      .then((raw) => {
        if (!active) return;
        const prepared = prepareContent(raw);
        setContent(prepared);
        setSelected((current) =>
          prepared.projects.some((item) => item.id === current)
            ? current
            : prepared.projects[0]?.id || null,
        );
      })
      .catch((error) => {
        console.error("Erro ao carregar o Admin:", error);
        setAuthError("Não foi possível carregar o conteúdo.");
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [authReady, session]);

  const signIn = async (event) => {
    event.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Email ou palavra-passe incorrectos.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setContent(prepareContent(defaultContent));
    setSelected(null);
  };
  const project = useMemo(
    () => content.projects.find((p) => p.id === selected),
    [content, selected],
  );
  const setProject = (updater) =>
    setContent((c) => ({
      ...c,
      projects: c.projects.map((p) =>
        p.id === selected
          ? typeof updater === "function"
            ? updater(p)
            : updater
          : p,
      ),
    }));
  const commit = async () => {
    try {
      setSaving(true);
      const migratedContent = await migrateEmbeddedImages(content);
      await saveContent(migratedContent);
      setContent(prepareContent(migratedContent));
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (error) {
      console.error("Erro ao guardar:", error);
      alert("Não foi possível guardar as alterações.");
    } finally {
      setSaving(false);
    }
  };
  const addProject = () => {
    const id = `novo-projecto-${Date.now()}`;
    const p = {
      id,
      title: "Novo projecto",
      location: "Aveiro, Portugal",
      year: new Date().getFullYear().toString(),
      category: content.categories[0] || "",
      projectType: "own",
      collaborationWith: "",
      status: "Estudo",
      featured: false,
      cover:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=86",
      gallery: [],
      description: "Descrição do projecto.",
      facts: [
        ["Tipologia", ""],
        ["Área", ""],
      ],
      drawings: [],
      models: [],
      credits: [["Arquitectura", "Pinho Arquitetura"]],
      featuredOn: [],
    };
    setContent((c) => ({ ...c, projects: [p, ...c.projects] }));
    setSelected(id);
  };
  const delProject = () => {
    if (!project || !confirm(`Apagar “${project.title}”?`)) return;
    const next = content.projects.filter((p) => p.id !== selected);
    setContent((c) => ({ ...c, projects: next }));
    setSelected(next[0]?.id || null);
  };
  const pairUpdate = (key, i, pos, value) =>
    setProject((p) => ({
      ...p,
      [key]: p[key].map((x, n) =>
        n === i ? x.map((v, j) => (j === pos ? value : v)) : x,
      ),
    }));
  const pairAdd = (key) =>
    setProject((p) => ({ ...p, [key]: [...(p[key] || []), ["", ""]] }));
  const pairDel = (key, i) =>
    setProject((p) => ({ ...p, [key]: p[key].filter((_, n) => n !== i) }));
  const objUpdate = (key, i, field, value) =>
    setProject((p) => ({
      ...p,
      [key]: p[key].map((x, n) => (n === i ? { ...x, [field]: value } : x)),
    }));
  const objAdd = (key, shape) =>
    setProject((p) => ({ ...p, [key]: [...(p[key] || []), shape] }));
  const objDel = (key, i) =>
    setProject((p) => ({ ...p, [key]: p[key].filter((_, n) => n !== i) }));

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    if (
      content.categories.some(
        (category) => category.toLowerCase() === name.toLowerCase(),
      )
    ) {
      alert("Essa categoria já existe.");
      return;
    }
    setContent((current) => ({
      ...current,
      categories: [...current.categories, name],
    }));
    setNewCategory("");
  };

  const renameCategory = (index, name) => {
    const previous = content.categories[index];
    setContent((current) => ({
      ...current,
      categories: current.categories.map((category, position) =>
        position === index ? name : category,
      ),
      projects: current.projects.map((item) =>
        item.category === previous ? { ...item, category: name } : item,
      ),
    }));
  };

  const deleteCategory = (index) => {
    const category = content.categories[index];
    const projectsUsingCategory = content.projects.filter(
      (item) => item.category === category,
    ).length;
    const message = projectsUsingCategory
      ? `A categoria “${category}” está associada a ${projectsUsingCategory} projecto(s). Ao apagá-la, esses projectos ficam sem categoria. Continuar?`
      : `Apagar a categoria “${category}”?`;
    if (!confirm(message)) return;

    setContent((current) => ({
      ...current,
      categories: current.categories.filter(
        (_, position) => position !== index,
      ),
      projects: current.projects.map((item) =>
        item.category === category ? { ...item, category: "" } : item,
      ),
    }));
  };

  const moveCategory = (from, to) => {
    if (to < 0 || to >= content.categories.length) return;
    setContent((current) => {
      const categories = [...current.categories];
      const [moved] = categories.splice(from, 1);
      categories.splice(to, 0, moved);
      return { ...current, categories };
    });
  };

  const movePhoto = (from, to) => {
    if (from === null || from === to) return;
    setProject((current) => {
      const gallery = [...current.gallery];
      const [moved] = gallery.splice(from, 1);
      gallery.splice(to, 0, moved);
      return { ...current, gallery };
    });
    setDraggedPhoto(null);
  };

  const updatePhotoSize = (index, size) =>
    setProject((current) => ({
      ...current,
      gallery: current.gallery.map((item, position) =>
        position === index ? { ...item, size } : item,
      ),
    }));

  if (!authReady || loading) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-loading">
          <span />
          A carregar painel…
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-panel">
          <aside className="admin-auth-brand">
            <div className="admin-auth-logo-box">
              <img
                src="/logos/monograma-transparente.png"
                alt="Pinho Arquitetura"
              />
            </div>

            <div className="admin-auth-brand-copy">
              <span>PINHO ARQUITETURA</span>

              <h2>
                Gestão clara.
                <br />
                Projetos organizados.
              </h2>

              <p>
                Área reservada para gestão dos projetos e conteúdos do website.
              </p>
            </div>

            <small>AVEIRO · PORTUGAL</small>
          </aside>

          <form className="admin-auth-form" onSubmit={signIn}>
            <div className="admin-auth-heading">
              <span>ÁREA RESERVADA</span>
              <h1>Bem-vindo.</h1>
              <p>Introduz os teus dados para acederes ao painel.</p>
            </div>

            <div className="admin-auth-fields">
              <label>
                <span>Email</span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome@email.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                <span>Palavra-passe</span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>

            {authError && (
              <p className="admin-auth-error" role="alert">
                {authError}
              </p>
            )}

            <button className="admin-auth-submit" type="submit">
              Entrar no painel
              <span>↗</span>
            </button>

            <Link className="admin-auth-back" to="/">
              ← Voltar ao website
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <Link className="admin-brand" to="/">
            <span className="admin-brand-mark">
              <img
                src="/logos/monograma-transparente.png"
                alt=""
                aria-hidden="true"
              />
            </span>
            <div>
              PINHO
              <br />
              ARQUITETURA
            </div>
          </Link>
          <nav>
            <button
              className={tab === "projects" ? "active" : ""}
              onClick={() => setTab("projects")}
            >
              <LayoutGrid size={17} />
              Projetos
            </button>
            <button
              className={tab === "settings" ? "active" : ""}
              onClick={() => setTab("settings")}
            >
              <Settings size={17} />
              Site & contactos
            </button>
            <button
              className={tab === "categories" ? "active" : ""}
              onClick={() => setTab("categories")}
            >
              <Tags size={17} />
              Categorias
            </button>
          </nav>
        </div>
        <div className="admin-side-bottom">
          <Link to="/" target="_blank">
            <Eye size={16} /> Ver website
          </Link>
          <button type="button" className="demo-badge" onClick={signOut}>
            Terminar sessão
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div>
            <span>PAINEL DE GESTÃO</span>
            <h1>
              {tab === "projects"
                ? "Projetos"
                : tab === "categories"
                  ? "Categorias"
                  : "Site & contactos"}
            </h1>
          </div>
          <div className="admin-top-actions">
            <span className="admin-user-email">{session.user.email}</span>
            <button
              className={`admin-save ${saved ? "saved" : ""}`}
              onClick={commit}
              disabled={saving}
            >
              {saved ? <Check size={17} /> : <Save size={17} />}{" "}
              {saving
                ? "A guardar…"
                : saved
                  ? "Guardado"
                  : "Guardar alterações"}
            </button>
          </div>
        </header>

        {tab === "projects" && (
          <div className="admin-project-layout">
            <section className="admin-project-list">
              <button className="add-project" onClick={addProject}>
                <Plus size={17} /> Novo projecto
              </button>
              {content.projects.map((p) => (
                <button
                  key={p.id}
                  className={`admin-project-row ${selected === p.id ? "active" : ""}`}
                  onClick={() => setSelected(p.id)}
                >
                  <img src={p.cover} />
                  <div>
                    <b>{p.title}</b>
                    <span>
                      {p.year} ·{" "}
                      {p.projectType === "collaboration"
                        ? "Colaboração"
                        : "Projecto próprio"}
                      {p.category ? ` · ${p.category}` : ""}
                    </span>
                  </div>
                </button>
              ))}
            </section>
            {project && (
              <section className="admin-editor">
                <div className="editor-section">
                  <div className="editor-heading">
                    <h2>Informação principal</h2>
                    <button className="danger-link" onClick={delProject}>
                      <Trash2 size={15} /> Apagar projecto
                    </button>
                  </div>
                  <div className="form-grid two">
                    <label>
                      Título
                      <input
                        value={project.title}
                        onChange={(e) =>
                          setProject((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Localização
                      <input
                        value={project.location}
                        onChange={(e) =>
                          setProject((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Ano
                      <input
                        value={project.year}
                        onChange={(e) =>
                          setProject((p) => ({ ...p, year: e.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Tipo de projecto
                      <select
                        value={project.projectType || "own"}
                        onChange={(e) =>
                          setProject((p) => ({
                            ...p,
                            projectType: e.target.value,
                            collaborationWith:
                              e.target.value === "collaboration"
                                ? p.collaborationWith || ""
                                : "",
                          }))
                        }
                      >
                        <option value="own">Projecto próprio</option>
                        <option value="collaboration">Colaboração</option>
                      </select>
                    </label>
                    {project.projectType === "collaboration" && (
                      <label>
                        Colaboração com
                        <input
                          value={project.collaborationWith || ""}
                          onChange={(e) =>
                            setProject((p) => ({
                              ...p,
                              collaborationWith: e.target.value,
                            }))
                          }
                          placeholder="Ex.: Atelier X / Arquitecto Y"
                        />
                      </label>
                    )}
                    <label>
                      Categoria
                      <select
                        value={project.category}
                        onChange={(e) =>
                          setProject((p) => ({
                            ...p,
                            category: e.target.value,
                          }))
                        }
                      >
                        <option value="">Sem categoria</option>
                        {content.categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Estado
                      <input
                        value={project.status}
                        onChange={(e) =>
                          setProject((p) => ({ ...p, status: e.target.value }))
                        }
                      />
                    </label>
                    <label className="toggle-label">
                      Em destaque{" "}
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) =>
                          setProject((p) => ({
                            ...p,
                            featured: e.target.checked,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <label>
                    Descrição
                    <textarea
                      rows="5"
                      value={project.description}
                      onChange={(e) =>
                        setProject((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="editor-section">
                  <h2>Imagem de capa</h2>
                  <div className="cover-admin-preview">
                    <img src={project.cover} />
                    <FilePicker
                      onValue={(v) => setProject((p) => ({ ...p, cover: v }))}
                    />
                  </div>
                  <label>
                    Ou URL da imagem
                    <input
                      value={project.cover}
                      onChange={(e) =>
                        setProject((p) => ({ ...p, cover: e.target.value }))
                      }
                    />
                  </label>
                </div>

                <div className="editor-section">
                  <div className="editor-heading">
                    <h2>Galeria</h2>
                    <FilePicker
                      multiple
                      onValue={(arr) =>
                        setProject((p) => ({
                          ...p,
                          gallery: [
                            ...p.gallery,
                            ...arr.map((src, index) => ({
                              id: `foto-${Date.now()}-${index}`,
                              src,
                              size: "wide",
                            })),
                          ],
                        }))
                      }
                    />
                  </div>
                  <p className="gallery-admin-help">
                    Arrasta as fotografias para definir a ordem e escolhe o
                    formato de cada uma.
                  </p>
                  <div className="gallery-admin-grid">
                    {project.gallery.map((item, i) => (
                      <div
                        className={`gallery-admin-item gallery-admin-item--${item.size} ${draggedPhoto === i ? "is-dragging" : ""}`}
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggedPhoto(i)}
                        onDragEnd={() => setDraggedPhoto(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => movePhoto(draggedPhoto, i)}
                      >
                        <div className="gallery-admin-image">
                          <img src={item.src} alt="" />
                          <span className="gallery-drag-handle">
                            <GripVertical size={17} /> Arrastar
                          </span>
                          <button
                            className="gallery-delete"
                            title="Apagar fotografia"
                            onClick={() =>
                              setProject((p) => ({
                                ...p,
                                gallery: p.gallery.filter((_, n) => n !== i),
                              }))
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="gallery-size-picker">
                          <button
                            className={item.size === "wide" ? "active" : ""}
                            onClick={() => updatePhotoSize(i, "wide")}
                          >
                            <RectangleHorizontal size={15} /> Grande
                          </button>
                          <button
                            className={item.size === "narrow" ? "active" : ""}
                            onClick={() => updatePhotoSize(i, "narrow")}
                          >
                            <LayoutGrid size={15} /> Média
                          </button>
                          <button
                            className={item.size === "portrait" ? "active" : ""}
                            onClick={() => updatePhotoSize(i, "portrait")}
                          >
                            <RectangleVertical size={15} /> Vertical
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {["facts", "credits"].map((key) => (
                  <div className="editor-section" key={key}>
                    <div className="editor-heading">
                      <h2>
                        {key === "facts" ? "Ficha do projecto" : "Credits"}
                      </h2>
                      <button
                        className="small-add"
                        onClick={() => pairAdd(key)}
                      >
                        <Plus size={15} /> Adicionar
                      </button>
                    </div>
                    {project[key]?.map((row, i) => (
                      <div className="repeat-row" key={i}>
                        <input
                          placeholder="Campo"
                          value={row[0]}
                          onChange={(e) =>
                            pairUpdate(key, i, 0, e.target.value)
                          }
                        />
                        <input
                          placeholder="Valor"
                          value={row[1]}
                          onChange={(e) =>
                            pairUpdate(key, i, 1, e.target.value)
                          }
                        />
                        <button onClick={() => pairDel(key, i)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                {["drawings", "models"].map((key) => (
                  <div className="editor-section" key={key}>
                    <div className="editor-heading">
                      <h2>{key === "drawings" ? "Drawings" : "Models"}</h2>
                      <button
                        className="small-add"
                        onClick={() =>
                          objAdd(key, { title: "", subtitle: "", image: "" })
                        }
                      >
                        <Plus size={15} /> Adicionar
                      </button>
                    </div>
                    {project[key]?.map((x, i) => (
                      <div className="object-card" key={i}>
                        <div className="form-grid two">
                          <label>
                            Título
                            <input
                              value={x.title}
                              onChange={(e) =>
                                objUpdate(key, i, "title", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            Legenda
                            <input
                              value={x.subtitle}
                              onChange={(e) =>
                                objUpdate(key, i, "subtitle", e.target.value)
                              }
                            />
                          </label>
                        </div>
                        <div className="object-image-line">
                          {x.image ? (
                            <img src={x.image} />
                          ) : (
                            <div className="mini-placeholder">Sem imagem</div>
                          )}
                          <FilePicker
                            onValue={(v) => objUpdate(key, i, "image", v)}
                          />
                          <button onClick={() => objDel(key, i)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="editor-section">
                  <div className="editor-heading">
                    <h2>Featured on</h2>
                    <button
                      className="small-add"
                      onClick={() =>
                        objAdd("featuredOn", { name: "", url: "" })
                      }
                    >
                      <Plus size={15} /> Adicionar
                    </button>
                  </div>
                  {project.featuredOn?.map((x, i) => (
                    <div className="repeat-row" key={i}>
                      <input
                        placeholder="Nome da publicação"
                        value={x.name}
                        onChange={(e) =>
                          objUpdate("featuredOn", i, "name", e.target.value)
                        }
                      />
                      <input
                        placeholder="Link (opcional)"
                        value={x.url}
                        onChange={(e) =>
                          objUpdate("featuredOn", i, "url", e.target.value)
                        }
                      />
                      <button onClick={() => objDel("featuredOn", i)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {tab === "categories" && (
          <section className="admin-settings-page">
            <div className="editor-section">
              <div className="editor-heading">
                <div>
                  <h2>Categorias dos projectos</h2>
                  <p className="editor-description">
                    Estas categorias aparecem automaticamente como filtros na
                    página de projectos.
                  </p>
                </div>
              </div>

              <div className="category-add-row">
                <input
                  value={newCategory}
                  placeholder="Nova categoria"
                  onChange={(event) => setNewCategory(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addCategory();
                  }}
                />
                <button className="small-add solid" onClick={addCategory}>
                  <Plus size={16} /> Adicionar categoria
                </button>
              </div>

              <div className="category-list">
                {content.categories.map((category, index) => (
                  <div className="category-row" key={`${category}-${index}`}>
                    <GripVertical size={17} />
                    <input
                      value={category}
                      onChange={(event) =>
                        renameCategory(index, event.target.value)
                      }
                    />
                    <span>
                      {
                        content.projects.filter(
                          (item) => item.category === category,
                        ).length
                      }{" "}
                      projecto(s)
                    </span>
                    <div>
                      <button
                        disabled={index === 0}
                        title="Subir categoria"
                        onClick={() => moveCategory(index, index - 1)}
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        disabled={index === content.categories.length - 1}
                        title="Descer categoria"
                        onClick={() => moveCategory(index, index + 1)}
                      >
                        <ChevronDown size={15} />
                      </button>
                      <button
                        className="category-delete"
                        title="Apagar categoria"
                        onClick={() => deleteCategory(index)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === "settings" && (
          <section className="admin-settings-page">
            <div className="editor-section">
              <h2>Identidade</h2>
              <div className="form-grid two">
                <label>
                  Nome do estúdio
                  <input
                    value={content.settings.studioName}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        settings: { ...c.settings, studioName: e.target.value },
                      }))
                    }
                  />
                </label>
                <label>
                  Frase curta
                  <input
                    value={content.settings.tagline}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        settings: { ...c.settings, tagline: e.target.value },
                      }))
                    }
                  />
                </label>
              </div>
              <label>
                Texto de apresentação
                <textarea
                  rows="5"
                  value={content.settings.intro}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      settings: { ...c.settings, intro: e.target.value },
                    }))
                  }
                />
              </label>
            </div>
            <div className="editor-section">
              <h2>Contactos</h2>
              <div className="form-grid two">
                {[
                  ["email", "Email"],
                  ["phone", "Telefone"],
                  ["address", "Morada / localização"],
                  ["instagram", "Instagram"],
                  ["linkedin", "LinkedIn"],
                  ["website", "Website"],
                ].map(([k, l]) => (
                  <label key={k}>
                    {l}
                    <input
                      value={content.settings[k]}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          settings: { ...c.settings, [k]: e.target.value },
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="admin-contact-copy">
                <label>
                  Frase principal da página de contactos
                  <textarea
                    rows="3"
                    value={content.settings.contactHeading || ""}
                    placeholder="Um bom projecto começa por ouvir."
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        settings: {
                          ...c.settings,
                          contactHeading: e.target.value,
                        },
                      }))
                    }
                  />
                </label>
                <label>
                  Texto de introdução ao formulário
                  <textarea
                    rows="3"
                    value={content.settings.contactIntro || ""}
                    placeholder="Conta-nos um pouco sobre o projecto."
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        settings: {
                          ...c.settings,
                          contactIntro: e.target.value,
                        },
                      }))
                    }
                  />
                </label>
              </div>
            </div>
            <div className="editor-section">
              <h2>Rodapé</h2>
              <label>
                Serviços / nota curta
                <input
                  value={content.settings.footerNote}
                  onChange={(e) =>
                    setContent((c) => ({
                      ...c,
                      settings: { ...c.settings, footerNote: e.target.value },
                    }))
                  }
                />
              </label>
            </div>
            <div className="demo-warning">
              <div>
                <b>Conteúdo online</b>
                <p>
                  As alterações ficam guardadas no Supabase e as imagens no
                  Cloudinary. Depois de editar, carrega sempre em Guardar alterações.
                </p>
              </div>
              <button
                onClick={async () => {
                  if (confirm("Repor todo o conteúdo de demonstração?")) {
                    await resetContent();
                    setContent(prepareContent(defaultContent));
                    setSelected(defaultContent.projects[0]?.id || null);
                  }
                }}
              >
                <RotateCcw size={16} /> Repor demo
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
