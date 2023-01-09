import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Context } from "../App";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

export default function Catalog() {
  const { products, searchQuery, setPage, page, totalPages } =
    useContext(Context);

  const { t } = useTranslation();

  return (
    <>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      <div className="cards-container">
        {products?.entries
          ? products?.entries.map((product) => (
              <Card
                key={product.id}
                product={product}
                searchQuery={searchQuery}
              />
            ))
          : t("loadingPleaseWait")}
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </>
  );
}
