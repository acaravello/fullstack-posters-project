
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Modal from "../components/UI/Modal";
import styles from "./ProductDetail.module.css";
import { ADD_TO_CART, SET_PAGE } from "../store/store";

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

const ProductDetail = ({ isLoggedIn }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(null);

    const { productId}  = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const tokenFetched = localStorage.getItem('token');

    const getProductDetail = useCallback( async() => {
        setIsLoading(true);
        setError(false);
        try {
            const response = await fetch(`${SERVER_ADDRESS}/products/${productId}`);
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

    const onEditHandler = () => {
        history.push(`/edit/${productId}`);
    }

    const onDeleteHandler = () => {
        setOpenModal(true)
    }

    const closeModalHandler = () => {
        setOpenModal(false);
    }

    const confirmDeleteHandler = async() => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${SERVER_ADDRESS}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + tokenFetched
                }
            });
            if(!response.ok) {
                console.log("error in retrieving product by id");
                throw new Error('Error in contacting server! try again in a few minutes.');
            }
            console.log("response from deleting product");
            console.log(response)
            dispatch({type: SET_PAGE, payload: 0});
            history.replace("/");
        } catch(error) {
            console.log("error in deleting product");
            setError(error.message);
            setOpenModal(false)
        }
    }

    const addToCartHandler = () => {
        const productObject =  {
            _id: productDetail._id,
            title: productDetail.title,
            imageLink: productDetail.imageLink,
            price: productDetail.price,
            quantity: 1
        }
        dispatch({type: ADD_TO_CART, item: productObject});
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
            <div className={styles.price}> ${ productDetail.price.toFixed(2) }</div>
            <div className={ styles['tag-container']}>{ productDetail.tags.map( (tag, index) => <div key={index} className={styles.tag}> {tag} </div>)}</div>
            <div className={ styles.author}>
                <a href={ productDetail.authorLink } target="_blank" rel="noreferrer">{ productDetail.author }</a>
            </div>
            {isLoggedIn && 
            <>
            <button className={ styles['edit-button']} onClick={ onEditHandler }>edit</button>
            <button className={ styles['delete-button']} onClick={ onDeleteHandler }>delete</button>
            </>
            }
            {!isLoggedIn &&
            <div className={styles['to-cart']} onClick={() => addToCartHandler()}><button>Add to cart</button></div>
            }
            
            <button className={ styles['back-button'] } onClick={ onBackHandler }>back</button>
        </div>
        }
        { error && <div>
            <p className={styles['error-message']}>{ error }</p>
            <button className={ styles['back-button'] } onClick={ onBackHandler }>back</button>
            </div> 
        }

        {openModal && <Modal>
            {isSubmitting ? 
             <div className={ styles['modal-content'] }>Submitting...</div> : 
            <>
            <div className={ styles['modal-content'] }>
                <span>Are you sure you want to delete this product?</span>
            </div>
            <div className={ styles['modal-actions'] }>
                <button className={ styles['back-button']} onClick={ closeModalHandler }>Cancel</button>
                <button className={ styles['delete-button']} onClick={ confirmDeleteHandler }>Confirm</button>
            </div>
            </>
            }
            </Modal>}
        </>
        
    )
}

export default ProductDetail;
