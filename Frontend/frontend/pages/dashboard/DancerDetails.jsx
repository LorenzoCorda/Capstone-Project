import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { ArrowBigLeft } from "lucide-react";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const DancerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dancer, setDancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDancer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Errore nel caricamento");

        setDancer(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDancer();
  }, [id]);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!dancer) return <p>Ballerino non trovato.</p>;

  return (
    <>
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        <ArrowBigLeft />
      </Button>
      <Card className="p-4 shadow">
        <div className="d-flex flex-column align-items-start text-start">
          <img
            src={dancer.profileImage || DEFAULT_IMAGE}
            alt="Profilo"
            className="rounded-circle mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <h3>{dancer.name}</h3>
          <p className="text-muted">@{dancer.username}</p>
          <p>
            <strong>Email:</strong> {dancer.email}
          </p>
          <p>
            <strong>Bio:</strong> {dancer.bio || "N/A"}
          </p>
          <p>
            <strong>Città:</strong> {dancer.city || "N/A"}
          </p>
          <p>
            <strong>Stili:</strong>{" "}
            {dancer.styles && dancer.styles.length > 0 ? (
              dancer.styles.map((style, idx) => (
                <Badge key={idx} bg="primary" className="me-2">
                  {style}
                </Badge>
              ))
            ) : (
              <span>Nessuno</span>
            )}
          </p>
        </div>
      </Card>
    </>
  );
};

export default DancerDetails;
