import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api, { ProductsResponse } from "../Api/api";
import { Context } from "../App";
import Card from "../components/Card";
import { supportedLanguages } from "../i18n/all";
import { shops } from "../settings";

export default function Favorites() {
  const { favorites } = useContext(Context);

  const { t } = useTranslation();

  const [likeProduct, setLikeProduct] = useState<ProductsResponse>();
  async function loadProducts() {
    const likeProduct = await api.getProducts({
      pageSize: 1000,
      onlyLiked: true,
      shopId: shops,
      langs: supportedLanguages.join(','),
    });
    console.log(likeProduct);
    if (likeProduct) {
      setLikeProduct(likeProduct);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <h1 className="mt-10px text-center">{t("favoriteProducts")}</h1>
      <div className="cards-container">
        {favorites?.length
          ? likeProduct?.entries.map((product, i) => (
              <Card key={product.id} product={product} searchQuery="" />
            ))
          : t("favoriteProductsIsEmpty")}
      </div>
    </>
  );
}
