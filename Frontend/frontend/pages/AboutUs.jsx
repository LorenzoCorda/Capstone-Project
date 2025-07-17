import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import GuestLayout from "../layouts/GuestLayout";

const AboutPage = () => {
  return (
    <GuestLayout>
      <section className="py-5">
        <Container>
          <h1 className="custom-question text-center display-3 mb-4">
            Chi siamo
          </h1>

          <Row className="mb-5">
            <Col md={8} className="mx-auto">
              <p className="lead text-center">
                BreakMeet nasce dalla passione per la street dance e dal
                desiderio di creare connessioni reali tra ballerini e ballerine.
                Il nostro obiettivo è facilitare l’incontro tra dancer, ovunque
                si trovino, per condividere sessioni, allenamenti e ispirazione.
              </p>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col md={6}>
              <div className="mb-5">
                <h2 className="custom-question">Chi c’è dietro BreakMeet?</h2>
                <p>
                  Sono Lorenzo, sviluppatore e breaker. Dopo aver vissuto
                  qualche mese all'estero , mi sono trovato a cercare compagni
                  di allenamento, è stato molto difficile, senza passaparola era
                  impossibile trovarli, ma di questi tempi il passaparola non
                  basta più, ecco perchè è nata l’idea di BreakMeet: una
                  piattaforma pensata
                  <strong> da ballerino, per ballerini</strong>.
                </p>
              </div>

              <div className="mb-5">
                <h2 className="custom-question">I nostri valori</h2>
                <ul>
                  <li>
                    <strong>Comunità:</strong> lo spirito del breaking vive
                    nell’unione.
                  </li>
                  <li>
                    <strong>Accessibilità:</strong> chiunque può trovare o
                    creare sessioni.
                  </li>
                  <li>
                    <strong>Inclusività:</strong> ogni stile, ogni background è
                    benvenuto.
                  </li>
                </ul>
              </div>
              <div className="mt-5">
                <h3 className="custom-question">Contattaci</h3>
                <p>
                  Hai domande o proposte? Scrivici a:
                  <br />
                  <a href="mailto:breakmeet.contact@gmail.com">
                    breakmeet.contact@gmail.com
                  </a>
                </p>
              </div>
            </Col>
            <Col md={6}>
              <img
                src="/images/Me2.0.jpg"
                alt="Founder breaking"
                className="img-fluid align-items-center rounded shadow"
                style={{
                  height: "500px",
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </GuestLayout>
  );
};

export default AboutPage;
