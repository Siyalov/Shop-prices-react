import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Api/api";
import { Product as ProductType } from "../Api/server.typings";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Figure,
  Table,
  ButtonGroup,
  Button,
  Alert,
} from "react-bootstrap";
import { shops } from '../settings';

async function loadProduct(
  productId: string,
  setProduct: (product: ProductType) => void
) {
  const product = await api.getProduct(productId, { shopId: shops });
  setProduct(product);
}

function getLastShopPrice(product: ProductType, shopId: string) {
  const shopPrices = product.prices?.filter((price) => price.shopId === shopId);
  shopPrices?.sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );
  return shopPrices?.[0];
}

export default function Product() {
  const params = useParams() as { id: string };
  const [product, setProduct] = useState<ProductType>();
  const [cnt, setCnt] = useState(0);
  // params.id
  useEffect(() => {
    loadProduct(params.id, setProduct);
  }, [params.id]);

  return (
    <Container>
      {product?.id ? (
        <>
          <Row>
            <Col xs={12}>
              <h1>{product.name}</h1>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Figure>
                <Figure.Image src={api.getProductImageURL(product)} />
              </Figure>
            </Col>
            <Col xs={12} md={4}>
              <Row>
                <Col md={6}>
                  <ButtonGroup>
                    <Button
                      size="sm"
                      variant="light"
                      disabled={!cnt}
                      onClick={(e) => setCnt(cnt - 1)}
                    >
                      -
                    </Button>
                    <Button size="sm" variant="light" disabled>
                      {cnt}
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      onClick={(e) => setCnt(cnt + 1)}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </Col>
                <Col md={6}>
                  <Button size="sm" variant="warning">
                    В корзину
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <h2>Описание</h2>
              {/* <p>{product.description}</p> */}
            </Col>
            <Col xs={12}>
              <h2>Характеристики</h2>
              <Table hover>
                <tbody>
                  <tr>
                    <th>Вес</th>
                    <th>{product.measurements?.netWeight || '???'} кг</th>
                  </tr>
                  <tr>
                    <th>Цена</th>
                    <th>
                      <table>
                        {
                          product.shops?.map((shop) => {
                            if (!shops.includes(shop.id)) return '';
                            const price = getLastShopPrice(product, shop.id);
                            return <tr>
                              <td>{price?.price.toFixed(2)} €</td>
                              <td></td>
                              <td>{shop.name}</td>
                              <td>{((price?.price || 0) * cnt).toFixed(2)} €</td>
                            </tr>
                          })
                        }
                      </table>
                    </th>
                    {/* <th>{product.price} ₽ за 100 грамм</th> */}
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
        "Данные загружаются, подождите.."
      )}
    </Container>
  );
}
