import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import {
  Home,
  PlusCircle,
  List,
  Dumbbell,
  Users,
  Bookmark,
  User,
  LogOut,
} from "lucide-react";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import Navigation from "../src/components/navigation/Navigation";
import Footer from "../src/components/footer/Footer";
import "../layouts/DashboardLayout.css";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: <Home size={24} /> },
  {
    to: "/dashboard/new-post",
    label: "Nuovo post",
    icon: <PlusCircle size={24} />,
  },
  {
    to: "/dashboard/my-posts",
    label: "I miei allenamenti",
    icon: <List size={24} />,
  },
  { to: "/dashboard/dancers", label: "Ballerini", icon: <Users size={24} /> },
  {
    to: "/dashboard/training",
    label: "Allenamenti",
    icon: <Dumbbell size={24} />,
  },
  {
    to: "/dashboard/participations",
    label: "Partecipazioni",
    icon: <Bookmark size={24} />,
  },
  { to: "/dashboard/profile", label: "Profilo", icon: <User size={24} /> },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <>
      <Navigation />

      <div className="dashboard-layout d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="sidebar d-flex flex-column align-items-center p-1">
          <Nav className="flex-column gap-3 align-items-center w-100">
            {/* Menu items normali */}
            {menuItems.map((item) => (
              <OverlayTrigger
                key={item.to}
                placement="right"
                overlay={<Tooltip>{item.label}</Tooltip>}
              >
                <Nav.Link
                  as={Link}
                  to={item.to}
                  className={`d-flex justify-content-center align-items-center rounded-circle ${
                    location.pathname === item.to ? "active" : ""
                  }`}
                  style={{ width: "100%", height: "48px" }}
                >
                  {item.icon}
                </Nav.Link>
              </OverlayTrigger>
            ))}

            {/* Logout separato */}
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Logout</Tooltip>}
            >
              <Nav.Link
                as="button"
                onClick={handleLogout}
                className="d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  width: "100%",
                  height: "48px",
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                }}
              >
                <LogOut size={24} />
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </div>

        {/* Main Content */}
        <div
          className="main-content p-4"
          style={{ flexGrow: 1, backgroundColor: "#fff" }}
        >
          <Outlet />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DashboardLayout;
