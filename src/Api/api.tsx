import { backendURL } from "../settings";
import {
  Product,
  PaginatedResponse,
  Shop,
  ShopWithProducts,
  ServerErrorResponse,
  User,
} from "./server.typings";

export type ProductsResponse = PaginatedResponse<Product>;
export type ShopsResponse = PaginatedResponse<Shop>;

interface GetProductsOptions {
  /** строка поиска */
  q?: string;
  /** номер страницы для пагинации */
  page?: number;
  /** количество продуктов на странице */
  pageSize?: number;
  /** идентификатор магазина, может быть несколько (через запятую, например: `123,456,789`) */
  shopId?: string
  /** порядок сортировки (desc - от Я до А, asc - от А до Я, по умолчанию - desc) */
  // order?: "DESC" | "ASC" | "asc" | "desc";
  /** поле сортировки (по умолчанию - createdAt) */
  // sortBy?: "id" | "hidden" | "name" | "createdAt" | "updatedAt";
}

/** @deprecated */
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
  token?: string | null = null;
  setToken(token?: string | null) {
    this.token = token;
  }
  /**
   * Получение списка товаров с пагинацией
   */
  async getProducts(options: GetProductsOptions = {}) {
    const url = new URL(`${backendURL}/products`);
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
  async getProduct(id: string, options?: { shopId: string }) {
    const url = new URL(`${backendURL}/products/${id}`);
    if (options) {
      for (const key in options) {
        url.searchParams.set(
          key,
          options[key as keyof typeof options]?.toString?.() || ""
        );
      }
    }

    const response = await fetch(url);
    const data: Product = await response.json();
    return data;
  }

  /**
   * Получение ссылки на картинку товара
   */
  getProductImageURL(product: Product) {
    if(product.images && product.images.length > 0) {
      return new URL(product.images[0], backendURL).toString();
    }
    if (!product.barcodes?.length) {
      return "";
    }
    const ean = product.barcodes[0].barcode;
    return new URL(`${backendURL}/../v1/images/static/${ean}`).toString();
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
  
  async register(user: { username: string, password: string }) {
    const url = new URL(`${backendURL}/auth/register`);
    
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if(response.ok) {
      const data: { ok: boolean } = await response.json();
      return data;
    } else {
      return { ok: false };
    }
  }

  async login(user: { username: string, password: string }) {
    const url = new URL(`${backendURL}/auth/login`);
    
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data: { token?: string } = await response.json();
    return data;
  }
  
  async logout() {
    const url = new URL(`${backendURL}/auth/logout`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token,
      }
    });
    // const data: {} = await response.json();
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  }
  
  async whoami() {
    const url = new URL(`${backendURL}/auth/whoami`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.token,
      }
    });
    if(response.ok) {
      const data: User = await response.json();
      return data;
    } else {
      return null;
    }
  }
}

const api = new API();

export default api;
