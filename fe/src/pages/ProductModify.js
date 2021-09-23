
import React, { useState, useRef, useReducer, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch } from "react-redux";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import styles from "./ProductModify.module.css";
import { SET_PAGE } from "../store/store";

const SET_TITLE = "SET_TITLE";
const SET_IMGLINK = "SET_IMGLINK";
const SET_AUTHOR = "SET_AUTHOR";
const SET_AUTHORLINK = "SET_LINK";
const SET_FORM_FROM_EDIT = "SET_FORM_FROM_EDIT";
const FORM_VALIDITY = "FORM_VALIDITY";
const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

const formReducer = (state, action) => {
    switch(action.type) {
        case SET_TITLE: 
        return { ...state, titleValid: action.payload }
        case SET_IMGLINK:
            return { ...state, imgLinkValid: action.payload }
        case SET_AUTHOR:
            return { ...state, authorValid: action.payload }
        case SET_AUTHORLINK: 
            return { ...state, authorLinkValid: action.payload }
        case SET_FORM_FROM_EDIT: 
            return { ...state, formIsValid: true, titleValid: true,
                imgLinkValid: true, authorValid: true, authorLinkValid: true }
        case FORM_VALIDITY:
            let formTotalValidation = true;
            for (let field in state) {
                if(field !== 'formIsValid') {
                    formTotalValidation = formTotalValidation && state[field]
                }
            }
            return {...state, formIsValid: formTotalValidation}
        default: 
        return state;
    }
}

const ProductModify = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { productId } = useParams();

    const titleRef = useRef();
    const imgLinkRef = useRef();
    const authorRef = useRef();
    const authorLinkRef = useRef();
    const tagSelectedRef = useRef();

    const [tags, setTags] = useState([]);
    const [addEnabled, setAddEnabled] = useState(false);
    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [modifyIsLoading, setModifyIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tagSelected, setTagSelected] = useState(null);
    const [editingProduct, isEditingProduct] = useState(null);
    const [productToModify, setProductToModify] = useState(null);

    const [formState, dispatchForm] = useReducer(formReducer, {
        formIsValid: false,
        titleValid: false,
        imgLinkValid: false,
        authorValid: false,
        authorLinkValid: false,
    })

    const { formIsValid, titleValid, imgLinkValid, authorValid, authorLinkValid } = formState;

    useEffect(() => {
        const identifier = setTimeout(() => { dispatchForm({ type: FORM_VALIDITY }); }, 500);
        return () => { clearTimeout(identifier); }
      }, [titleValid, imgLinkValid, authorValid, authorLinkValid]);

      useEffect(() => {
        isEditingProduct(productId);
        if(productId) {
            fetchProductToEdit(productId);
        } else {
            titleRef.current.value = "";
            imgLinkRef.current.value = "";
            authorRef.current.value = "";
            authorLinkRef.current.value = "";
            tagSelectedRef.current.value = "";
            setTagSelected(null);
            setTags([]);
        }
      }, [productId]);

      useEffect(() => {
          if(productToModify) {
            const { title, imageLink, author, authorLink, tags } = productToModify;
            titleRef.current.value = title;
            imgLinkRef.current.value = imageLink;
            authorRef.current.value = author;
            authorLinkRef.current.value = authorLink;
            setTagSelected(null);
            setTags([...tags]);
          }
      }, [productToModify])

    const fetchProductToEdit = async (productId) => {
        try{
            setModifyIsLoading(true);
            const response = await fetch(`${SERVER_ADDRESS}/products/${productId}`)
            const data = await response.json();
            console.log("product to modify");
            console.log(data)
            setProductToModify(data);
            setModifyIsLoading(false);
            dispatchForm({ type: SET_FORM_FROM_EDIT })
        } catch (error) {
            console.log("error in fetching product to edit");
            setError(error.message);
        }
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        const product = {
            title: titleRef.current.value,
            imageLink: imgLinkRef.current.value,
            author: authorRef.current.value,
            authorLink: authorLinkRef.current.value,
            tags: [...tags]
        }
        let method = 'POST';
        let address = `${SERVER_ADDRESS}/products`;
        if(editingProduct) {
            method = 'PUT';
            address = `${SERVER_ADDRESS}/products/${productId}`
        }
        try {
            setSubmitIsLoading(true);
            const response = await fetch(address, {
                method: method,
                body: JSON.stringify(product),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok) {
                throw new Error('Error in contacting server! try again in a few minutes.');
            }
            console.log("Response from adding product");
            console.log(response)
            dispatch({type: SET_PAGE, payload: 0});
            history.replace("/");
        } catch(error) {
            console.log("error in submitting new product");
            console.log(error)
            setError(error.message)
        }
        setSubmitIsLoading(false);
    }

    const addTagHandler = () => {
        const tagToAdd = tagSelectedRef.current.value;
        setTags(oldState => ([...oldState, tagToAdd]));
        setAddEnabled(false);
        tagSelectedRef.current.value = "";
    }

    const checkInputValidity = (value) => {
        if(value.length > 2) return true;
        return false;
    }

    const tagInputChangeHandler = (event) => {
        const isValid = checkInputValidity(event.target.value);
        setAddEnabled(isValid);
    }

    const inputFormHandler = (event, actionType) => {
        const isValid = checkInputValidity(event.target.value);
        dispatchForm({ type: actionType, payload: isValid })
    }

    const tagSelectedHandler = (tag, index) => {
        setTagSelected({ tag, index});
        tagSelectedRef.current.value = tag;
    }

    const resetTagSelectedHandler = () => {
        setTagSelected(null);
        tagSelectedRef.current.value = "";
    }

    const deleteTagSelectedHandler = (event) => {
        event.preventDefault();
        const newTagsArray = tags.filter((singleTag, index) => index !== tagSelected.index);
        setTags(newTagsArray);
        setTagSelected(null);
        tagSelectedRef.current.value = "";
    }

    const editTagHandler = (event) => {
        event.preventDefault();
        const newTagsArray = tags.map((singleTag, index) => index === tagSelected.index ? tagSelectedRef.current.value : singleTag);
        setTags(newTagsArray);
        setTagSelected(null);
        tagSelectedRef.current.value = "";
    }

    return(
        <div className={ styles['product-modify']}>
            {modifyIsLoading && <div className={ styles['modify-loader']}><LoadingSpinner /></div>}
            {!modifyIsLoading && editingProduct && <h3>Editing</h3>}
            <form className={ styles.form } onSubmit={ submitHandler }>
            <Input type="text" id="title" ref={ titleRef } label="Title" changeHandler={ event => inputFormHandler(event,  SET_TITLE)}/>
            <Input type="text" id="imageLink" ref={ imgLinkRef } label="Image Link" changeHandler={ event => inputFormHandler(event, SET_IMGLINK) } />
            <Input type="text" id="author" ref={ authorRef } label="Author" changeHandler={ event => inputFormHandler(event, SET_AUTHOR) } />
            <Input type="text" id="authorLink" ref={ authorLinkRef } label="Author Link"  changeHandler={ event => inputFormHandler(event, SET_AUTHORLINK) }/>
            <div className={styles["tags-container"]}>
                <div className={styles['tag-label']}> Tags</div>
                <div className={styles['tag-input-container']}>
                <input type="text" ref={tagSelectedRef} onChange={ tagInputChangeHandler }/>
                {tagSelected ? 
                <>
                <div className={styles['multiple-buttons-container']}>
                <button className={ styles['clear-tag']} onClick={ resetTagSelectedHandler }>clear</button>
                <button className={ styles['delete-tag']} onClick={ deleteTagSelectedHandler }>delete</button>
                <button className={ styles['edit-tag']} onClick={ editTagHandler }>edit</button>
                </div>
                </>:
                <button onClick={ addTagHandler } className={ styles['add-tag']} disabled={!addEnabled}>add</button>
                }
                </div>
            </div>
            <div className={styles['tag-list']}>
                {tags.length > 0 ? 
                tags.map((tagSelected, index)  => <div className={styles['single-tag']} key={ index }
                 onClick={() => tagSelectedHandler(tagSelected, index) }>{ tagSelected }</div>) :
                <p>No tags added yet.</p>
                }
            </div>
            <button disabled={ !formIsValid || submitIsLoading }>save</button>
            </form>
            { submitIsLoading && <LoadingSpinner />}
            { !submitIsLoading && error && <p>{ error }</p> }
        </div>
    )
}

export default ProductModify;