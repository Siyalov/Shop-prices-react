import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Api/api";
import { Product as ProductType } from "../Api/server.typings";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from 'react-apexcharts';
import {
  Container,
  Row,
  Col,
  Figure,
  Table,
  ButtonGroup,
  Button,
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
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  console.log(shopPrices);
  return shopPrices?.[0];
}

export default function Product() {
  const params = useParams() as { id: string };
  const [product, setProduct] = useState<ProductType>();
  const [cnt, setCnt] = useState(0);
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: 'price-chart',
      // foreColor: "#999",
    },
    // colors: ['#00E396', '#0090FF'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        // offsetX: 14,
        // offsetY: -5
      },
      tooltip: {
        enabled: true
      }
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy"
      },
    },
  };

  const [chartData, setChartData] = useState<ApexAxisChartSeries | ApexNonAxisChartSeries>([]);

  useEffect(() => {
    const shops: { [key: string]: Array<Array<number>> } = {};
    const graphs: ApexAxisChartSeries | ApexNonAxisChartSeries = [];
    
    for(const price of (product?.prices || [])) {
      let name = price.shopName;

      if (!name) {
        // if name is not set, search in shops
        let currentShop;
        for (const shop of (product?.shops || [])) {
          if (shop.id === price.shopId) {
            currentShop = shop;
            break;
          }
        }
        if (currentShop) {
          name = currentShop.name;
        }
      }

      if (!shops[name]) shops[name] = [];
      shops[name].push([
        new Date(price.updatedAt).getTime(),
        price.price,
      ]);
    }

    for (const shopName in shops) {
      const graphObject = {
        name: shopName,
        data: shops[shopName],
      };
      graphObject.data.push([
        new Date().getTime(),
        graphObject.data[graphObject.data.length - 1][1]
      ]);
      // @ts-ignore TODO: fix
      graphs.push(graphObject);
    }

    setChartData(graphs);
    
  }, [product])

  // params.id
  useEffect(() => {
    loadProduct(params.id, setProduct);
  }, [params.id]);

  return (
    <Container>
      {product?.id ? (
        <Row>
          <Col xs={12} lg={7}>
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
                      <th>{product.measurements?.netWeight || 'coming soon...'} кг</th>
                    </tr>
                    <tr>
                      <th>Баркод</th>
                      <th>{product.barcode || 'coming soon...'} </th>
                    </tr>
                    <tr>
                      <th>Цена</th>
                      <th>
                        <Table>
                          {
                            product.shops?.map((shop) => {
                              if (!shops.includes(shop.id)) return '';
                              const price = getLastShopPrice(product, shop.id);
                              return <tr>
                                <td className="col-2">{price?.price.toFixed(2)} €</td>
                                <td className="col-8">{shop.name}</td>
                                <td className="col-2">{((price?.price || 0) * cnt).toFixed(2)} €</td>
                              </tr>
                            })
                          }
                        </Table>
                      </th>
                      {/* <th>{product.price} ₽ за 100 грамм</th> */}
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
          <Col xs={12} lg={5}>
            <Chart
              type='line'
              options={chartOptions}
              series={chartData}
            />
          </Col>
        </Row>
      ) : (
        "Данные загружаются, подождите.."
      )}
    </Container>
  );
}
