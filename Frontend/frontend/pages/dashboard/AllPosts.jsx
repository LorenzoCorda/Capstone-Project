import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Pagination,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [participatedPostIds, setParticipatedPostIds] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      if (width < 992) {
        setPageSize(2);
      } else {
        setPageSize(6);
      }
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/posts?page=${page}&pageSize=${pageSize}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPosts(data.posts);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMyParticipations = async () => {
    try {
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
      const ids = data.data.map((p) => p._id);
      setParticipatedPostIds(new Set(ids));
    } catch (err) {
      console.error("Partecipazioni errore:", err.message);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCurrentUser(data);
    } catch (err) {
      console.error("Errore fetch utente:", err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPosts(),
      fetchMyParticipations(),
      fetchCurrentUser(),
    ]).finally(() => setLoading(false));
  }, [page, pageSize]);

  const handleParticipation = async (postId) => {
    try {
      const isParticipating = participatedPostIds.has(postId);

      const url = `${import.meta.env.VITE_SERVER_URL}/participations$${
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
      if (!res.ok) throw new Error(data.message);

      const updated = new Set(participatedPostIds);
      isParticipating ? updated.delete(postId) : updated.add(postId);
      setParticipatedPostIds(updated);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container-fluid px-2">
      <h3 className="mb-4">Tutti gli allenamenti</h3>
      <Row className="g-3">
        {posts.map((post) => {
          const isAuthor = post.author?._id === currentUser?._id;
          const isParticipating = participatedPostIds.has(post._id);
          const isFull =
            post.maxParticipants !== undefined &&
            post.currentParticipantsCount >= post.maxParticipants;

          return (
            <Col key={post._id} xs={12} sm={6} md={6} lg={4} xl={4}>
              <Card
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/posts/${post._id}`)}
                className="shadow-sm h-100"
              >
                {post.image && (
                  <Card.Img
                    variant="top"
                    src={post.image}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>
                    {post.title}{" "}
                    {isAuthor && (
                      <Badge bg="success" className="ms-2">
                        Creato da te
                      </Badge>
                    )}
                  </Card.Title>
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
                  <div className="d-flex justify-content-between align-items-center">
                    {!isAuthor && (
                      <Button
                        variant={
                          isParticipating
                            ? "danger"
                            : isFull
                            ? "secondary"
                            : "outline-success"
                        }
                        disabled={isFull && !isParticipating}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleParticipation(post._id);
                        }}
                      >
                        {isParticipating
                          ? "Annulla partecipazione"
                          : isFull
                          ? "Completo"
                          : "Partecipa"}
                      </Button>
                    )}
                    {!isAuthor && (
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
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={page === idx + 1}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default AllPosts;
