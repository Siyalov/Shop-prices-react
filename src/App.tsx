import React, { useEffect, useState } from 'react';
import './App.css';
import Catalog from './Pages/Catalog';
import { Routes, Route } from 'react-router-dom';

import "./index.css" 
import Header from './components/Header';
import api, { ProductsResponse } from './Api/api';

const path = "/";

function App() {
  const [ products, setProducts ] = useState<ProductsResponse>();
  const [ page, setPage ] = useState(0);
  const [ searchQuery, setSearchQuery ] = useState('');

  async function loadProducts() {
    console.log(searchQuery);
    if (searchQuery) {
      const data = await api.getProducts({
         page: page,
         pageSize: 40,
         q: searchQuery,
      });
      setProducts(data);
    } else {
      const data = await api.getProducts({
        page: page,
        pageSize: 40,
      });
      setProducts(data);
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

  return (
    <>
      <Header setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
      <Routes>
        <Route path={path} element={<Catalog products={products} setPage={setPage} />} />
        {/* <Route path={path + "favorites"} element={<Main goods={fav} api={api} setFav={setFav} user={user} />} />
        <Route path={path + "product/:id"} element={<Product api={api} />} />
        <Route path={path + "profile"} element={<Profile user={user} />} /> */}
      </Routes>
    </>
  );
}

export default App;
