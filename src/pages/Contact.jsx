import { useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, Send } from "lucide-react";
import { useContent } from "../hooks/useContent";

const emptyForm = { name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const { content } = useContent();
  const settings = content.settings;
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [sending, setSending] = useState(false);

  const updateField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const sendEmail = async (event) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setFeedback("");
    setFeedbackType("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const textResponse = await response.text();
      let result = {};

      if (textResponse) {
        try {
          result = JSON.parse(textResponse);
        } catch {
          console.error("Resposta recebida do servidor:", textResponse);
          throw new Error("O servidor devolveu uma resposta inválida.");
        }
      }

      if (!response.ok) {
        throw new Error(result.error || "Não foi possível enviar a mensagem.");
      }

      setFeedback("Mensagem enviada com sucesso. Obrigado!");
      setFeedbackType("success");
      setForm(emptyForm);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro. Tenta novamente dentro de momentos.",
      );
      setFeedbackType("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-page page-top section-pad">
      <div className="page-title-row">
        <h1>Contactos</h1>
        <p>Vamos falar sobre o próximo projecto.</p>
      </div>

      <div className="contact-layout contact-layout--form">
        <div className="contact-form-column">
          <div className="contact-big">
            {settings.contactHeading || "Um bom projecto começa por ouvir."}
          </div>
          <p className="contact-intro">
            {settings.contactIntro ||
              "Conta-nos um pouco sobre o projecto. Respondemos assim que possível."}
          </p>

          <form className="contact-form" onSubmit={sendEmail}>
            <div className="contact-form-grid">
              <label>
                <span>Nome</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="O teu nome"
                  autoComplete="name"
                  maxLength="100"
                  required
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="nome@email.com"
                  autoComplete="email"
                  maxLength="150"
                  required
                />
              </label>
            </div>

            <label>
              <span>Telefone <small>opcional</small></span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+351"
                autoComplete="tel"
                maxLength="40"
              />
            </label>

            <label>
              <span>Mensagem</span>
              <textarea
                rows="6"
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Fala-nos um pouco sobre o projecto…"
                maxLength="5000"
                required
              />
            </label>

            <div className="contact-form-actions">
              <button type="submit" disabled={sending}>
                {sending ? "A enviar…" : "Enviar mensagem"}
                <Send size={17} />
              </button>
              {feedback && (
                <span
                  className={`contact-feedback contact-feedback--${feedbackType}`}
                  role="status"
                  aria-live="polite"
                >
                  {feedback}
                </span>
              )}
            </div>
          </form>
        </div>

        <aside className="contact-details">
          <span className="section-index">CONTACTO DIRECTO</span>
          <div className="contact-list">
            <div>
              <MapPin size={18} />
              <span>Morada</span>
              <b>{settings.address || "A definir no admin"}</b>
            </div>
            <div>
              <Mail size={18} />
              <span>Email</span>
              {settings.email ? (
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              ) : (
                <b>A definir no admin</b>
              )}
            </div>
            <div>
              <Phone size={18} />
              <span>Telefone</span>
              {settings.phone ? (
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              ) : (
                <b>A definir no admin</b>
              )}
            </div>
          </div>

          <div className="contact-socials">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight size={17} />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={17} />
              </a>
            )}
            {settings.website && (
              <a href={settings.website} target="_blank" rel="noreferrer">
                Website actual <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
