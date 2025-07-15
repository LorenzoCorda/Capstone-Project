import { Flame } from "lucide-react";
import { Navbar, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
