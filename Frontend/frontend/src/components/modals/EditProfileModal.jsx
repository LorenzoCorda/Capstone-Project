import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png"; // 👉 sostituisci con il tuo link reale

const EditProfileModal = ({ show, handleClose, userData, onSave }) => {
  const [form, setForm] = useState({
    nome: "",
    username: "",
    bio: "",
    city: "",
    styles: "",
    profileImage: "",
  });

  const fileInputRef = useRef(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData) {
      setForm({
        nome: userData.name || "",
        username: userData.username || "",
        bio: userData.bio || "",
        city: userData.city || "",
        styles: (userData.styles || []).join(", "),
        profileImage: userData.profileImage || "",
      });
      setRemoveImage(false);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, profileImage: previewUrl }));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, profileImage: "" }));
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const body = {
        name: form.nome,
        username: form.username,
        bio: form.bio,
        city: form.city,
        styles: form.styles
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        profileImage: form.profileImage,
        removeImage,
      };

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

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

  const isFormValid =
    form.nome.trim() && form.username.trim() && form.styles.trim();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Profilo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-3">
            <img
              src={form.profileImage || DEFAULT_IMAGE}
              alt="Anteprima"
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            />
            <Form.Control
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {form.profileImage && (
              <div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={handleRemoveImage}
                >
                  Rimuovi immagine
                </Button>
              </div>
            )}
          </div>

          {error && <p className="text-danger">{error}</p>}

          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={200}
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
            <Form.Label>Stili di danza (separati da virgola)</Form.Label>
            <Form.Control
              name="styles"
              value={form.styles}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isFormValid}
          >
            {loading ? <Spinner size="sm" animation="border" /> : "Salva"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
