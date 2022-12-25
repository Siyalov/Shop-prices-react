import { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import sha256 from 'crypto-js/sha256'
import api from '../Api/api';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const onRegister: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const result = await api.register({
      username,
      password: sha256(password).toString()
    });
    if (result.ok) {
      const authResult = await api.login({
        username,
        password: sha256(password).toString()
      });
      if (authResult.token) {
        api.setToken(authResult.token);
        // move to main page
        navigate('/');
      }
    }
  }
  return <Container>
    <Row className="justify-content-md-center mt-4">
      <Col xs lg="5">
        <Card body>
          <Form >
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control type="text" placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Form.Text className="text-muted">
                Введите свое имя!
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>            
            <Button variant="primary" type="submit" onClick={onRegister}>
              Зарегистрироваться
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  </Container>
}