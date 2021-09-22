
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import styles from "./ProductDetail.module.css";

const serverAddres = process.env.REACT_APP_SERVER_ADDRESS;

const ProductDetail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const { productId}  = useParams();
    const history = useHistory();

    const getProductDetail = useCallback( async() => {
        setIsLoading(true);
        setError(false);
        try {
            const response = await fetch(`${serverAddres}/products/${productId}`);
            if(!response.ok) {
                throw new Error('Error in contacting server! try again in a few minutes.');
            }
            const product = await response.json();
            if(!product) {
                setError('Product not found')
                return;
            }
            setProductDetail(product);
            setError(false);
            setIsLoading(false);
            window.scrollTo(0, 0);
        } catch(error) {
            console.log("Error in fetching product detail");
            setError(error.message);
        }
    }, [productId]);

    useEffect(() => {
        getProductDetail()
    }, [getProductDetail]);

    const onBackHandler = () => {
        history.goBack();
    }

    return(
        <>
        { isLoading && !error && <LoadingSpinner /> }
        {!isLoading && productDetail && 
        <div className={styles['product-detail']}>
            <div className={ styles['image-container']}>
                <a href={productDetail.imageLink} target="_blank" rel="noreferrer"><img src={ productDetail.imageLink} alt={ productDetail.title} /></a>
            </div>
            <div className={ styles.description }>{ productDetail.title }</div>
            <div className={ styles['tag-container']}>{ productDetail.tags.map( (tag, index) => <div key={index} className={styles.tag}> {tag} </div>)}</div>
            <div className={ styles.author}>
                <a href={ productDetail.authorLink } target="_blank" rel="noreferrer">{ productDetail.author }</a>
                </div>
                <button className={ styles['back-button'] } onClick={ onBackHandler }>Back</button>
        </div>
        }
        { error && <div>
            <p>{ error }</p>
            <button className={ styles['back-button'] } onClick={ onBackHandler }>Back</button>
            </div> 
        }
        </>
        
    )
}

export default ProductDetail;
