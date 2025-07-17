import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Modal,
  Pagination,
} from "react-bootstrap";
import EditPostModal from "../../src/components/modals/EditPostModal";
import { useNavigate, useSearchParams } from "react-router-dom";

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const postsPerPage = 4;

  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/posts/my-posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Errore nel caricamento dei post");

        setMyPosts(data.data || []);
        setTotalPages(Math.ceil((data.data || []).length / postsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const confirmDelete = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/posts/${postToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Errore durante l'eliminazione");
      }

      const updatedPosts = myPosts.filter((p) => p._id !== postToDelete._id);
      setMyPosts(updatedPosts);
      setTotalPages(Math.ceil(updatedPosts.length / postsPerPage));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = (updatedPost) => {
    const updatedPosts = myPosts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    );
    setMyPosts(updatedPosts);
  };

  const paginatedPosts = myPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  const changePage = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (myPosts.length === 0) return <p>Nessun post creato.</p>;

  return (
    <div className="my-posts">
      <h3 className="mb-4">I miei allenamenti</h3>
      <Row>
        {paginatedPosts.map((post) => (
          <Col
            key={post._id}
            xs={12}
            md={6}
            lg={3}
            className="mb-4 text-center"
          >
            <Card className="shadow-sm h-100">
              {post.image && (
                <Card.Img
                  variant="top"
                  src={post.image}
                  alt="Immagine del post"
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
                {post.location?.address && (
                  <p className="mb-1">
                    <strong>Indirizzo:</strong> {post.location.address}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Data:</strong> {new Date(post.date).toLocaleString()}
                </p>
                {post.maxParticipants && (
                  <p className="mb-1">
                    <strong>Max partecipanti:</strong> {post.maxParticipants}
                  </p>
                )}

                <Row>
                  <Col className="mb-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowModal(true);
                      }}
                    >
                      Modifica
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/posts/${post._id}?page=${page}`)
                      }
                    >
                      Dettagli
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(post)}
                    >
                      Elimina
                    </Button>
                  </Col>
                </Row>
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
                active={page === idx + 1}
                onClick={() => changePage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      <EditPostModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        postData={selectedPost}
        onSave={handleSave}
      />

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Conferma eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sei sicuro di voler eliminare il post "
          <strong>{postToDelete?.title}</strong>"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyPosts;
