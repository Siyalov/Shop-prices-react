import React, { useContext, useEffect, useState } from "react";
import logo from "./img/Cittaslow_logo.webp";
import "./style.css";
import {
  BoxArrowDownLeft,
  BoxArrowInDownLeft,
  HeartFill,
  PersonPlusFill,
  InfoSquare,
  UpcScan,
} from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../../App";
import api from "../../Api/api";
import LanguagePicker from "../LanguagePicker";
import BarcodeScanner from "../BarcodeScanner";

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    setToken,
    user,
    favorites,
    setPage,
    barcodeScannerOpened,
    setBarcodeScannerOpened,
  } = useContext(Context);
  const location = useLocation();

  const searchChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setSearchQuery(e.target.value);
  };

  async function logOut() {
    await api.logout();
    setToken("");
  }

  function toggleScanner() {
    setBarcodeScannerOpened(!barcodeScannerOpened);
  }

  function onLogoClick() {
    if (location.pathname === '/') {
      setSearchQuery('');
      setPage(0);
    }
  }

  function closeBarcodeScanner() {
    setBarcodeScannerOpened(false);
  }

  useEffect(() => {
    closeBarcodeScanner();
  }, [searchQuery]);

  return (
    <div className="header">
      <div>
        <Link className="logo" to={"/"} onClick={onLogoClick}>
          <img src={logo} alt="Cittaslow" className="full-logo" />
        </Link>
      </div>
      <input type="search" value={searchQuery} onChange={searchChangeHandler} />
      <div className="buttons">
        <nav className="header-nav">
          {
            <Link to={""} onClick={toggleScanner}>
              <UpcScan />
            </Link>
          }
          {user ? (
            <Link to={"/favorites"}>
              <HeartFill />
              <span>{favorites.length}</span>
            </Link>
          ) : (
            ""
          )}
          {!user ? (
            <Link to={"/register"}>
              <PersonPlusFill />
            </Link>
          ) : (
            ""
          )}
          {!user ? (
            <Link to={"/auth"}>
              <BoxArrowInDownLeft />
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link to={""} onClick={logOut}>
              <BoxArrowDownLeft />
            </Link>
          ) : (
            ""
          )}
          <LanguagePicker />
          <Link to={"/about"}>
            <InfoSquare />
          </Link>
        </nav>
      </div>

      <div
        style={{ display: barcodeScannerOpened ? 'block' : 'none' }}
        className="barcode-popup-wrapper"
        onClick={closeBarcodeScanner}
      >
        <div className="barcode-popup" onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
          <BarcodeScanner />
        </div>
      </div>
    </div>
  );
}
