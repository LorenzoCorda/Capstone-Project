import { Container, Row, Col } from "react-bootstrap";
import "./FeaturesSectionGuest.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import firstPhoto from "../../../public/DM.jpg";
import secondPhoto from "../../../public/Me.jpg";
import thirdPhoto from "../../../public/Dirty.jpg";

const FeaturesSectionGuest = () => {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    AOS.init({
      duration: 800,
      offset: isMobile ? 300 : 160,
    });
  }, []);
  return (
    <section className="features-section py-5 overflow-hidden">
      <Container>
        <h2 className="custom-question text-center mb-5 fw-bold display-3">
          Non solo allenamento
        </h2>
        <Row className="g-4">
          <Col md={4} data-aos="zoom-in" data-aos-delay="150">
            <div className="custom-box text-center px-3">
              <img className="rounded w-100 mb-3 " src={firstPhoto} alt="" />
              <h3 className="fw-bold">Allenati con altri dancer</h3>
              <p className="custom-content">
                Condividi passione e fatica, qui trovi persone con la tua stessa
                energia.
              </p>
            </div>
          </Col>
          <Col md={4} data-aos="zoom-in" data-aos-delay="300">
            <div className="custom-box text-center px-3">
              <img className="rounded w-100 mb-3 " src={secondPhoto} alt="" />

              <h3 className="fw-bold">Crea connessioni</h3>
              <p className=" custom-content">
                Conosci altri breaker, entra in contatto con ballerini della tua
                città.
              </p>
            </div>
          </Col>
          <Col md={4} data-aos="zoom-in" data-aos-delay="450">
            <div className="custom-box text-center px-3">
              <img className="rounded w-100 mb-3 " src={thirdPhoto} alt="" />

              <h3 className="fw-bold">Cresci come ballerino</h3>
              <p className="custom-content">
                Scambia feedback, trova ispirazione, migliora il tuo flow con il
                supporto della community.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSectionGuest;
