export interface Product {
  /** идентификатор */
  id: string; // GUID
  /** скрытый или нет */
  hidden: boolean;
  /** наименование */
  name: string;
  /** дата и время создания, например `2012-12-31T23:59:59.123Z` */
  createdAt: string;
  /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
  updatedAt: string;
  /** цены товаров (только актуальные) */
  prices?: Array<{
    /** идентификатор ценника */
    id: string;
    /** цена */
    price: number;
    /** идентификатор магазина */
    shopId: string;
    /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
    updatedAt: string;
  }>;
  /** баркоды (штрихкоды) товаров */
  barcodes?: Array<{
    /** идентификатор штрихкода */
    id: string;
    /** штрихкод */
    barcode: string;
    /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
    updatedAt: string;
  }>;
  /** магазины */
  shops?: Array<{
    /** идентификатор магазина */
    id: string;
    /** наименование магазина */
    name: string;
  }>;
}

export interface PaginatedResponse<T = any> {
  /** номер страницы */
  page: number;
  /** размер страницы (количество элементов в entries) */
  pageSize: number;
  /** элементы страницы */
  entries: Array<T>;
}

export interface ServerErrorResponse {
  status: "fail";
  message: string | Array<any>;
}

export interface Shop {
  /** идентификатор магазина */
  id: string; // GUID
  /** скрытый? */
  hidden: boolean;
  /** наименование магазина */
  name: string;
  /** страна */
  country: string | null;
  /** город */
  city: string | null;
  /** адрес */
  address: string | null;
  /** широта */
  lat: number | null;
  /** долгота */
  lon: number | null;
  /** дата и время создания, например `2012-12-31T23:59:59.123Z` */
  createdAt: string;
  /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
  updatedAt: string;
}

export interface ShopWithProducts extends Shop {
  products: Array<{
    /** идентификатор товара */
    id: string;
    /** наименование товара */
    name: string;
    /** цены товара (все в текущем магазине) */
    prices: Array<{
      /** идентификатор цены */
      id: string;
      /** цена */
      price: number;
      /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
      updatedAt: string;
    }>;
  }>;
}
