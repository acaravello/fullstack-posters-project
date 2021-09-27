

import React from "react";
import styles from './CartItem.module.css';

const CartItem = ({ title, imageLink, price = 15.50, quantity,  onAdd, onRemove }) => {
  const priceDisplayed = `$${price.toFixed(2)}`;

  return (
    <li className={ styles['cart-item'] }>
        <div className={styles['poster-container']}><img src={ imageLink } alt={ title }/> </div>
      <div>
        <h2>{title}</h2>
        <div className={ styles.summary }>
          <span className={ styles.price }>{ priceDisplayed }</span>
          <span className={ styles.quantity }>x { quantity }</span>
        </div>
      </div>
      <div className={ styles.actions }>
        <button onClick={ onRemove }>−</button>
        <button onClick={ onAdd }>+</button>
      </div>
    </li>
  );
};

export default CartItem;