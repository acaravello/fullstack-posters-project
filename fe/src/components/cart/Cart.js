
import React, { useState } from "react";
import Modal from "../UI/Modal";
import styles from "./Cart.module.css";
import CartItem from "./CartItem";
import { useSelector, useDispatch } from "react-redux";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../../store/store";
import { Scrollbars } from "react-custom-scrollbars";

const Cart = ({ onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const cartState = useSelector(state => state.cart);
    const totalItems = cartState.items.reduce((initial, item) => initial + item.quantity, 0);
    const dispatch = useDispatch();

    const cartItemAddHandler = (item) => {
        dispatch({type: ADD_TO_CART, item });
    }

    const cartItemRemoveHandler = (id) => {
        dispatch({type: REMOVE_FROM_CART, id})
    }

    return (
        <Modal>
            <div className={ styles['cart-container']}>
            {isSubmitting ? <div className={ styles['modal-content'] }>Submitting...</div> : 
            <>
            <div className={ styles['modal-content'] }>
                <div className={styles['cart-title']}>Total products: { totalItems }</div>
                {totalItems && totalItems > 0 ?
                <ul className={styles['cart-items']}>
                    <Scrollbars style={{ height: 300}}>
                {cartState && cartState.items.map(item =>  <CartItem key={ item._id } { ...item } 
                onAdd={() => cartItemAddHandler(item)} onRemove={() => cartItemRemoveHandler(item._id)} />)}
                </Scrollbars>
            </ul> :
            <p className={styles['no-item']}>No items in the cart.</p>
                }
                
            </div>
            <div className={styles['total-price']}>Total price: ${ cartState.totalAmount.toFixed(2) }</div>
            <div className={ styles['modal-actions'] }>
                { totalItems && totalItems > 0 ?
                <>
                <button className={ styles['back-button']} onClick={ onClose }>Cancel</button>
                <button className={ styles['order-button']} onClick={ onClose }>Order</button>
                </> :
                <button className={styles['close-button']} onClick={ onClose}>Close</button>
                }
                
            </div>
            </>
            }
            </div>
        </Modal>
    )
}

export default Cart;