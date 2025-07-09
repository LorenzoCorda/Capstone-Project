import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const SignUpModal = ({ show, handleClose }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [username, setUsername] = useState("");
  const [styles, setStyles] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setProfileImage(null);
    setName("");
    setSurName("");
    setUsername("");
    setStyles("");
    setEmail("");
    setPassword("");
    setErrors({});
    setLoading(false);
    setSuccess(false);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surName", surName);
      formData.append("username", username);
      formData.append("styles", styles);
      formData.append("email", email);
      formData.append("password", password);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error?.toLowerCase?.() || "";

        if (msg.includes("username")) {
          setErrors({ username: data.error });
        } else if (msg.includes("email")) {
          setErrors({ email: data.error });
        } else {
          setErrors(data.error || { general: "Errore nella registrazione" });
        }
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrors({ general: err.message || "Errore nella registrazione" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrati</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <div className="text-center p-4">
            <h4>Registrazione completata!</h4>
            <p>
              Controlla la tua email per confermare l’indirizzo prima di
              accedere alla dashboard.
            </p>
            <Button onClick={handleModalClose}>Chiudi</Button>
          </div>
        ) : (
          <Form onSubmit={handleSignUp}>
            {errors.general && <p className="text-danger">{errors.general}</p>}

            <div className="d-flex flex-column align-items-center mb-4">
              <label htmlFor="profileImageInput" style={{ cursor: "pointer" }}>
                <div
                  className="rounded-circle bg-secondary d-flex justify-content-center align-items-center overflow-hidden"
                  style={{ width: "120px", height: "120px" }}
                >
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : DEFAULT_IMAGE_URL
                    }
                    alt="Anteprima"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </label>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              {profileImage && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => setProfileImage(null)}
                >
                  Rimuovi immagine
                </Button>
              )}
            </div>

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: null }));
                }}
                isInvalid={!!errors.name}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSurname">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                value={surName}
                onChange={(e) => {
                  setSurName(e.target.value);
                  setErrors((prev) => ({ ...prev, surName: null }));
                }}
                isInvalid={!!errors.surName}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.surName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: null }));
                }}
                isInvalid={!!errors.username}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStyles">
              <Form.Label>Stili di danza</Form.Label>
              <Form.Control
                type="text"
                value={styles}
                onChange={(e) => {
                  setStyles(e.target.value);
                  setErrors((prev) => ({ ...prev, styles: null }));
                }}
                isInvalid={!!errors.styles}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.styles}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: null }));
                }}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: null }));
                }}
                isInvalid={!!errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

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
                  Registrazione...
                </>
              ) : (
                "Registrati"
              )}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
