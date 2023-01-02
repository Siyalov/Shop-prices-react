import React from "react";
import { Context } from "../App";
import Header from "../components/Header";

export default function Main() {
  const { favorites, addToCart } = useContext(Context);
  return <>
     <h1>
       <center>Любимые продукты</center>
     </h1>
     <div className="cards-container">
        {favorites?.map((product, i) => (
          <Card
            key={product._id}
            product={product}
            addToCart={() => addToCart(product, 1)}
          />
        ))}
      </div>
  </>
}