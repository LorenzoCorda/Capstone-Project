import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 👈 IMPORTA

const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setLoading(false);

    setError("");
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Email o password sbagliate. Riprova.");
      }
      if (!data.user) {
        throw new Error("Utente non trovato. Registrati prima di accedere.");
      }

      if (!data.user.isVerified) {
        throw new Error("Devi prima verificare la tua email.");
      }

      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      handleModalClose();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore durante il login");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };
  /*  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error?.general ||
            data.error ||
            data.message ||
            "Email o password sbagliate"
        );
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore durante il login");
      }

      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      handleModalClose();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore durante il login");

      setPassword("");
    } finally {
      setLoading(false);
    }
  }; */

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!error}
              autoFocus
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!error}
              required
            />
          </Form.Group>
          <p className="text-start">
            <a href="/forgot-password">Password dimenticata?</a>
          </p>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Accesso...
              </>
            ) : (
              "Accedi"
            )}
          </Button>

          {/*  <Button variant="primary" type="submit" className="w-100">
            Accedi
          </Button> */}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
