import { LogOut, Flame } from "lucide-react";
import {
  Navbar,
  Nav,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  /*  const renderIconLink = (href, icon, tooltipText, label) => (
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
  ); */

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Brand
            onClick={handleLogout}
            className="d-flex align-items-center fs-1"
            href="#"
          >
            <Flame size={32} className="me-2 mb-1 text-primary" />
            BreakMeet
          </Navbar.Brand>

          <Nav className="d-flex flex-row gap-3">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Logout</Tooltip>}
            >
              <Nav.Link
                onClick={handleLogout}
                className="d-flex align-items-center gap-2"
              >
                <LogOut size={24} />
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
