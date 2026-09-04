import { supabase } from "./supabase";

const MAX_SIDE = 2800;
const JPEG_QUALITY = 0.86;

const loadBitmap = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível ler esta imagem."));
    };
    image.src = objectUrl;
  });

async function optimiseImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Só são permitidos ficheiros de imagem.");
  }

  if (file.size > 30 * 1024 * 1024) {
    throw new Error("A imagem ultrapassa o limite de 30 MB.");
  }

  const image = await loadBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", JPEG_QUALITY),
  );

  if (!blob) throw new Error("Não foi possível optimizar a imagem.");

  const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

export async function uploadImage(file) {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new Error("A sessão de administrador terminou. Volta a iniciar sessão.");
  }

  const signedResponse = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const signed = await signedResponse.json();
  if (!signedResponse.ok) {
    throw new Error(signed.error || "Não foi possível preparar o carregamento.");
  }

  const optimisedFile = await optimiseImage(file);
  const body = new FormData();
  body.append("file", optimisedFile);
  body.append("api_key", signed.apiKey);
  body.append("timestamp", String(signed.timestamp));
  body.append("signature", signed.signature);
  body.append("folder", signed.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
    { method: "POST", body },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || "Falhou o envio da imagem.");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function uploadImages(files) {
  const results = [];
  for (const file of files) results.push(await uploadImage(file));
  return results;
}

const isEmbeddedImage = (value) =>
  typeof value === "string" && value.startsWith("data:image/");

async function dataUrlToFile(dataUrl, name) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const extension = blob.type.split("/")[1] || "png";
  return new File([blob], `${name}.${extension}`, { type: blob.type });
}

async function migrateValue(value, name) {
  if (!isEmbeddedImage(value)) return value;
  const file = await dataUrlToFile(value, name);
  const uploaded = await uploadImage(file);
  return uploaded.url;
}

export async function migrateEmbeddedImages(rawContent) {
  const content = JSON.parse(JSON.stringify(rawContent));

  for (let projectIndex = 0; projectIndex < content.projects.length; projectIndex += 1) {
    const project = content.projects[projectIndex];
    const prefix = project.id || `projecto-${projectIndex}`;

    project.cover = await migrateValue(project.cover, `${prefix}-capa`);

    for (let index = 0; index < (project.gallery || []).length; index += 1) {
      const item = project.gallery[index];
      if (typeof item === "string") {
        project.gallery[index] = await migrateValue(item, `${prefix}-galeria-${index}`);
      } else {
        item.src = await migrateValue(
          item.src || item.image || "",
          `${prefix}-galeria-${index}`,
        );
        delete item.image;
      }
    }

    for (const group of ["drawings", "models"]) {
      for (let index = 0; index < (project[group] || []).length; index += 1) {
        project[group][index].image = await migrateValue(
          project[group][index].image,
          `${prefix}-${group}-${index}`,
        );
      }
    }
  }

  return content;
}
