import React from "react";
import logo from "./img/Cittaslow_logo.png";
import "./style.css";
import { BoxArrowDownLeft, BoxArrowInDownLeft, PersonPlusFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function Header({
  setSearchQuery,
  searchQuery,
}: {
  setSearchQuery: (text: string) => void;
  searchQuery: string;
}) {
  const handler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value);
  };
  // const logout = e => {
  //    e.preventDefault();
  //    localStorage.removeItem("shop-user");
  //    localStorage.removeItem("user");
  //    setToken("");
  //    setUser({});
  //    navigate(path);
  // }

  return (
    <div className="header">
      <div>
        <a className="logo" href={"/"}>
          <img src={logo} alt="Cittaslow" className="full-logo" />
        </a>
      </div>
      <input type="search" value={searchQuery} onChange={handler} />
      <div className="buttons">
        <nav className="header-nav">
          <Link to={"/register"}>
            <PersonPlusFill />
          </Link>
          <Link to={"/auth"}>
            <BoxArrowInDownLeft />
          </Link>
          <Link to={"/logout"}>
            <BoxArrowDownLeft />
          </Link>
        </nav>
      </div>
    </div>
  );
}
