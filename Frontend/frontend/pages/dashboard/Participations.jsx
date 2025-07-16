import { useEffect, useState } from "react";
import {
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Button,
  Pagination,
} from "react-bootstrap";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const ParticipatedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 4;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem("token");

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchParticipatedPosts = async () => {
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
        setPosts(data.data);
        setTotalPages(Math.ceil(data.data.length / postsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedPosts();
  }, []);

  const handleUnparticipate = async (postId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/participations/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const updated = posts.filter((p) => p._id !== postId);
      setPosts(updated);
      setTotalPages(Math.ceil(updated.length / postsPerPage));
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (number) => {
    setSearchParams({ page: number });
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (posts.length === 0)
    return <p>Non hai partecipato a nessun allenamento.</p>;

  return (
    <div>
      <h3 className="mb-4">Allenamenti a cui partecipi</h3>
      <Row>
        {paginatedPosts
          .filter((post) => post)
          .map((post) => (
            <Col key={post._id} xs={12} md={6} lg={3} className="mb-4">
              <Card
                className="shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/posts/${post._id}`)}
              >
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
                    <strong>Data:</strong>{" "}
                    {new Date(post.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Max partecipanti:</strong> {post.maxParticipants}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnparticipate(post._id);
                      }}
                    >
                      Annulla
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
          ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={currentPage === idx + 1}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ParticipatedPosts;

/* import { useEffect, useState } from "react";
import { Spinner, Alert, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ParticipatedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchParticipatedPosts = async () => {
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
        setPosts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedPosts();
  }, []);

  const handleUnparticipate = async (postId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/participations/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (posts.length === 0)
    return <p>Non hai partecipato a nessun allenamento.</p>;

  return (
    <div>
      <h3 className="mb-4">Allenamenti a cui partecipi</h3>
      <Row>
        {posts
          .filter((post) => post) // scarta eventuali elementi null
          .map((post) => (
            <Col key={post._id} xs={12} md={6} lg={3} className="mb-4">
              <Card
                className="shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/posts/${post._id}`)}
              >
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
                    <strong>Data:</strong>{" "}
                    {new Date(post.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Max partecipanti:</strong> {post.maxParticipants}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnparticipate(post._id);
                      }}
                    >
                      Annulla
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
          ))}
      </Row>
    </div>
  );
};

export default ParticipatedPosts; */
