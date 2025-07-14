import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  Button,
  Row,
  Col,
  ListGroup,
  Image,
} from "react-bootstrap";
import { ArrowBigLeft } from "lucide-react";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr2q63hgn/image/upload/v1751541166/user_oqtfxr.png";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const [postRes, userRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_SERVER_URL}/posts/${id}`),
          fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const postData = await postRes.json();
        const userData = await userRes.json();

        if (!postRes.ok) throw new Error(postData.message || "Errore post");
        if (!userRes.ok) throw new Error(userData.message || "Errore utente");

        setPost(postData.data);
        setCurrentUser(userData);

        if (userData._id === postData.data.author) {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/participations/${
              postData.data._id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const participantsData = await res.json();
          if (res.ok) setParticipants(participantsData.participants);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndUser();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return <p>Post non trovato.</p>;

  return (
    <>
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        <ArrowBigLeft />
      </Button>

      <Card className="p-4">
        <Row className="flex-column flex-md-row align-items-start">
          {post.image && (
            <Col md={4} className="mb-3 mb-md-0">
              <img
                src={post.image}
                alt="Post"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  maxHeight: "400px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </Col>
          )}
          <Col md={4} className="mb-3 mb-md-0">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <p>
              <strong>Luogo:</strong> {post.location?.city},{" "}
              {post.location?.address}
            </p>
            <p>
              <strong>Data:</strong> {new Date(post.date).toLocaleString()}
            </p>
            <p>
              <strong>Partecipanti max:</strong> {post.maxParticipants}
            </p>
          </Col>
          <Col md={4}>
            {currentUser?._id === post.author && (
              <div className="mt-4">
                <h5>Partecipanti</h5>
                {participants.length === 0 ? (
                  <p>Nessun partecipante finora.</p>
                ) : (
                  <ListGroup>
                    {participants.map((p) => (
                      <ListGroup.Item
                        key={p._id}
                        className="d-flex align-items-center"
                      >
                        <Image
                          src={p.userId.profileImage || DEFAULT_IMAGE}
                          roundedCircle
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                          className="me-3"
                        />
                        <div>
                          <strong>{p.userId.name}</strong> @{p.userId.username}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default PostDetails;
