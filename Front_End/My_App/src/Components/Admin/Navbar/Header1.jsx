import React from 'react';
import { Link, json } from 'react-router-dom';
import logo from "../../../assets/logofood.png";

function Header1() {
    return (
        <nav className="navbar"
        style={{background: "#333",color: "White", height:"60px"}}>
            <div className="navbar-left">
            <img style={{width:"100px", position: "absolute", top:"-20px",zIndex:"9999",left:"10px"}} src={logo} alt="Logo" className="logo" />
            </div>
            <div className="navbar-right">
                <span className="welcome-message"></span>
            </div>
        </nav>
    );
}
 
export default Header1;