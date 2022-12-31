import React, { useEffect, useState } from 'react';
import './App.css';
import Catalog from './Pages/Catalog';
import { Routes, Route } from 'react-router-dom';
import { path, shops } from './settings';
import "./index.css" 
import Header from './components/Header';
import api, { ProductsResponse } from './Api/api';
import Product from './Pages/Product';
import Registration from './Pages/Registration';
import Authorization from './Pages/Authorization';

export interface ShopPricesContext {
  products: ProductsResponse | undefined,
  setProducts: React.Dispatch<React.SetStateAction< ProductsResponse | undefined >>

  searchQuery: string,
  setSearchQuery: React.Dispatch<React.SetStateAction< string >>

  page: number,
  setPage: React.Dispatch<React.SetStateAction< number >>

  totalPages: number,
  setTotalPages: React.Dispatch<React.SetStateAction< number >>
}

export const Context = React.createContext<ShopPricesContext>({} as ShopPricesContext);

function App() {
  const [ products, setProducts ] = useState<ProductsResponse>();
  const [ page, setPage ] = useState(0);
  const [ totalPages, setTotalPages ] = useState(0);
  const [ searchQuery, setSearchQuery ] = useState('');

  async function loadProducts() {
    console.log(searchQuery);
    let data: ProductsResponse;
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
    for (const product of data.entries) {
      product.prices = product.prices?.sort((a, b) => a.price - b.price);
    }
    setProducts(data);
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
    }}>
      <Header setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
      <Routes>
        <Route path={path} element={<Catalog />} />
        <Route path={path + "product/:id"} element={<Product />} />
        {/* <Route path={path + "favorites"} element={<Main goods={fav} api={api} setFav={setFav} user={user} />} />
        
        <Route path={path + "profile"} element={<Profile user={user} />} /> */}
        <Route path={path + "register"} element={<Registration />} /> 
        <Route path={path + "auth"} element={<Authorization />} /> 
      </Routes>
    </Context.Provider>
  );
}

export default App;
