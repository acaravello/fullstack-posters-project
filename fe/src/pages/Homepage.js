
import React, { useMemo } from "react";
import { useState , useEffect, useCallback } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ProductsList from "../components/ProductsList";
import { useDispatch, useSelector } from "react-redux";
import { SET_PAGE } from "../store/store";

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

const Homepage = ({ itemsPerPage = 25}) => {

    const [loadedProducts, setLoadedProducts] = useState([]);
    const [totalLength, setTotalLength] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const offset = useSelector(state => state.products.page);

    const fetchProducts = useCallback(async() => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await fetch(`${SERVER_ADDRESS}/products?limit=25&offset=${offset}`);
            if(!response.ok) {
            throw new Error('Error in contacting the server! try again in a few minutes.')
            }
            const data = await response.json();
            console.log("response from fetching data");
            console.log(data)
            setIsLoading(false);
            setLoadedProducts(data.products);
            setTotalLength(data.totalLength);
            window.scrollTo(0, 0);
        } catch(error) {
            console.log("error in retrieving products");
            setError(error.message);
        }
        }, [offset]);
  
    const changePageHandler = (page) => {
        dispatch({ type: SET_PAGE, payload: page });
    }

    const pagesArray = useMemo(()=> {
        return Array.from(Array((Math.ceil(totalLength / itemsPerPage))).keys());
    }, [totalLength, itemsPerPage]);
  
    useEffect(() => {
      fetchProducts()
    }, [fetchProducts]);

    return (
        <>
            { isLoading && !error && <LoadingSpinner /> }
            { !isLoading && !error && loadedProducts &&
                <div>
                    {loadedProducts.length > 0 ?<ProductsList products={ loadedProducts }  offset={ offset } onChangePage={ changePageHandler } pages={ pagesArray }/> : 
                    <p>No products added yet.</p> }
                </div> }
            {error && <p>{ error }</p>}
        </>

    )
}

export default Homepage;