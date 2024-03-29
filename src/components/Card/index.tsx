import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";
import { Product } from "../../Api/server.typings";
import "./index.scss";
import {
  ArrowThroughHeart,
  ArrowThroughHeartFill,
} from "react-bootstrap-icons";
import { Context } from "../../App";
import { useTranslation } from "react-i18next";
import WarningMark from "../WarningMark";
import { getLocaleFromList } from "../../i18n/utils";

export default function Card({
  product,
  searchQuery,
}: {
  product: Product;
  searchQuery: string;
}) {
  const { favorites, setInFavorites } = useContext(Context);
  // const idx = product.name.toLowerCase().indexOf(searchQuery.toLowerCase());
  const [like, setLike] = useState(favorites.includes(product.id));
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLike(favorites.includes(product.id));
  }, [favorites, product]);

  const localizedName = getLocaleFromList(product.names, i18n.language) ||
    getLocaleFromList(product.names, "en") || {
      value: product.name,
      isAuto: false,
    };

  function onLike(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    event.preventDefault();
    setInFavorites(product.id, !like);
  }

  return (
    <Link to={"/product/" + product.id} className="card">
      <div className="card__header">
        <span
          className="card__like"
          onClick={onLike}
        >
          {like ? <ArrowThroughHeartFill /> : <ArrowThroughHeart />}
        </span>
      </div>
      <div
        className="card__img"
        style={{
          backgroundImage: `url(${api.getProductImageURL(product)})`,
        }}
      ></div>
      <div className="card__price">
        {product.prices?.map((price, i) => (
          <div className="card__price2" key={price.id}>
            {price.price.toFixed(2)} € {price.shopName.split(" ")[0]}
          </div>
        ))}
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
        {localizedName.isAuto ? (
          <WarningMark text={t("autoTranslationWarning")} />
        ) : (
          ""
        )}
      </div>
    </Link>
  );
}
