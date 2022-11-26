import { useEffect, useState } from "react";
import api, { ProductsResponse } from "../Api/api"

export default function Catalog() {
   const [products, setProducts] = useState<ProductsResponse>();

   async function loadProducts() {
      const data = await api.getProducts();
      setProducts(data);
   }

   useEffect(() => {
      loadProducts();
   }, []);


   return <>
      {products?.page}<br/>
      {products?.entries
         ? products?.entries.map(product => 
            <> {product.name}<br/> </>
         )
         : 'Данные загружаются, подождите..'
      }
   </>

}