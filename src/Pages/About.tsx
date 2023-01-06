import { Col, Row } from "react-bootstrap";
import { Github } from "react-bootstrap-icons";

export default function About() {
  return <>
    <Row>
      <Col xs={12} style={{textAlign: "center"}}>
        <h1><Github size={32}/> Github:</h1>
        <a href="https://github.com/Siyalov/Shop-prices-react">
          <img alt="GitHub OpenGraph statistics" height="300px" src="https://opengraph.githubassets.com/9c370dce82aa0f8d2db791db8649d42e31b7a8ea2fab257ba8b04265144c973f/Siyalov/Shop-prices-react"/>
        </a>
      </Col>
      <Col xs={12} lg={6}>1</Col>
      <Col xs={12} lg={6}>2</Col>
    </Row>
  </>

}