import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Info, Mail, PlayCircle, Flame } from "lucide-react";
import "../guestNavigation/NavigationGuest.css";

const NavigationGuest = () => {
  const renderIconLink = (href, icon, tooltipText, label) => (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>{tooltipText}</Tooltip>}
      key={href}
    >
      <Nav.Link href={href} className="d-flex align-items-center gap-2">
        {icon}
        {label && <span className="d-lg-none">{label}</span>}
      </Nav.Link>
    </OverlayTrigger>
  );

  return (
    <Navbar expand="lg" className="bg-white py-3">
      <Container fluid className="overflow-hidden">
        <div className="d-none d-lg-flex align-items-center w-100 justify-content-between">
          <div className="custom-div-title d-flex align-items-center gap-3">
            <Navbar.Brand className="d-flex align-items-center fs-1" href="/">
              <Flame size={35} className="me-2 mb-2 text-primary" />
              BreakMeet
            </Navbar.Brand>

            <Nav className="d-flex flex-row align-items-center gap-3">
              {renderIconLink("/about", <Info size={30} />, "Chi siamo")}
              {renderIconLink("/contact", <Mail size={30} />, "Contatti")}
            </Nav>
          </div>
        </div>

        <div className="d-flex d-lg-none justify-content-between align-items-center w-100">
          <Navbar.Brand
            className="d-flex align-items-center custom-div-title"
            href="/"
          >
            <Flame size={30} className="me-1 mb-3 text-primary" />
            <h1>BreakMeet</h1>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbarGuest"
            className="border-0"
          />
        </div>

        <Navbar.Offcanvas
          id="offcanvasNavbarGuest"
          aria-labelledby="offcanvasNavbarGuestLabel"
          placement="end"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarGuestLabel">
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column gap-3">
              {renderIconLink(
                "/about",
                <Info size={22} />,
                "Chi siamo",
                "Chi siamo"
              )}
              {renderIconLink(
                "/contact",
                <Mail size={22} />,
                "Contatti",
                "Contatti"
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavigationGuest;
