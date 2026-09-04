import { supabase } from "./supabase";

const CONTENT_ID = "main";
const CACHE_KEY = "pinho-content-cache-v1";

export const defaultContent = {
  settings: {
    tagline: "Arquitetura e interiores, do conceito à obra.",
    intro: "Criamos espaços claros, funcionais e pensados para serem vividos.",
    contactHeading: "Um bom projecto começa por ouvir.",
    contactIntro:
      "Conta-nos um pouco sobre o projecto. Respondemos assim que possível.",
    email: "",
    phone: "",
    address: "Aveiro, Portugal",
    instagram: "",
    linkedin: "",
    website: "",
    footerNote: "Arquitetura e interiores, do conceito à obra.",
  },
  categories: [],
  projects: [],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const isContent = (value) =>
  value &&
  typeof value === "object" &&
  value.settings &&
  Array.isArray(value.projects);

const normaliseContent = (value) => ({
  ...clone(defaultContent),
  ...(isContent(value) ? value : {}),
  settings: {
    ...defaultContent.settings,
    ...(isContent(value) ? value.settings : {}),
  },
  categories: Array.isArray(value?.categories) ? value.categories : [],
  projects: Array.isArray(value?.projects) ? value.projects : [],
});

const readLocalContent = () => {
  if (typeof window === "undefined") return clone(defaultContent);

  const preferredKeys = [
    CACHE_KEY,
    "pinho-arquitetura-content",
    "pinho-content",
  ];

  const otherKeys = Object.keys(window.localStorage).filter((key) =>
    key.toLowerCase().includes("pinho"),
  );

  for (const key of [...new Set([...preferredKeys, ...otherKeys])]) {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key));
      if (isContent(parsed)) return normaliseContent(parsed);
    } catch {
      // Ignora valores antigos que não sejam JSON válido.
    }
  }

  return clone(defaultContent);
};

const cacheContent = (content) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(content));
};

export async function loadContent() {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", CONTENT_ID)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar conteúdo do Supabase:", error);
    return readLocalContent();
  }

  if (!data?.content) return readLocalContent();

  const content = normaliseContent(data.content);
  const localContent = readLocalContent();

  // Na primeira migração, permite recuperar os projectos que ainda estavam
  // guardados no browser. Ao carregar em Guardar no Admin passam para o Supabase.
  if (!content.projects.length && localContent.projects.length) {
    return localContent;
  }

  cacheContent(content);
  return content;
}

export async function saveContent(rawContent) {
  const content = normaliseContent(rawContent);
  const { error } = await supabase.from("site_content").upsert(
    {
      id: CONTENT_ID,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;

  cacheContent(content);
  window.dispatchEvent(new CustomEvent("pinho-content-changed"));
  return content;
}

export async function resetContent() {
  return saveContent(defaultContent);
}
