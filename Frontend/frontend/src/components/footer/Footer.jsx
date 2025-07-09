import { Container, Row, Col } from "react-bootstrap";
import "../footer/Footer.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light p-5">
      <Container>
        <Row>
          <Col md={4} className="text-center">
            <h4 className="custom-info-title">BreakMeet</h4>
            <p className="fs-5">
              Connetti ballerini, trova sessioni, costruisci la tua esperienza
              con altri ballerini.
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h4 className="custom-info-title">Explore</h4>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light fs-5 text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-light fs-5 text-decoration-none"
                >
                  Chi siamo
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="text-center">
            <h4 className="custom-info-title">Contatti</h4>
            <p className="fs-5">Email: breakmeet.contact@gmail.com</p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <p className="text-center">
          &copy; {new Date().getFullYear()} BreakMeet. Tutti i diritti
          riservati.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
