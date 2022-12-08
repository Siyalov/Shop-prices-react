import React, { useEffect, useState } from 'react';
import './App.css';
import Catalog from './Pages/Catalog';
import { Routes, Route } from 'react-router-dom';

import "./index.css" 
import Header from './components/Header';
import api, { ProductsResponse } from './Api/api';

const path = "/";
// show only Kristiinankaupunki shops
const shops = '15563156-f682-4ca1-9cf0-e7c4e1430a0e,511799ba-1af8-4a58-88da-5ce686ea3937';

function App() {
  const [ products, setProducts ] = useState<ProductsResponse>();
  const [ page, setPage ] = useState(0);
  const [ searchQuery, setSearchQuery ] = useState('');

  async function loadProducts() {
    console.log(searchQuery);
    let data: ProductsResponse;
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

  return (
    <>
      <Header setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
      <Routes>
        <Route path={path} element={<Catalog products={products} setPage={setPage} searchQuery={searchQuery} />} />
        {/* <Route path={path + "favorites"} element={<Main goods={fav} api={api} setFav={setFav} user={user} />} />
        <Route path={path + "product/:id"} element={<Product api={api} />} />
        <Route path={path + "profile"} element={<Profile user={user} />} /> */}
      </Routes>
    </>
  );
}

export default App;
