import { useState, useEffect } from "react";
import { Card, Spinner, Alert, Pagination, Row, Col } from "react-bootstrap";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/posts?page=${currentPage}&pageSize=${pageSize}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Errore nel caricamento");

        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const renderPagination = () => {
    const items = [];
    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (posts.length === 0) return <p>Nessun post disponibile.</p>;

  return (
    <div className="all-posts">
      <h3 className="mb-4">Tutti gli allenamenti</h3>
      <Row>
        {posts.map((post) => (
          <Col key={post._id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              {post.image && (
                <Card.Img
                  variant="top"
                  src={post.image}
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.description}</Card.Text>
                <p className="mb-1">
                  <strong>Luogo:</strong> {post.location?.city || "N/D"}
                </p>
                <p className="mb-1">
                  <strong>Data:</strong> {new Date(post.date).toLocaleString()}
                </p>
                {post.maxParticipants && (
                  <p className="mb-1">
                    <strong>Max partecipanti:</strong> {post.maxParticipants}
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        {renderPagination()}
      </div>
    </div>
  );
};

export default AllPosts;
