import { backendURL } from "../settings";
import {
  Product,
  PaginatedResponse,
  Shop,
  ShopWithProducts,
  ServerErrorResponse,
} from "./server.typings";

export type ProductsResponse = PaginatedResponse<Product>;
export type ShopsResponse = PaginatedResponse<Shop>;

interface GetProductsOptions {
  /** отображать баркоды в ответе */
  barcodes?: boolean;
  /** отображать цены в ответе */
  prices?: boolean;
  /** отображать магазины в ответе */
  shops?: boolean;
  /** строка поиска */
  q?: string;
  /** номер страницы для пагинации */
  page?: number;
  /** количество продуктов на странице */
  pageSize?: number;
  /** порядок сортировки (desc - от Я до А, asc - от А до Я, по умолчанию - desc) */
  order?: "DESC" | "ASC" | "asc" | "desc";
  /** поле сортировки (по умолчанию - createdAt) */
  sortBy?: "id" | "hidden" | "name" | "createdAt" | "updatedAt";
}

interface GetShopsOptions {
  /** строка поиска */
  q?: string;
  /** номер страницы для пагинации */
  page?: number;
  /** количество магазинов на странице */
  pageSize?: number;
  /** порядок сортировки (desc - от Я до А, asc - от А до Я, по умолчанию - desc) */
  order?: "DESC" | "ASC" | "asc" | "desc";
  /** поле сортировки (по умолчанию - createdAt) */
  sortBy?: "id" | "hidden" | "name" | "createdAt" | "updatedAt";
}

export class API {
  /**
   * Получение списка товаров с пагинацией
   */
  async getProducts(options: GetProductsOptions = {}) {
    const url = new URL(`${backendURL}/products`);
    url.searchParams.set("barcodes", "");
    url.searchParams.set("shops", "");
    url.searchParams.set("prices", "");
    if (options) {
      for (const key in options) {
        url.searchParams.set(
          key,
          options[key as keyof typeof options]?.toString?.() || ""
        );
      }
    }

    // TODO: move duplicate code (status code, content-type and errors check) to `API.request(url, options)` method
    const response = await fetch(url);
    if (!response.headers.get("content-type")?.includes("json")) {
      throw new Error("Server response does not contain JSON!");
    }

    if (response.ok) {
      const data: ProductsResponse = await response.json();
      return data;
    } else {
      const data: ServerErrorResponse = await response.json();
      if (typeof data.message === "string") {
        throw new Error(data.message);
      } else {
        console.error(data.message);
        throw new Error("See console output for more information");
      }
    }
  }

  /**
   * Получение существующего товара
   */
  async getProduct(id: string) {
    const url = new URL(`${backendURL}/products/${id}`);

    const response = await fetch(url);
    const data: Product = await response.json();
    return data;
  }

  /**
   * Получение ссылки на картинку товара
   */
  getProductImageURL(product: Product) {
    if (!product.barcodes?.length) {
      return "";
    }
    const ean = product.barcodes[0];
    return new URL(`${backendURL}/images/static/${ean}`).toString();
  }

  /**
   * Получение существующего магазина с товарами
   * 
   * > **ВНИМАНИЕ**: с сервера придет МНОГО данных с историей о ценах товаров и всеми товарами в магазине!
   */
  async getShops(options: GetShopsOptions) {
    const url = new URL(`${backendURL}/shops`);
    if (options) {
      for (const key in options) {
        url.searchParams.set(
          key,
          options[key as keyof typeof options]?.toString?.() || ""
        );
      }
    }

    // TODO: move duplicate code (status code, content-type and errors check) to `API.request(url, options)` method
    const response = await fetch(url);
    if (!response.headers.get("content-type")?.includes("json")) {
      throw new Error("Server response does not contain JSON!");
    }

    const data: ShopsResponse = await response.json();
    return data;
  }

  /**
   * Получение списка магазинов
   */
  async getShop(id: string) {
    const url = new URL(`${backendURL}/shops/${id}`);

    const response = await fetch(url);
    const data: ShopWithProducts = await response.json();
    return data;
  }
}

const api = new API();

export default api;
