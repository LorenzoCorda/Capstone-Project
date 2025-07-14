import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./InfoSectionGuest.css";

const InfoSectionGuest = () => {
  useEffect(() => {
    AOS.init({
      duration: 800, // durata in ms
      offset: 250,
    });
  }, []);

  return (
    <Container fluid className="custom-info-guest py-5 overflow-hidden">
      <Row className="align-items-center text-center text-md-start">
        <Col
          xs={12}
          md={7}
          className="order-2 order-md-1 px-4"
          data-aos="fade-right"
          data-aos-delay="160"
        >
          <h1 className="custom-question fw-bold text-white display-4 mb-3">
            Perché BreakMeet?
          </h1>
          <p className="fs-2 text-white mb-4">
            BreakMeet nasce per aiutare ballerini e ballerine di street dance a
            trovare compagni di allenamento ovunque si trovino.
          </p>
        </Col>

        <Col
          xs={12}
          md={5}
          className="order-1 order-md-2 px-4 mb-4 mb-md-0 d-flex justify-content-center"
          data-aos="fade-left"
          data-aos-delay="160"
        >
          <img
            src="/public/ElbowFreeze.JPG"
            alt="Ballerino sorridente"
            className="custom-img"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default InfoSectionGuest;
