import React from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";
import { Product } from "../../Api/server.typings";
import "./index.scss"
import { path } from "../../settings";
import { EmojiHeartEyes, EmojiHeartEyesFill, ArrowThroughHeart, ArrowThroughHeartFill } from 'react-bootstrap-icons';


export default function Card({ product, searchQuery }: { product: Product, searchQuery: string }) {
   const idx = product.name.indexOf(searchQuery);
   const like = true;
   return (
      <Link to={path + 'product/' + product.id} className="card">
         <div className="card__header">
            <span className="card__like">
               {like ? <ArrowThroughHeartFill /> : <ArrowThroughHeart/>}
            </span>
         </div>
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
      </Link>
   )
}
