import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [participatedIds, setParticipatedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // FETCH UTENTE
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCurrentUser(data);
        }
      } catch (err) {
        console.error("Errore nel recupero utente:", err);
      }
    };
    fetchUser();
  }, []);

  // FETCH POST & PARTECIPAZIONI
  useEffect(() => {
    const fetchRecentPosts = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts?page=1&pageSize=20`
      );
      const data = await res.json();
      if (res.ok && currentUser) {
        const othersPosts = data.posts.filter(
          (p) => p.author?._id !== currentUser._id
        );
        setRecentPosts(othersPosts.slice(0, 4));
      }
    };

    const fetchParticipations = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/participations/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const ids = data.data.map((p) => p._id);
        setParticipatedIds(new Set(ids));
      }
    };

    if (currentUser) {
      setLoading(true);
      Promise.all([fetchRecentPosts(), fetchParticipations()]).finally(() =>
        setLoading(false)
      );
    }
  }, [currentUser]);

  const handleParticipation = async (postId) => {
    const isParticipating = participatedIds.has(postId);
    const url = `${import.meta.env.VITE_SERVER_URL}/participations${
      isParticipating ? `/${postId}` : ""
    }`;

    const res = await fetch(url, {
      method: isParticipating ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: isParticipating ? null : JSON.stringify({ postId }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);
    const updated = new Set(participatedIds);
    isParticipating ? updated.delete(postId) : updated.add(postId);
    setParticipatedIds(updated);
  };

  if (loading || !currentUser) return <Spinner animation="border" />;
  if (!recentPosts.length)
    return <p>Nessun post recente disponibile al momento.</p>;

  return (
    <div className="p-4">
      <h1 className="mb-5 text-center">Benvenuto nella tua Dashboard</h1>

      <h2 className="mb-3 text-center">Allenamenti recenti</h2>
      <Row>
        {recentPosts.map((post) => {
          const isParticipating = participatedIds.has(post._id);
          const isFull =
            post.maxParticipants &&
            post.currentParticipantsCount >= post.maxParticipants;

          return (
            <Col key={post._id} xs={12} sm={6} lg={3} className="mb-4">
              <Card
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/posts/${post._id}`)}
                className="h-100"
              >
                {post.image && (
                  <Card.Img
                    variant="top"
                    src={post.image}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <p>
                    <strong>Indirizzo:</strong> {post.location?.address}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(post.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Max partecipanti:</strong> {post.maxParticipants}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant={
                        isParticipating
                          ? "danger"
                          : isFull
                          ? "secondary"
                          : "outline-success"
                      }
                      disabled={isFull && !isParticipating}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleParticipation(post._id);
                      }}
                    >
                      {isParticipating
                        ? "Annulla"
                        : isFull
                        ? "Completo"
                        : "Partecipa"}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            post.location?.address
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      Maps
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default DashboardHome;
