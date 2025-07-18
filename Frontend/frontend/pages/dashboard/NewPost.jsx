import { useState, useEffect, useRef } from "react";
import { Form, Button, Spinner, Card, Alert } from "react-bootstrap";

const NewPost = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    date: "",
    maxParticipants: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const formattedAddress =
        place.formatted_address || autocompleteRef.current.value;
      setForm((prev) => ({ ...prev, address: formattedAddress }));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setLoading(true);

    try {
      const dateObj = new Date(form.date);
      const year = dateObj.getFullYear();
      if (year < 2025 || year.toString().length !== 4) {
        setErrors({ date: "Inserisci un anno valido dal 2025 in poi" });
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("date", form.date);
      formData.append("maxParticipants", form.maxParticipants);
      if (image) formData.append("image", image);

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || "Errore nella creazione" });
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setForm({
        title: "",
        description: "",
        address: "",
        date: "",
        maxParticipants: "",
      });
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (autocompleteRef.current) autocompleteRef.current.value = "";
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post">
      <h2 className="mb-4 text-center">Crea un nuovo allenamento</h2>
      <Card className="p-3">
        <Form onSubmit={handleSubmit}>
          {image && (
            <div className="d-flex flex-column align-items-center text-center mb-3">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                }}
              />
              <Button
                variant="outline-danger"
                onClick={handleRemoveImage}
                className="mt-2"
              >
                Rimuovi immagine
              </Button>
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Immagine</Form.Label>
            <Form.Control
              type="file"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              type="text"
              name="address"
              ref={autocompleteRef}
              defaultValue={form.address}
              onChange={handleChange}
            />
            {errors.address && (
              <div className="text-danger">{errors.address}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <div className="text-danger">{errors.date}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Max partecipanti</Form.Label>
            <Form.Control
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleChange}
            />
            {errors.maxParticipants && (
              <div className="text-danger">{errors.maxParticipants}</div>
            )}
          </Form.Group>

          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
          {success && (
            <Alert variant="success">Post creato con successo!</Alert>
          )}

          <Button type="submit" disabled={loading} className="mt-3">
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Caricamento...
              </>
            ) : (
              "Pubblica"
            )}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default NewPost;
