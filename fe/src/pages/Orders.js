
import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import styles from "./Orders.module.css";

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

const Orders = () => {

    const [ordersHistory, setOrdersHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0);
    }, []);

    const fetchProducts = async() => {
        try {
            setIsLoading(true);
            const response = await fetch(`${SERVER_ADDRESS}/orders`);
            const data = await response.json();
            setOrdersHistory(data);
            setIsLoading(false);
            setError(false);
        } catch(err) {
            console.log("Error in fetching orders history");
            setIsLoading(false);
            setError(err.message);
        }
    }

    return (
        <>
         { isLoading && !error && <LoadingSpinner /> }
         { error && <div><p> { error }</p></div> }
        {! isLoading && !error && 
        <div className={styles['orders-container']}>
             { ordersHistory.length > 0 && ordersHistory.map(order => <div key={ order._id } className={ styles['single-order']}>
                <div className={ styles['order-by']}>Order by: { order.buyerEmail }</div>
                <div className={ styles['status']}>status: { order.status} </div>
                <div className={ styles['order-products-container']}>
                { order.products && order.products.map(product => 
                <div className={ styles['single-product']} key={ product._id}>{ product.title} - ${product.price} x { product.quantity } </div>
                )}
                </div>
                <div className={ styles['total-price']}>Total price: <span className={ styles.gold }>${order.totalPrice}</span></div>
            </div>
            )}
        </div>
        }
        </>
    )
}

export default Orders;