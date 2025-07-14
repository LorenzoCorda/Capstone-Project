import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import AddressAutocomplete from "../forms/AddressAutocomplete";
import { useGoogleMapsLoader } from "../../hooks/UseGoogleMapsLoader";

const EditPostModal = ({ show, handleClose, postData, onSave }) => {
  const mapsLoaded = useGoogleMapsLoader();
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    date: "",
    maxParticipants: "",
  });

  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postData) {
      const location = postData.location || {};
      setForm({
        title: postData.title || "",
        description: postData.description || "",
        address: location.address || "",
        date: postData.date
          ? new Date(postData.date).toISOString().slice(0, 16)
          : "",
        maxParticipants: postData.maxParticipants || "",
      });

      setExistingImage(postData.image || "");
      setNewImage(null);
    }
  }, [postData]);

  useEffect(() => {
    if (!show) {
      setNewImage(null);
      setExistingImage(postData?.image || "");
    }
  }, [show, postData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setExistingImage("");
    setNewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("date", form.date);
      formData.append("maxParticipants", form.maxParticipants);

      if (newImage) {
        formData.append("image", newImage);
      } else if (!existingImage) {
        throw new Error("È obbligatorio aggiungere una foto al post.");
      }

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postData._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          data?.data?.[0]?.msg || data?.message || "Errore aggiornamento";
        throw new Error(errorMsg);
      }

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
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Immagine</Form.Label>
            {newImage || existingImage ? (
              <div className="mb-2 text-center">
                <img
                  src={newImage ? URL.createObjectURL(newImage) : existingImage}
                  alt="Anteprima"
                  style={{
                    width: "100%",
                    maxWidth: "240px",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #dee2e6",
                  }}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2 d-block mx-auto"
                  onClick={handleRemoveImage}
                >
                  Rimuovi immagine
                </Button>
              </div>
            ) : null}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          </Form.Group>

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
            <Form.Label>Indirizzo</Form.Label>
            {mapsLoaded ? (
              <AddressAutocomplete
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
                onSelect={(address, city) =>
                  setForm((prev) => ({ ...prev, address, city }))
                }
                mapsLoaded={mapsLoaded}
              />
            ) : (
              <Form.Control
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              min="2025-01-01T00:00"
              max="2050-12-31T23:59"
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

          {error && <p className="text-danger">{error}</p>}

          <Button type="submit" disabled={loading} variant="primary">
            {loading ? <Spinner size="sm" animation="border" /> : "Salva"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostModal;
