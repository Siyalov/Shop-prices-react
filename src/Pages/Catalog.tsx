import { useEffect, useState } from "react";
import api, { ProductsResponse } from "../Api/api"
import Card from "../components/Card";

export default function Catalog() {
   const [products, setProducts] = useState<ProductsResponse>();
   const [page, setPage] = useState(0);

   async function loadProducts() {
      const data = await api.getProducts({
         page: page,
         pageSize: 40,
      });
      setProducts(data);
   }

   useEffect(() => {
      loadProducts();
   }, [page]);


   return <>
      {products?.page}<br/>
      <div>
         <button onClick={() => setPage(Math.max(page - 1, 0))}>назад</button>
         <button onClick={() => setPage(page + 1)}>вперед</button>
      </div>
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