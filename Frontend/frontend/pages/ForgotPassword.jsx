import { useState } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Errore generico");

      setMessage("Controlla la tua email per il link di reset password.");
    } catch (err) {
      setError(err.message || "Errore durante la richiesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Password dimenticata</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Inserisci la tua email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading} className="w-100">
          {loading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            "Invia email di reset"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default ForgotPassword;
