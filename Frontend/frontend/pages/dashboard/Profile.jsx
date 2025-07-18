import { useState, useEffect } from "react";
import { Card, Button, Badge, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../../src/components/modals/EditProfileModal";
import "../dashboard/Profile.css";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  const getValidImage = (imgUrl) => {
    if (typeof imgUrl !== "string") return DEFAULT_IMAGE;
    if (imgUrl.startsWith("http") || imgUrl.startsWith("https")) return imgUrl;
    return DEFAULT_IMAGE;
  };

  const handleDeleteProfile = async () => {
    setLoadingDelete(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Errore durante l'eliminazione");
      }

      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      alert("Errore: " + err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  if (!user) return <p>Caricamento profilo...</p>;

  return (
    <>
      <h2 className="text-center mb-4">Profilo</h2>
      <div className="d-flex justify-content-center">
        <Card className="custom-card p-3 shadow ">
          <div className="custom-div-profile d-flex align-items-center">
            <img
              src={getValidImage(user.profileImage)}
              alt="Profile"
              className="rounded-circle custom-img-profile "
            />
            <div>
              <h4 className="mb-1 ms-2">{user.name}</h4>
              <p className="text-muted ms-2">@{user.username}</p>
            </div>
          </div>

          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
          <p>
            <strong>Città:</strong> {user.city}
          </p>
          <p>
            <strong>Stili:</strong>{" "}
            {user.styles.map((style, idx) => (
              <Badge key={idx} bg="primary" className="me-2">
                {style}
              </Badge>
            ))}
          </p>

          <div className="mt-4 d-flex gap-3 flex-wrap">
            <Button
              variant="outline-dark"
              style={{ maxWidth: "200px" }}
              onClick={() => setShowModal(true)}
            >
              Modifica profilo
            </Button>

            <Button
              variant="outline-danger"
              style={{ maxWidth: "200px" }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Elimina
            </Button>
          </div>
        </Card>

        <EditProfileModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          userData={user}
          onSave={(updated) => setUser(updated)}
        />

        <Modal
          show={showDeleteConfirm}
          onHide={() => setShowDeleteConfirm(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Conferma eliminazione</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Sei sicuro di voler <strong>eliminare il tuo profilo</strong>?
            Questa azione è irreversibile.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProfile}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Eliminazione...
                </>
              ) : (
                "Elimina definitivamente"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
