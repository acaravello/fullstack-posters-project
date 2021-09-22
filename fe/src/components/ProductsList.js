
import React from "react";
import styles from "./ProductsList.module.css";
import { useHistory } from "react-router";

const ProductsList = ({ products, offset, onChangePage, pages }) => {
    const history = useHistory();
    const clickProductHandler = (productId) => {
        history.push(`/${productId}`)
    }
    return(
        <>
        <div className={ styles.products }>
            
            {products.map(product => {
                return <div key={product._id} className={ styles.product } >
                    <div className={styles.image} style={{background: `url(${product.imageLink})`, 
                     backgroundPosition: 'center center', backgroundSize: '420px', backgroundRepeat: 'no-repeat' }}
                     onClick={() => clickProductHandler(product._id)}></div>
                     <div className={styles['info-container']}>
                     <div className={styles.description }>{ product.title }</div>
                     <div className={ styles.author }><a href={product.authorLink} target="_blank" rel="noreferrer">{ product.author }</a></div>
                     </div>   
                    </div>
            })}
        </div>
        <div className={ styles.pagination}>
            {pages.map( page => <div key={ page } className={ [styles['page-button'], page===offset ? styles.active : null].join(' ') }
             onClick={ () => onChangePage(page)}> {page + 1}</div>)}
        </div>
        </>
    )
}

export default React.memo(ProductsList);
