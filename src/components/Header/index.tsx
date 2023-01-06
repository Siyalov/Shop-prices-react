import React, { useContext } from "react";
import logo from "./img/Cittaslow_logo.png";
import "./style.css";
import { BoxArrowDownLeft, BoxArrowInDownLeft, HeartFill, PersonPlusFill, InfoSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Context } from "../../App";
import api from "../../Api/api";

export default function Header() {
  const { searchQuery, setSearchQuery, setToken, user, favorites } = useContext(Context);

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
  // 
  async function logOut() {
    await api.logout();
    setToken('');
  }

  return (
    <div className="header">
      <div>
        <Link className="logo" to={"/"}>
          <img src={logo} alt="Cittaslow" className="full-logo" />
        </Link>
      </div>
      <input type="search" value={searchQuery} onChange={handler} />
      <div className="buttons">
        <nav className="header-nav">
          {user ? <Link to={"/favorites"}>
            <HeartFill />
            <span>{favorites.length}</span>
          </Link> : '' }
          {!user ? <Link to={"/register"}>
            <PersonPlusFill />
          </Link> : '' }
          {!user ? <Link to={"/auth"}>
            <BoxArrowInDownLeft />
          </Link> : '' }
          {user ? <Link to={""} onClick={logOut}>
            <BoxArrowDownLeft />
          </Link> : '' }
          <Link to={"/about"}>
            <InfoSquare />
          </Link>
        </nav>
      </div>
    </div>
  );
}
