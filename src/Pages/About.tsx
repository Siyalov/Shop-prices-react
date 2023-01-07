import { Col, Container, Figure, Row } from "react-bootstrap";
import { Github } from "react-bootstrap-icons";

export default function About() {
  return <Container>
    <Row style={{textAlign: "center"}}>
      <Col xs={12}>
        <h3>Веб приложение Shop-prices.</h3>
        <h4>
        Позволяет отследить динамику изменения цены римерно на 40,000 товаров в двух популярных сетевых магазинах Финляндии: 
        </h4>
        <h4>

        <div style={{display: "inline-block", textAlign: 'left'}}>
          <ul>
            <li><a href="https://s-kaupat.fi">S-market Kristiinankaupunki</a></li>  
            <li><a href="https://k-ruoka.fi">K-Supermarket Selleri (Kristiinankaupunki)</a></li>  
          </ul>
        </div>
        </h4>
      </Col>
      <Col xs={12} >
        <h1><Github size={32}/> Github:</h1>
        <a href="https://github.com/Siyalov/Shop-prices-react">
          <img alt="GitHub OpenGraph statistics" height="300px" src="https://opengraph.githubassets.com/9c370dce82aa0f8d2db791db8649d42e31b7a8ea2fab257ba8b04265144c973f/Siyalov/Shop-prices-react"/>
        </a>
      </Col>
      <Col xs={12} style={{textAlign: "center"}}><h2>Разработчики:</h2></Col>
      <Col xs={12} lg={5} className="developer-card">
        <Figure>
          <Figure.Image style={{borderRadius: "50%", maxHeight: '50vh'}} src="https://avatars.githubusercontent.com/u/91375207?v=4" />
        </Figure>
        <h3>
          <a href="https://github.com/Siyalov">@Siyalov (Ilya Siyalov)</a>
        </h3>
        <div style={{display: "inline-block", textAlign: 'left'}}>
          <ul>
            <li>Frontend
              <ul>
                <li>React</li>
                <li>TypeScript</li>
                <li>React-bootstrap</li>
              </ul>
            </li>
          </ul>
        </div>
      </Col>
      <Col xs={12} lg={5} className="developer-card">
        <Figure>
          <Figure.Image style={{borderRadius: "50%", maxHeight: '50vh'}} src="https://avatars.githubusercontent.com/u/20732860?v=4" />
        </Figure>
        <h3>
          <a href="https://github.com/Irelynx">@Irelynx (Viacheslav Zakharov)</a>
        </h3>
        <div style={{display: "inline-block"}}>
          <ul>
            <li>Frontend (React)</li>
            <li>Backend (Node.js)</li>
          </ul>
        </div>
      </Col>
    </Row>
  </Container>

}