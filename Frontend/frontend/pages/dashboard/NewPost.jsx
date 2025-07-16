import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Spinner, Alert, Card } from "react-bootstrap";

const NewPost = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    date: "",
    maxParticipants: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const autocompleteRef = useRef(null);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const date = new Date(form.date);
      const year = date.getFullYear();
      if (year < 2025 || year.toString().length !== 4) {
        setError("Inserisci un anno valido dal 2025 in poi (4 cifre)");
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

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella creazione");

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
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Immagine del post</Form.Label>
            {image && (
              <div className="mt-2 d-flex flex-column align-items-center">
                <p className="mb-1">Anteprima:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Anteprima"
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
                  size="sm"
                  className="mt-2"
                  onClick={handleRemoveImage}
                >
                  Rimuovi immagine
                </Button>
              </div>
            )}
            <Form.Control
              type="file"
              className="mt-4"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Indirizzo</Form.Label>
            <input
              type="text"
              ref={autocompleteRef}
              placeholder="Inserisci un indirizzo"
              defaultValue={form.address}
              className="form-control"
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
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

          {error && <Alert variant="danger">{error}</Alert>}
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

/* import React, { useState } from "react";
import { Form, Button, Spinner, Alert, Card } from "react-bootstrap";

const NewPost = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    date: "",
    maxParticipants: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const date = new Date(form.date);
      const year = date.getFullYear();
      if (year < 2025 || year.toString().length !== 4) {
        setError("Inserisci un anno valido dal 2025 in poi (4 cifre)");
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

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore nella creazione");

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
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Immagine del post</Form.Label>
            {image && (
              <div className="mt-2 d-flex flex-column align-items-center">
                <p className="mb-1">Anteprima:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Anteprima"
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
                  size="sm"
                  className="mt-2"
                  onClick={handleRemoveImage}
                >
                  Rimuovi immagine
                </Button>
              </div>
            )}
            <Form.Control
              type="file"
              className="mt-4"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Indirizzo</Form.Label>
            <place-autocomplete-element
              id="autocomplete"
              placeholder="Inserisci un indirizzo"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
              value={form.address}
              onPlaceChange={(e) => {
                const address = e.target.value;
                setForm((prev) => ({ ...prev, address }));
              }}
            ></place-autocomplete-element>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Data e ora</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
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

          {error && <Alert variant="danger">{error}</Alert>}
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

export default NewPost; */
