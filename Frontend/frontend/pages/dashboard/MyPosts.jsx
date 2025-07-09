import { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert, Row, Col, Modal } from "react-bootstrap";
import EditPostModal from "../../src/components/modals/EditPostModal";

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

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

      setMyPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = (updatedPost) => {
    setMyPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (myPosts.length === 0) return <p>Nessun post creato.</p>;

  return (
    <div className="my-posts">
      <h3 className="mb-4">I miei allenamenti</h3>
      <Row>
        {myPosts.map((post) => (
          <Col key={post._id} xs={12} md={6} lg={3} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description}</Card.Text>

                <p className="mb-1">
                  <strong>Luogo:</strong>{" "}
                  {post.location?.city || "Non specificata"}
                </p>
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

                <Row className="mt-3">
                  <Col>
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
