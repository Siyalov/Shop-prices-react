import { Col, Container, Figure, Row } from "react-bootstrap";
import { Github } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <Container>
      <Row style={{ textAlign: "center" }}>
        <Col xs={12}>
          <h3>{t("aboutProject.header")}</h3>
          <h4>{t("aboutProject.shortDescription")}</h4>
          <h4>
            <div style={{ display: "inline-block", textAlign: "left" }}>
              <ul>
                <li>
                  <a href="https://s-kaupat.fi">
                    S-market (Kristiinankaupunki)
                  </a>
                </li>
                <li>
                  <a href="https://k-ruoka.fi">
                    K-Supermarket Selleri (Kristiinankaupunki)
                  </a>
                </li>
              </ul>
            </div>
          </h4>
        </Col>

        <Col xs={12}>
          <h1>
            <Github size={32} /> Github:
          </h1>
          <a href="https://github.com/Siyalov/Shop-prices-react">
            <img
              alt="GitHub OpenGraph statistics"
              style={{width: "75vw"}}
              src={`https://opengraph.githubassets.com/${Math.random()}/Siyalov/Shop-prices-react`}
            />
          </a>
        </Col>

        <Col xs={12} style={{ textAlign: "center" }}>
          <h2>{t("aboutProject.developers")}</h2>
        </Col>

        <Col xs={12} lg={5} className="developer-card">
          <Figure>
            <Figure.Image
              style={{ borderRadius: "50%", maxHeight: "50vh" }}
              src="https://avatars.githubusercontent.com/u/91375207?v=4"
            />
          </Figure>
          <h3>
            <a href="https://github.com/Siyalov">@Siyalov (Ilya Siyalov)</a>
          </h3>
          <div style={{ display: "inline-block", textAlign: "left" }}>
            <ul>
              <li>
                Frontend
                <ul>
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>React-bootstrap</li>
                  <li>Apex charts</li>
                </ul>
              </li>
            </ul>
          </div>
        </Col>

        <Col xs={12} lg={5} className="developer-card">
          <Figure>
            <Figure.Image
              style={{ borderRadius: "50%", maxHeight: "50vh" }}
              src="https://avatars.githubusercontent.com/u/20732860?v=4"
            />
          </Figure>
          <h3>
            <a href="https://github.com/Irelynx">
              @Irelynx (Viacheslav Zakharov)
            </a>
          </h3>
          <div style={{ display: "inline-block", textAlign: "left"  }}>
            <ul>
              <li>Frontend (Vue, React)</li>
              <li>Mentoring (JavaScript/TypeScript)</li>
              <li>
                Backend:
                <ul>
                  <li>Node.js</li>
                  <li>TypeScript</li>
                  <li>Express</li>
                  <li>PostgreSQL</li>
                </ul>
              </li>
            </ul>
          </div>
        </Col>

      </Row>
    </Container>
  );
}
