import { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import api, { ProductsResponse } from "../Api/api"
import { Context } from "../App";
import Card from "../components/Card";


export default function Catalog() {
   const { products, searchQuery, setPage } = useContext(Context);
   return <>   
      {products?.page} из {Math.floor((products?.count || 0) / (products?.pageSize || 0))}<br/>
      <ButtonGroup>
         <Button onClick={() => setPage(Math.max(products?.page as number - 1, 0))}>назад</Button>
         <Button onClick={() => setPage(products?.page as number + 1)}>вперед</Button>
      </ButtonGroup>
      <div className="cards-container">
         {products?.entries
            ? products?.entries.map(product => 
               <Card product={product} searchQuery={searchQuery} />
            )
            : 'Данные загружаются, подождите..'
         }
      </div>
   </>

}