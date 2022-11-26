import React from "react";
import api from "../../Api/api";
import { Product } from "../../Api/server.typings";
import "./index.css"



export default function Card({ product }: { product: Product }) {


   return (
      <div className="card">
         <div className="card__header"></div>
         <div className="card__img" style={{
            backgroundImage: `url(${api.getProductImageURL(product)})`
         }} ></div>
         <div className="card__price">{product.prices?.[0].price.toFixed(2)} €</div>
         <div className="card__text">{product.name}</div>
      </div>
   )
}
