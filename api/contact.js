import dotenv from "dotenv";
import path from "node:path";
import { Resend } from "resend";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
  override: true,
});

console.log(
  "RESEND_API_KEY carregada:",
  Boolean(process.env.RESEND_API_KEY),
);
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Método não permitido.",
    });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY não está definida.");

      return response.status(500).json({
        error: "O serviço de email ainda não está configurado.",
      });
    }

    if (!process.env.CONTACT_TO_EMAIL) {
      console.error("CONTACT_TO_EMAIL não está definido.");

      return response.status(500).json({
        error: "O destinatário ainda não está configurado.",
      });
    }

    const {
      name = "",
      email = "",
      phone = "",
      message = "",
    } = request.body || {};

    if (!name.trim() || !email.trim() || !message.trim()) {
      return response.status(400).json({
        error: "Preenche o nome, o email e a mensagem.",
      });
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!emailValido) {
      return response.status(400).json({
        error: "Introduz um endereço de email válido.",
      });
    }

    if (
      name.length > 100 ||
      email.length > 150 ||
      phone.length > 40 ||
      message.length > 5000
    ) {
      return response.status(400).json({
        error: "Um dos campos ultrapassa o tamanho permitido.",
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log("A enviar email para:", process.env.CONTACT_TO_EMAIL);

    const { data, error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ||
        "Pinho Arquitetura <onboarding@resend.dev>",

      to: [process.env.CONTACT_TO_EMAIL],

      // No SDK JavaScript é replyTo
      replyTo: email.trim(),

      subject: `Novo contacto pelo website — ${name.trim()}`,

      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#161616">
          <h2>Novo contacto através do website</h2>

          <p>
            <strong>Nome:</strong>
            ${escapeHtml(name.trim())}
          </p>

          <p>
            <strong>Email:</strong>
            ${escapeHtml(email.trim())}
          </p>

          <p>
            <strong>Telefone:</strong>
            ${escapeHtml(phone.trim() || "Não indicado")}
          </p>

          <hr
            style="border:0;border-top:1px solid #dddddd;margin:24px 0"
          />

          <p><strong>Mensagem:</strong></p>

          <p style="white-space:pre-wrap">
            ${escapeHtml(message.trim())}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Erro do Resend:", error);

      return response.status(500).json({
        error: error.message || "Não foi possível enviar a mensagem.",
      });
    }

    return response.status(200).json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Erro no formulário:", error);

    return response.status(500).json({
      error: "Ocorreu um erro ao enviar a mensagem.",
    });
  }
}