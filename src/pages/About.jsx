import { motion } from "framer-motion";

export default function About() {
  return (
    <article className="about-v2 page-top">
      <section className="about-v2-title section-pad">
        <div className="page-title-row">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Sobre nós
          </motion.h1>

          <p>Arquitetura, do conceito à obra.</p>
        </div>
      </section>

      <section className="about-v2-intro section-pad">
        <div className="about-v2-intro-copy">
          <span className="section-index">
            PINHO ARQUITETURA
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
          >
            Uma década dedicada
            <br />
            ao <em>projeto.</em>
          </motion.h2>

          <p>
            Uma década dedicada ao projeto e à obra, com
            escalas, contextos e programas distintos —
            cultural, hoteleiro, público, urbano, industrial e
            residencial — sempre com o mesmo compromisso: um
            desenho preciso e uma leitura atenta do lugar.
            <br />
            <br />
            Experiência adquirida em diferentes gabinetes e
            empresas do setor, entre a arquitetura e a
            coordenação de projeto.
            <br />
            <br />
            Em abril de 2026, funda a Pinho Arquitetura.
          </p>

          <div className="about-v2-values">
            <span>Clareza</span>
            <span>Rigor</span>
            <span>Proximidade</span>
          </div>
        </div>

        <motion.figure
          className="about-v2-person"
          style={{
            width: "380px",
            maxWidth: "100%",
            margin: "0 auto",
            justifySelf: "center",
            alignSelf: "center",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            delay: 0.2,
          }}
        >
          <div
            className="about-v2-image"
            style={{
              width: "380px",
              maxWidth: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <img
              src="/logos/pinho_linkedin.png"
              alt="Diogo Pinho, arquiteto"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "68% 34%",
                borderRadius: "50%",
              }}
            />
          </div>

          <figcaption>
            <div>
              <strong>Diogo Pinho</strong>

              <span>
                Arquiteto e fundador da Pinho Arquitetura
              </span>
            </div>

            <span>Aveiro · Portugal</span>
          </figcaption>
        </motion.figure>
      </section>
    </article>
  );
}