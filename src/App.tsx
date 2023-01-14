import { Routes, Route, useNavigate } from "react-router-dom";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { shops } from "./settings";
import { User } from "./Api/server.typings";
import Header from "./components/Header";
import api, { ProductsResponse } from "./Api/api";
import { useDebounce } from "./utils";
import { supportedLanguages } from "./i18n/all";
import Loading from "./components/Loading";

// code below is same as ```import Catalog from "./Pages/Catalog";```
// but uses lazy loading 
const Catalog = lazy(() => import('./Pages/Catalog'));
const Product = lazy(() => import('./Pages/Product'));
const Registration = lazy(() => import('./Pages/Registration'));
const Authorization = lazy(() => import('./Pages/Authorization'));
const Favorites = lazy(() => import('./Pages/Favorites'));
const About = lazy(() => import('./Pages/About'));

export interface ShopPricesContext {
  products: ProductsResponse | undefined;
  setProducts: React.Dispatch<
    React.SetStateAction<ProductsResponse | undefined>
  >;

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;

  favorites: Array<string>;
  setInFavorites: (id: string, likeState: boolean) => void
}

export const Context = React.createContext<ShopPricesContext>(
  {} as ShopPricesContext
);

function App() {
  const [products, setProducts] = useState<ProductsResponse>();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [token, setToken] = useState(
    localStorage.getItem("shop-prices-token") || ""
  );
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Array<string>>([]);
  const navigate = useNavigate();

  async function setInFavorites(id: string, likeState: boolean) {
    await api.setLike(id, likeState);
    const likes = await api.getLikedProductsId();
    setFavorites(likes || []);
  }

  async function loadProducts() {
    let data: ProductsResponse | null;
    setProducts(undefined);
    if (searchQuery) {
      data = await api.getProducts({
        page: page,
        pageSize: 40,
        q: searchQuery,
        shopId: shops,
        langs: supportedLanguages.join(","),
      });
    } else {
      data = await api.getProducts({
        page: page,
        pageSize: 40,
        shopId: shops,
        langs: supportedLanguages.join(","),
      });
    }
    // sort price
    if (data) {
      for (const product of data.entries) {
        product.prices = product.prices?.sort((a, b) => a.price - b.price);
      }
      setProducts(data);
    } else {
      // TODO: handle errors
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    navigate('/');
    if (page === 0) {
      loadProducts();
    }
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (products) {
      setTotalPages(
        Math.floor((products?.count || 0) / (products?.pageSize || 1))
      );
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem("shop-prices-token", token);
    api.setToken(token);
    api.whoami().then(setUser);
  }, [token]);

  useEffect(() => {
    if (user) {
      api.getLikedProductsId().then((likes) => setFavorites(likes || []));
    } else {
      setFavorites([]);
    }
  }, [user]);

  return (
    <Context.Provider
      value={{
        products,
        setProducts,
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        totalPages,
        setTotalPages,
        setToken,
        user,
        favorites,
        setInFavorites,
      }}
    >
      <Header />
      <div className="pages-container">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path={"/"} element={<Catalog />} />
            <Route path={"product/:id"} element={<Product />} />
            <Route path={"favorites"} element={<Favorites />} />
            <Route path={"register"} element={<Registration />} />
            <Route path={"auth"} element={<Authorization />} />
            <Route path={"about"} element={<About />} />
          </Routes>
        </Suspense>
      </div>
      
    </Context.Provider>
  );
}

export default App;
