import { backendURL } from "../settings";

export interface ProductResponse {
   /** номер страницы */
   page: number,
   /** размер страницы (количество товаров в entries) */
   pageSize: number,
   /** товары */
   entries: Array<{
      /** идентификатор */
      id: string, // GUID
      /** скрытый или нет */
      hidden: boolean,
      /** наименование */
      name: string,
      /** дата и время создания, например `2012-12-31T23:59:59.123Z` */
      createdAt: string,
      /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
      updatedAt: string,
      /** цены товаров (только актуальные) */
      prices?: Array<{
         /** идентификатор ценника */
         id: string,
         /** цена */
         price: number,
         /** идентификатор магазина */
         shopId: string,
         /** дата и время изменения, например `2012-12-31T23:59:59.123Z` */
         updatedAt: string,
      }>,
      /** баркоды (штрихкоды) товаров */
      barcodes?: Array<{
         /** идентификатор штрихкода */
         id: string,
         /** штрихкод */
         barcode: string,
         /** дата и время обновления, например `2012-12-31T23:59:59.123Z` */
         updatedAt: string,
      }>,
      /** магазины */
      shops?: Array<{
         /** идентификатор магазина */
         id: string,
         /** наименование магазина */
         name: string,
      }>
   }>
}

interface GetProductsOptions {
   /** отображать баркоды в ответе */
   barcodes?: boolean,
   /** отображать цены в ответе */
   prices?: boolean,
   /** отображать магазины в ответе */
   shops?: boolean,
   /** строка поиска */
   q?: string,
   /** номер страницы для пагинации */
   page?: number,
   /** количество продуктов на странице */
   pageSize?: number,
   /** порядок сортировки (desc - от Я до А, asc - от А до Я, по умолчанию - desc) */
   order?: "DESC" | "ASC" | "asc" | "desc",
   /** поле сортировки (по умолчанию - createdAt) */
   sortBy?: "id" | "hidden" | "name" | "createdAt" | "updatedAt",
}

export class API {
   /**
    * Получение списка товаров с пагинацией
    */
   async getProducts(options: GetProductsOptions = {}) {
      const url = new URL(`${backendURL}/products`);
      url.searchParams.set('barcodes', '');
      url.searchParams.set('shops', '');
      url.searchParams.set('prices', '');
      if (options) {
         for (const key in options) {
            url.searchParams.set(key, (options[key as keyof typeof options])?.toString?.() || '');
         }
      }
      
      const response = await fetch(url);
      const data: ProductResponse = await response.json();
      return data;
   }
}

const api = new API();

export default api;