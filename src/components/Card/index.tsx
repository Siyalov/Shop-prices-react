import React from "react";
import api from "../../Api/api";
import { Product } from "../../Api/server.typings";
import "./index.css"



export default function Card({ product, searchQuery }: { product: Product, searchQuery: string }) {
   const idx = product.name.indexOf(searchQuery);
   return (
      <div className="card">
         <div className="card__header"></div>
         <div className="card__img" style={{
            backgroundImage: `url(${api.getProductImageURL(product)})`
         }} ></div>
         <div className="card__price">
            {
               product.prices?.map((price, i) => 
                  <div className="card__price2">
                     {price.price.toFixed(2)} € {price.shopName.split(' ')[0]}
                  </div>
               )
            }
         </div>
         <div className="card__text">{
            !searchQuery
            ? product.name
            : <>
               {product.name.slice(0, idx)}
               <span className="card__searchMatch">{product.name.slice(idx, idx + searchQuery.length)}</span>
               {product.name.slice(idx + searchQuery.length)}
            </>
         }</div>
      </div>
   )
}
