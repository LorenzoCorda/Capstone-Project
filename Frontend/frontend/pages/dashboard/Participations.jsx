import { useEffect, useState } from "react";
import { Spinner, Alert, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ParticipatedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipatedPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/participations/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPosts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedPosts();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (posts.length === 0)
    return <p>Non hai partecipato a nessun allenamento.</p>;

  return (
    <div>
      <h3 className="mb-4">Allenamenti a cui partecipi</h3>
      <Row>
        {posts.map((post) => (
          <Col key={post._id} xs={12} md={6} lg={3} className="mb-4">
            <Card className="shadow-sm h-100">
              {post.image && (
                <Card.Img
                  variant="top"
                  src={post.image}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.375rem",
                    borderTopRightRadius: "0.375rem",
                  }}
                />
              )}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <p>
                  <strong>Indirizzo:</strong> {post.location?.address}
                </p>
                <p>
                  <strong>Data:</strong> {new Date(post.date).toLocaleString()}
                </p>
                <p>
                  <strong>Max partecipanti:</strong> {post.maxParticipants}
                </p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/dashboard/posts/${post._id}`)}
                >
                  Dettagli
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ParticipatedPosts;
