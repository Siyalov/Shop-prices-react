import { useEffect, useState } from "react";
import api, { ProductsResponse } from "../Api/api"
import Card from "../components/Card";

export default function Catalog({
   products,
   setPage,
}: {
   products: ProductsResponse | undefined,
   setPage: (n: number) => void,
}) {
   return <>   
      {products?.page}<br/>
      <div>
         <button onClick={() => setPage(Math.max(products?.page as number - 1, 0))}>назад</button>
         <button onClick={() => setPage(products?.page as number + 1)}>вперед</button>
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