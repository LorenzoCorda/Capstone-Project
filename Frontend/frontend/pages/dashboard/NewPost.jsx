import React, { useState } from "react";
import { Form, Button, Spinner, Alert, Card } from "react-bootstrap";

const NewPost = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    date: "",
    maxParticipants: "",
    /*   image: "", */
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          location: {
            city: form.city,
            address: form.address,
          },
          date: form.date,
          maxParticipants: form.maxParticipants,
          /*  image: form.image, */
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella creazione");

      setSuccess(true);
      setForm({
        title: "",
        description: "",
        city: "",
        address: "",
        date: "",
        maxParticipants: "",
        /*  image: "", */
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post">
      <h2 className="mb-4">Crea un nuovo allenamento</h2>
      <Card className="p-3">
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Post creato con successo!</Alert>
          )}

          <Form.Group className="mb-1">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>Città</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Label>Max partecipanti</Form.Label>
            <Form.Control
              type="number"
              name="maxParticipants"
              min="1"
              value={form.maxParticipants}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/*  <Form.Group className="mb-1">
            <Form.Label>Immagine URL (opzionale)</Form.Label>
            <Form.Control
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
            />
          </Form.Group> */}

          <Button
            variant="primary"
            type="submit"
            disabled={
              !form.title.trim() ||
              !form.description.trim() ||
              !form.city.trim() ||
              !form.address.trim() ||
              !form.date ||
              !form.maxParticipants
            }
          >
            Pubblica
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default NewPost;
