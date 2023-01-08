export interface Product {
  /** идентификатор */
  id: string; // GUID
  /** скрытый или нет */
  hidden: boolean;
  /** наименование */
  name: string;
  /** описание
   * @deprecated
   */
  descriptionI18N: string | null
  /** Цена за ед. измерения: киллограм, литры, шт. */
  priceUnit: 'KGM' | 'LTR' | 'PCS' | 'MTR' | null
  /** Цена для сравнения: киллограм, литры, шт. */
  comparisonPriceUnit: 'KGM' | 'LTR' | 'PCS' | 'MTR' | null
  /** идентификатор категории */
  categoryId: string | null
  /** дата и время создания, например `2012-12-31T23:59:59.123Z` */
  createdAt: string;
  /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
  updatedAt: string;

  /** локализованные имена(перевод) */
  names: Array<{
    id?: string
    refId?: string
    /** язык перевода */
    lang: 'en' | 'fi' | 'sv' | 'ru' | 'uk' | 'la' | 'eo' | 'da'
    /** значение перевода */
    value: string
    /** автоматический перевод */
    isAuto: boolean
    createdAt?: string
    updatedAt?: string
  }>
  /** цены товаров (только актуальные) */
  prices?: Array<{
    /** идентификатор ценника */
    id: string;
    /** цена */
    price: number;
    /** цена для сравнения*/
    comparisonPrice: number | null;
    /** идентификатор магазина */
    shopId: string;
    /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
    updatedAt: string;
    /** наименование магазина */
    shopName: string
  }>;
  /** баркоды (штрихкоды) товаров */
  barcodes?: Array<{
    /** идентификатор штрихкода */
    id: string;
    /** тип штрихкода, `ean` - европейский штрихкод */
    type: string
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
    /** скрытое или нет */
    hidden: boolean
    /** страна магазина */
    country: string
    /** город магазина */
    city: string
    /** адрес магазина */
    address: string
    /** географическая широта */
    lat: number
    /** географическая долгота */
    lon: number
    /** создано- когда, например `2012-12-31T23:59:59.123Z` */
    createdAt: string
    /** обновлено - когда, например `2012-12-31T23:59:59.123Z` */
    updatedAt: string
  }>;
  measurements: null | {
    id?: string
    productId?: string
    width: number
    height: number
    length: number
    netWeight: number
    /** количество единиц измерения */
    contentSize: number
    /** единица измерения упаковки */
    contentUnit: 'KGM' | 'LTR' | 'PCS' | 'MTR' | null
  }
  barcode: string
  images: Array<string>
}

export interface PaginatedResponse<T = any> {
  /** номер страницы */
  page: number;
  /** размер страницы (количество элементов в entries) */
  pageSize: number;
  /** количество элементов всего */
  count: number;
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

// TODO: api v2 types
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

export interface User {
  username: string;
}