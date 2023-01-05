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
  onlyLiked?: boolean
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

interface APIRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH';
  headers?: { [key: string]: string },
  body?: any,
}

export class API {
  tokenPrefix = 'Bearer ';
  token?: string | null = null;
  setToken(token?: string | null) {
    this.token = token;
  }

  _setURLSearchParams<T extends {}>(url: URL, options?: T) {
    if (options) {
      for (const key in options) {
        url.searchParams.set(
          key,
          options[key as keyof T]?.toString?.() || ""
        );
      }
    }
    return url;
  }

  async request<ResSuccess = unknown, ResFail = unknown>(url: string | URL, options?: APIRequestOptions) {
    const opts: RequestInit = {
      method: 'GET',
      headers: {}
    };
    if (options?.method) {
      opts.method = options.method;
    }
    if (options?.headers) {
      opts.headers = options.headers;
    }
    
    if (options?.body !== undefined && !(opts.headers as Record<string, string>)['Content-Type']) {
      // treat body as JSON
      opts.body = JSON.stringify(options.body);
      (opts.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    if (this.token && !(opts.headers as Record<string, string>)['Authorization']) {
      (opts.headers as Record<string, string>)['Authorization'] = this.tokenPrefix + this.token;
    }
    
    const response = await fetch(url, opts);
    let body: undefined | ResSuccess | ResFail;
    if (response.headers.get('content-type')?.includes('application/json')) {
      body = await response.json();
    }
    
    return {
      requestUrl: url,
      requestOptions: opts,
      response,
      status: response.status,
      statusText: response.statusText,
      ...({
        ok: response.ok,
        body: !body ? null : (response.ok ? body as ResSuccess : body as ResFail),
      } as { ok: true, body: ResSuccess | null } | { ok: false, body: ResFail | null }),
    };
  }

  /**
   * Получение списка товаров с пагинацией
   */
  async getProducts(options: GetProductsOptions = {}): Promise<ProductsResponse | null> {
    const url = new URL(`${backendURL}/products`);
    this._setURLSearchParams(url, options);

    const result = await this.request<ProductsResponse, ServerErrorResponse>(url);

    if (result.ok) {
      return result.body;
    } else {
      console.error(result.status, result.body);
      return null;
    }
  }

  /**
   * Получение существующего товара
   */
  async getProduct(id: string, options?: { shopId: string }): Promise<Product | null> {
    const url = new URL(`${backendURL}/products/${id}`);
    this._setURLSearchParams(url, options);

    const result = await this.request<Product, ServerErrorResponse>(url);

    if (result.ok) {
      return result.body;
    } else {
      console.error(result.status, result.body);
      return null;
    }
  }

  /**
   * Получение ссылки на картинку товара
   * @ deprecated since v2. Please use `Product.images` field. now returns RAW image (can be large)
   */
  getProductImageURL(product: Product): string {
    if(product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        // absolute path
        return img;
      } else if (img.startsWith('/api/')) {
        // "relative" to API root
        return new URL(img.slice(1), backendURL?.split('/api/')[0] + '/').toString();
      } else {
        return new URL(img, backendURL).toString();
      }
    }
    if (!product.barcodes?.length) {
      return "";
    }
    const ean = product.barcodes[0].barcode;
    return new URL(`${backendURL}/../v1/images/static/${ean}`).toString();
  }

  /**
   * Получение списка магазинов
   * @deprecated (currently not implemented in v2)
   */
  async getShops(options: GetShopsOptions) {
    // TODO
    const url = new URL(`${backendURL}/shops`);
    this._setURLSearchParams(url, options);

    const response = await fetch(url);
    if (!response.headers.get("content-type")?.includes("json")) {
      throw new Error("Server response does not contain JSON!");
    }

    const data: ShopsResponse = await response.json();
    return data;
  }

  /**
   * Получение существующего магазина с товарами
   * @deprecated (currently not implemented in v2)
   * 
   * > **ВНИМАНИЕ**: с сервера придет МНОГО данных с историей о ценах товаров и всеми товарами в магазине!
   */
  async getShop(id: string) {
    const url = new URL(`${backendURL}/shops/${id}`);

    const response = await fetch(url);
    const data: ShopWithProducts = await response.json();
    return data;
  }
  
  async register(user: { username: string, password: string }): Promise<{ ok: boolean }> {
    const url = new URL(`${backendURL}/auth/register`);
    
    const result = await this.request<{ ok: boolean }, ServerErrorResponse>(url, {
      method: 'POST',
      body: user,
    });

    if (result.ok) {
      return result.body || { ok: true };
    } else {
      console.error(result.status, result.body);
      return { ok: false };
    }
  }

  async login(user: { username: string, password: string }): Promise<{ token: string } | null> {
    const url = new URL(`${backendURL}/auth/login`);
    
    const result = await this.request<{ token: string }, ServerErrorResponse>(url, {
      method: 'POST',
      body: user,
    });

    if (result.ok) {
      return result.body;
    } else {
      console.error(result.status, result.body);
      return null;
    }
  }
  
  async logout(): Promise<boolean> {
    const url = new URL(`${backendURL}/auth/logout`);
    
    const result = await this.request<unknown, ServerErrorResponse>(url, {
      method: 'POST',
    });
    
    if (result.ok) {
      return true;
    } else {
      console.error(result.status, result.body);
      return false;
    }
  }
  
  async whoami(): Promise<User | null> {
    const url = new URL(`${backendURL}/auth/whoami`);
    
    const result = await this.request<User, ServerErrorResponse>(url);

    if (result.ok) {
      return result.body;
    } else {
      console.error(result.status, result.body);
      return null;
    }
  }

  async setLike(productId: string, likeState: boolean = true): Promise<boolean> {
    const url = new URL(`${backendURL}/products/${productId}/like`);

    const result = await this.request<unknown, ServerErrorResponse>(url, {
      method: likeState ? 'PUT' : 'DELETE'
    });

    if (result.ok) {
      return true;
    } else {
      console.error(result.status, result.body);
      return false;
    }
  }

  /**
   * используйте `getProducts` с оппцией `onlyLiked` для получения списка товаров (а не только их ID)
   */
  async getLikedProductsId(): Promise<string[] | null> {
    const url = new URL(`${backendURL}/users/self/likes`);

    const result = await this.request<string[], ServerErrorResponse>(url);

    if (result.ok) {
      return result.body;
    } else {
      console.error(result.status, result.body);
      return null;
    }
  }
}

const api = new API();

export default api;
