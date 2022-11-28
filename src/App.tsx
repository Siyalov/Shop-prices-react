import React from 'react';
import './App.css';
import Catalog from './Pages/Catalog';
import { Routes, Route } from 'react-router-dom';

import "./index.css" 
import Header from './components/Header';

function App() {
  return (
    <>
    <Header />
    <Catalog />
    </>
  );
}

export default App;
