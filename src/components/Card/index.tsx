import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";
import { Product } from "../../Api/server.typings";
import "./index.scss"
import { EmojiHeartEyes, EmojiHeartEyesFill, ArrowThroughHeart, ArrowThroughHeartFill } from 'react-bootstrap-icons';
import { Context } from "../../App";
import { useTranslation } from "react-i18next";
import WarningMark from "../WarningMark";

function getLocaleFromList(list: Array<{ lang: string, value: string, isAuto: boolean }>, lang: string) {
   for (const element of list) {
      if (element.lang === lang) {
         return element;
      }
   }
   return null;
}

export default function Card({ product, searchQuery }: { product: Product, searchQuery: string }) {
   const { favorites } = useContext(Context);
   const idx = product.name.toLowerCase().indexOf(searchQuery.toLowerCase());
   const [like, setLike] = useState(favorites.includes(product.id));
   const { t, i18n } = useTranslation();

   const localizedName = getLocaleFromList(product.names, i18n.language)
      || getLocaleFromList(product.names, 'en')
      || { value: product.name, isAuto: false };

   return (
      <Link to={'/product/' + product.id} className="card">
         <div className="card__header">
            <span className="card__like" onClick={(event) => {
               event.preventDefault();
               api.setLike(product.id, !like);
               setLike(!like);
            }}>
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
         <div className="card__text">
            {/* {
               !searchQuery
               ? product.name
               : <>
                  {product.name.slice(0, idx)}
                  <span className="card__searchMatch">{product.name.slice(idx, idx + searchQuery.length)}</span>
                  {product.name.slice(idx + searchQuery.length)}
               </>
            } */}
            {localizedName.value}
            {localizedName.isAuto ? <WarningMark text={t('autoTranslationWarning')} /> : ''}
         </div>
      </Link>
   )
}
