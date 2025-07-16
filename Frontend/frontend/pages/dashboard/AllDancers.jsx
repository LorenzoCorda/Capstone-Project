import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Pagination,
  Badge,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const AllDancers = () => {
  const [dancers, setDancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const pageSize = 4;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDancers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/users?page=${page}&pageSize=${pageSize}`,
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
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const getValidImage = (url) =>
    typeof url === "string" && url.startsWith("http")
      ? url
      : DEFAULT_PROFILE_IMAGE;

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (dancers.length === 0) return <p>Nessun ballerino trovato.</p>;

  return (
    <div>
      <h3 className="mb-4">Tutti i ballerini</h3>
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
    </div>
  );
};

export default AllDancers;

/* import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Pagination,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const AllDancers = () => {
  const [dancers, setDancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDancers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/users?page=${page}&pageSize=6`,
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
  }, [page]);

  const handlePageChange = (number) => {
    setPage(number);
  };

  const getValidImage = (url) => {
    return typeof url === "string" && url.startsWith("http")
      ? url
      : DEFAULT_PROFILE_IMAGE;
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (dancers.length === 0) return <p>Nessun ballerino trovato.</p>;

  return (
    <div>
      <h3 className="mb-4">Tutti i ballerini</h3>
      <Row>
        {dancers.map((user) => (
          <Col key={user._id} xs={12} md={6} lg={3} className="mb-4">
            <Card
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/dashboard/dancers/${user._id}`)}
              className="shadow-sm h-100"
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
    </div>
  );
};

export default AllDancers;
 */
