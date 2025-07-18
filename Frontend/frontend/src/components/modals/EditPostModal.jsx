import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

const EditPostModal = ({ show, handleClose, postData, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    date: "",
    maxParticipants: "",
  });

  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef();

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
      setFieldErrors({});
      setGeneralError("");
    }
  }, [postData]);

  useEffect(() => {
    if (!show) {
      setNewImage(null);
      setExistingImage(postData?.image || "");
    }
  }, [show, postData]);

  useEffect(() => {
    if (!autocompleteRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setForm((prev) => ({
        ...prev,
        address: place.formatted_address || "",
      }));
    });
  }, [autocompleteRef.current, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
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
    setLoading(true);
    setFieldErrors({});
    setGeneralError("");

    const clientErrors = {};
    if (form.title.trim().length < 2) {
      clientErrors.title = "Il titolo deve contenere almeno 2 caratteri";
    }
    if (form.description.trim().length < 5) {
      clientErrors.description =
        "La descrizione deve contenere almeno 5 caratteri";
    }
    if (!form.address.trim()) {
      clientErrors.address = "L'indirizzo è obbligatorio";
    }
    if (!form.date) {
      clientErrors.date = "La data è obbligatoria";
    }
    if (!form.maxParticipants || parseInt(form.maxParticipants) < 1) {
      clientErrors.maxParticipants = "Almeno 1 partecipante richiesto";
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setLoading(false);
      return;
    }

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
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data.message || "Errore durante l'aggiornamento");
      }

      onSave(data.data);
      handleClose();
    } catch (err) {
      setGeneralError(err.message);
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
          {/* Immagine */}
          <Form.Group className="mb-3">
            <Form.Label>Immagine</Form.Label>
            {(newImage || existingImage) && (
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
            )}
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
              isInvalid={!!fieldErrors.title}
              required
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              isInvalid={!!fieldErrors.description}
              required
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              ref={autocompleteRef}
              placeholder="Inserisci un indirizzo"
              isInvalid={!!fieldErrors.address}
              required
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              isInvalid={!!fieldErrors.date}
              required
              min="2025-01-01T00:00"
              max="2050-12-31T23:59"
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.date}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max partecipanti</Form.Label>
            <Form.Control
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleChange}
              isInvalid={!!fieldErrors.maxParticipants}
              min="1"
              required
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.maxParticipants}
            </Form.Control.Feedback>
          </Form.Group>

          {generalError && <p className="text-danger">{generalError}</p>}

          <Button type="submit" disabled={loading} variant="primary">
            {loading ? <Spinner size="sm" animation="border" /> : "Salva"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostModal;
