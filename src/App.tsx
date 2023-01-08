import React, { useEffect, useState } from 'react';
import './App.css';
import Catalog from './Pages/Catalog';
import { Routes, Route } from 'react-router-dom';
import { shops } from './settings';
import "./index.css" 
import Header from './components/Header';
import api, { ProductsResponse } from './Api/api';
import Product from './Pages/Product';
import Registration from './Pages/Registration';
import Authorization from './Pages/Authorization';
import { User } from './Api/server.typings';
import Favorites from './Pages/Favorites';
import About from './Pages/About';
import { useTranslation } from 'react-i18next';

export interface ShopPricesContext {
  products: ProductsResponse | undefined,
  setProducts: React.Dispatch<React.SetStateAction< ProductsResponse | undefined >>

  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction< string >>

  page: number,
  setPage: React.Dispatch<React.SetStateAction< number >>

  totalPages: number,
  setTotalPages: React.Dispatch<React.SetStateAction< number >>
  setToken: React.Dispatch<React.SetStateAction<string>>
  user: User | null

  favorites: Array<string>
}

export const Context = React.createContext<ShopPricesContext>({} as ShopPricesContext);

function App() {
  const [ products, setProducts ] = useState<ProductsResponse>();
  const [ page, setPage ] = useState(0);
  const [ totalPages, setTotalPages ] = useState(0);
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ token, setToken ] = useState(localStorage.getItem('shop-prices-token') || '');
  const [ user, setUser ] = useState<User | null>(null);
  const [ favorites, setFavorites ] = useState<Array<string>>([]);
  const { t, i18n } = useTranslation();
  // console.log(i18n);
  // api.setToken(token);

  async function loadProducts() {
    console.log(searchQuery);
    let data: ProductsResponse | null;
    setProducts(undefined);
    if (searchQuery) {
      data = await api.getProducts({
        page: page,
        pageSize: 40,
        q: searchQuery,
        shopId: shops
      });
    } else {
      data = await api.getProducts({
        page: page,
        pageSize: 40,
        shopId: shops
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
  }, [page]);

  useEffect(() => {
    if (page === 0) {
      loadProducts();
    }
    setPage(0);
  }, [searchQuery]);

  useEffect(() => {
    if (products) {
      setTotalPages(Math.floor((products?.count || 0) / (products?.pageSize || 1)));
    }
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shop-prices-token', token);
    api.setToken(token);
    api.whoami().then(setUser);
  }, [token]);

  useEffect(() => {
    api.getLikedProductsId().then((likes) => setFavorites(likes || []));
  }, [user]);

  return (
    <Context.Provider value={{
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
    }}>
      <Header />
      <Routes>
        <Route path={"/"} element={<Catalog />} />
        <Route path={"product/:id"} element={<Product />} />
        <Route path={"favorites"} element={<Favorites /> } />
        {/* <Route path={path + "profile"} element={<Profile user={user} />} />  */}
        <Route path={"register"} element={<Registration />} /> 
        <Route path={"auth"} element={<Authorization />} /> 
        <Route path={"about"} element={<About />} /> 
      </Routes>
    </Context.Provider>
  );
}

export default App;
