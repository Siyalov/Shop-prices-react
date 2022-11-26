import { useEffect, useState } from "react";
import api, { ProductsResponse } from "../Api/api"
import Card from "../components/Card";

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
      <div className="cards-container">
         {products?.entries
            ? products?.entries.map(product => 
               <Card product={product} />
            )
            : 'Данные загружаются, подождите..'
         }
      </div>
   </>

}