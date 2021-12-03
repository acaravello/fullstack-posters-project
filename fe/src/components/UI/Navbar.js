
import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { NavLink } from "react-router-dom";
import CartIcon from "../cart/CartIcon";
import Cart from "../cart/Cart";
import { useSelector, useDispatch } from "react-redux";
import { FILL_CART } from "../../store/store";

const Navbar = ({ isLoggedIn, logoutHandler }) => {

    const [showCart, setShowCart] = useState(false);
    const [buttonBumped, setButtonBumped] = useState(false);
    const cartState = useSelector(state => state.cart);
    const totalQuantity = cartState.items.reduce((starting, item) => starting + item.quantity, 0);
    const dispatch = useDispatch();

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('poster-cart'));
        if(items) {
            dispatch({type: FILL_CART, items: items});
        }
    }, [dispatch])

    useEffect(() => {
        let timeout;
        localStorage.setItem('poster-cart', JSON.stringify(cartState.items));
        if(cartState.items.length > 0) {
            setButtonBumped(true);
            timeout = setTimeout(() => {
                setButtonBumped(false)
            }, 300);
        }
        return () => {
            clearTimeout(timeout);
        }
    }, [cartState.items])

    const openCartHandler = () => {
        setShowCart(true);
    }

    const closeCartHandler = () => {
        setShowCart(false);
    }

    const cartClasses = `${styles['cart-container']} ${buttonBumped ? styles.bump : null}`

    return(
        <nav className={ styles.navbar }>
            <div></div>
            <div className={ styles['links-container']}>
                <NavLink to="/" exact activeClassName={ styles.active }>Products</NavLink>
                {isLoggedIn && <NavLink to="/new" exact activeClassName={ styles.active }>New Product</NavLink> }
                <NavLink to ="/orders" exact activeClassName={ styles.active }> Orders </NavLink>
                {!isLoggedIn && <NavLink to="/login" exact activeClassName={ styles.active }>Login</NavLink> }
                {isLoggedIn && <button className={ styles['nav-button']} onClick={ logoutHandler }>Logout</button>}
            </div>
            <div className={cartClasses} onClick={ openCartHandler }>
                <CartIcon />
                <span>Your Cart</span>
                <span className={ styles.badge }> { totalQuantity }</span>
            </div>
            {showCart && <Cart  onClose={ closeCartHandler }/> }
        </nav>
    )
}

export default Navbar;