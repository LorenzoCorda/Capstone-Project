import { useState, useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import EditProfileModal from "../../src/components/modals/EditProfileModal";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  if (!user) return <p>Caricamento profilo...</p>;

  return (
    <>
      <Card className="p-2 shadow w-100">
        <div className="d-flex align-items-center mb-4">
          <img
            src={getValidImage(user.profileImage)}
            alt="Profile"
            className="rounded-circle custom-img-profile ms-3 mt-3 me-4"
          />
          <div>
            <h4 className="mb-1">{user.name}</h4>
            <p className="text-muted mb-0">@{user.username}</p>
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

        <Button
          variant="outline-dark"
          className="mt-3"
          style={{ maxWidth: "200px" }}
          onClick={() => setShowModal(true)}
        >
          Modifica profilo
        </Button>
      </Card>

      <EditProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        userData={user}
        onSave={(updated) => setUser(updated)}
      />
    </>
  );
};

export default Profile;
