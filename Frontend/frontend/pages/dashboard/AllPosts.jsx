import { useState, useEffect, useLayoutEffect } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [participatedPostIds, setParticipatedPostIds] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(4);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const changePage = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage });
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/posts?page=${page}&pageSize=${pageSize}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 🔥 Filtra post non scaduti
      const now = new Date();
      const futurePosts = data.posts.filter(
        (post) => new Date(post.date) > now
      );

      setPosts(futurePosts);
      setTotalPages(data.totalPages || 1); // opzionale: potresti ricalcolare se necessario
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
  }, [page]);

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

  if (loading || !currentUser) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="overflow-hidden">
      <div className="container">
        <h3 className="mb-4">Tutti gli allenamenti</h3>
        <Row className="g-3">
          {posts.map((post) => {
            const isAuthor = post.author && post.author._id === currentUser._id;
            const isParticipating = participatedPostIds.has(post._id);
            const isFull =
              post.maxParticipants !== undefined &&
              post.currentParticipantsCount >= post.maxParticipants;

            return (
              <Col
                key={post._id}
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                className="overflow-hidden"
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "100%",
                    maxWidth: "100%",
                    overflowX: "hidden",
                  }}
                  onClick={() => navigate(`/dashboard/posts/${post._id}`)}
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
                            ? "Annulla"
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
          <div style={{ width: "100%" }}>
            <Pagination className="justify-content-center mt-4 flex-wrap">
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={page === idx + 1}
                  onClick={() => changePage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPosts;

/* import { useState, useEffect, useLayoutEffect } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [participatedPostIds, setParticipatedPostIds] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(4); // sempre 5 post per pagina

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const changePage = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage });
  };

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
  }, [page]);

  const handleParticipation = async (postId) => {
    try {
      const isParticipating = participatedPostIds.has(postId);

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
      if (!res.ok) throw new Error(data.message);

      const updated = new Set(participatedPostIds);
      isParticipating ? updated.delete(postId) : updated.add(postId);
      setParticipatedPostIds(updated);
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  if (loading || !currentUser) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="overflow-hidden">
      <div className="container">
        <h3 className="mb-4">Tutti gli allenamenti</h3>
        <Row className="g-3">
          {posts.map((post) => {
            const isAuthor = post.author && post.author._id === currentUser._id;
            const isParticipating = participatedPostIds.has(post._id);
            const isFull =
              post.maxParticipants !== undefined &&
              post.currentParticipantsCount >= post.maxParticipants;

            return (
              <Col
                key={post._id}
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                className="overflow-hidden"
              >
                <Card
                  style={{
                    cursor: "pointer",
                    height: "100%",
                    maxWidth: "100%",
                    overflowX: "hidden",
                  }}
                  onClick={() => navigate(`/dashboard/posts/${post._id}`)}
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
                            ? "Annulla"
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
          <div style={{ width: "100%" }}>
            <Pagination className="justify-content-center mt-4 flex-wrap">
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={page === idx + 1}
                  onClick={() => changePage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPosts; */
