import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";

const EditPostModal = ({ show, handleClose, postData, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    date: "",
    maxParticipants: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (postData) {
      setForm({
        title: postData.title || "",
        description: postData.description || "",
        city: postData.location?.city || "",
        address: postData.location?.address || "",
        date: postData.date
          ? new Date(postData.date).toISOString().slice(0, 16)
          : "",
        maxParticipants: postData.maxParticipants || "",
        image: postData.image || "",
      });
    }
  }, [postData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postData._id}`,
        {
          method: "PUT",
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
            image: form.image,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore aggiornamento");

      onSave(data.data);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <p className="text-danger">{error}</p>}

          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Città</Form.Label>
            <Form.Control
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max partecipanti</Form.Label>
            <Form.Control
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleChange}
              required
              min="1"
            />
          </Form.Group>

          <Button type="submit" disabled={loading} variant="primary">
            {loading ? <Spinner size="sm" animation="border" /> : "Salva"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostModal;
