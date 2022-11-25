import { useEffect, useState } from "react";
import api, { ProductResponse } from "../Api/api"

export default function Catalog() {
   const [products, setProducts] = useState<ProductResponse>();

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