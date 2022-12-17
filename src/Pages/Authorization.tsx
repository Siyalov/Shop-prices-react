import { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import sha256 from 'crypto-js/sha256'

export default function Authorization() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const onAuthorization: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    console.log({
      username,
      password: sha256(password).toString()
    });
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
            <Button variant="primary" type="submit" onClick={onAuthorization}>
              Войти
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  </Container>
}