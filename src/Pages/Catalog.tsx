import { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import api, { ProductsResponse } from "../Api/api"
import { Context } from "../App";
import Card from "../components/Card";
import Pagination from "../components/Pagination";


export default function Catalog() {
   const { products, searchQuery, setPage, page, totalPages } = useContext(Context);

   return <>
      {/* {products?.page} из {totalPages}<br/> */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      
      <div className="cards-container">
         {products?.entries
            ? products?.entries.map(product => 
               <Card product={product} searchQuery={searchQuery} />
            )
            : 'Данные загружаются, подождите..'
         }
      </div>
      
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
   </>

}