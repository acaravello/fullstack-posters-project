
import React, { useState } from "react";
import Modal from "../UI/Modal";
import styles from "./Cart.module.css";
import CartItem from "./CartItem";
import { useSelector, useDispatch } from "react-redux";
import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART } from "../../store/store";
import { Scrollbars } from "react-custom-scrollbars";

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

const Cart = ({ onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [orderIsPlaced, setOrderIsPlaced] = useState(null);
    const cartState = useSelector(state => state.cart);
    const totalItems = cartState.items.reduce((initial, item) => initial + item.quantity, 0);
    const dispatch = useDispatch();

    const cartItemAddHandler = (item) => {
        dispatch({type: ADD_TO_CART, item });
    }

    const cartItemRemoveHandler = (id) => {
        dispatch({type: REMOVE_FROM_CART, id})
    }

    const orderHandler = async () => {
        const orderObject = {
            buyerEmail: 'tony@mail.com',
            products: [...cartState.items],
            totalPrice: cartState.totalAmount.toFixed(2)
        }
        setIsSubmitting(true);
        setError(null)
        try {
            const response = await fetch(`${SERVER_ADDRESS}/orders`, {
                method: 'POST',
                body: JSON.stringify(orderObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok) {
                throw new Error('Error in contacting the server! try again in a few minutes.');
            }
            const data = await response.json();
            console.log("response from fetching data");
            console.log(data);
            setOrderIsPlaced(data.message)
            setIsSubmitting(false);
            dispatch({ type: EMPTY_CART });
            // onClose();
        } catch(error) {
            console.log("error in placing the order");
            setError(error.message);
            setIsSubmitting(false);
        }
    }

    return (
        <Modal>
            <div className={ styles['cart-container']}>

            {orderIsPlaced &&
            <>
             <div className={`${styles['modal-content']} ${styles['order-placed']}`}>{ orderIsPlaced }!
            </div>
            <div className={ styles['modal-actions'] }>
            <button className={styles['close-button']} onClick={ onClose}>Close</button>
            </div>
            </>
            
            }
            {!orderIsPlaced && isSubmitting && !error && <div className={ `${styles['modal-content']} ${styles['order-placed']}` }>Submitting...</div>}
            {!orderIsPlaced && !isSubmitting && !error &&
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
            </>
            }
            {!orderIsPlaced && !isSubmitting &&
            <div className={ styles['modal-actions'] }>
            { totalItems && totalItems > 0 ?
            <>
            <button className={ styles['back-button']} onClick={ onClose }>Cancel</button>
            { !error && <button className={ styles['order-button']} onClick={ orderHandler }>Order</button> }
            </> :
            <button className={styles['close-button']} onClick={ onClose}>Close</button>
            }
            </div>
            }
            </div>
        </Modal>
    )
}

export default Cart;