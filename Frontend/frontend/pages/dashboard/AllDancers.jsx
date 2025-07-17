import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Pagination,
  Badge,
  Form,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const AllDancers = () => {
  const [dancers, setDancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const pageSize = 4;

  const navigate = useNavigate();

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    const fetchDancers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/users?page=${page}&pageSize=${pageSize}&search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Errore nel caricamento");

        setDancers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDancers();
  }, [page, search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams({ search: inputValue, page: 1 });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handlePageChange = (newPage) => {
    setSearchParams({ search, page: newPage });
  };

  const getValidImage = (url) =>
    typeof url === "string" && url.startsWith("http")
      ? url
      : DEFAULT_PROFILE_IMAGE;

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h3 className="mb-4">Tutti i ballerini</h3>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Cerca per nome o username..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Form>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : dancers.length === 0 ? (
        <Alert variant="warning">Nessun utente trovato</Alert>
      ) : (
        <>
          <Row>
            {dancers.map((user) => (
              <Col key={user._id} xs={12} md={6} lg={3} className="mb-4">
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/dashboard/dancers/${user._id}?page=${page}`)
                  }
                >
                  <Card.Img
                    src={getValidImage(user.profileImage)}
                    alt={user.username}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      margin: "20px auto 10px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Text>@{user.username}</Card.Text>
                    <p className="mb-1">
                      <strong>Città:</strong> {user.city || "N/A"}
                    </p>
                    <p>
                      <strong>Stili:</strong>{" "}
                      {user.styles.map((style, idx) => (
                        <Badge key={idx} bg="primary" className="me-2">
                          {style}
                        </Badge>
                      ))}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={page === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default AllDancers;
