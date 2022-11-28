import React from "react";
import logo from './img/Cittaslow_logo.png';
import "./style.css";

export default function Header({
   setSearchQuery,
   searchQuery,
}: {
   setSearchQuery: (text: string) => void,
   searchQuery: string,
}) {
   const handler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      setSearchQuery(e.target.value);
   }
   // const logout = e => {
   //    e.preventDefault();
   //    localStorage.removeItem("shop-user");
   //    localStorage.removeItem("user");
   //    setToken("");
   //    setUser({});
   //    navigate(path);
   // }
   
   return <div className="header">
      <div>
         <a className="logo" href={"/"}>
            <img src={logo} alt="Cittaslow" className="full-logo" />         
         </a>
      </div>
      <input type="search" value={searchQuery} onChange={handler} />
      <div className="buttons">
         123
      </div>

   </div>
   
}
