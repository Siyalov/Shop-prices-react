import { useContext, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import sha256 from "crypto-js/sha256";
import api from "../Api/api";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import { useTranslation } from "react-i18next";

export default function Authorization() {
  const { setToken } = useContext(Context);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const onAuthorization: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    const authResult = await api.login({
      username,
      password: sha256(password).toString(),
    });

    if (authResult?.token) {
      setToken(authResult.token);
      // move to main page
      navigate("/");
    } else {
      setMessage(t("errors.authError") || "");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-4">
        <Col xs lg="5">
          <Card body>
            <Form>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>{t("userName")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("userName") || ""}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Text className="text-muted">
                  {t("enterYourUserName")}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>{t("password")}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={t("password") || ""}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" onClick={onAuthorization}>
                {t("signIn")}
              </Button>

              {message ? (
                <>
                  <br />
                  {message}
                </>
              ) : (
                ""
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
