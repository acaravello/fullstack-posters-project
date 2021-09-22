
import React from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
const Navbar = () => {
    return(
        <nav className={ styles.navbar }>
            <NavLink to="/" exact activeClassName={ styles.active }>Products</NavLink>
            <NavLink to="/new" exact activeClassName={ styles.active }>New Product</NavLink>
        </nav>
    )
}

export default Navbar;