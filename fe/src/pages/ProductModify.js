
import React, { useState, useRef, useReducer, useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import styles from "./ProductModify.module.css";
import { SET_PAGE } from "../store/store";


const SET_TITLE = "SET_TITLE";
const SET_IMGLINK = "SET_IMGLINK";
const SET_AUTHOR = "SET_AUTHOR";
const SET_AUTHORLINK = "SET_LINK";
const FORM_VALIDITY = "FORM_VALIDITY";
const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;


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

    const titleRef = useRef();
    const imgLinkRef = useRef();
    const authorRef = useRef();
    const authorLinkRef = useRef();
    const tagSelectedRef = useRef();

    const [tags, setTags] = useState([]);
    const [addEnabled, setAddEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tagSelected, setTagSelected] = useState(null);

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

    const submitHandler = async (event) => {
        event.preventDefault();
        const product = {
            title: titleRef.current.value,
            imageLink: imgLinkRef.current.value,
            author: authorRef.current.value,
            authorLink: authorLinkRef.current.value,
            tags: [...tags]
        }

        try {
            setIsLoading(true);
            const response = await fetch(`${serverAddress}/products`, {
                method: 'POST',
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
            setError(error.message)
        }
        setIsLoading(false);
        console.log("object to send to the be");
        console.log(product)
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
                <button className={ styles['clear-tag']} onClick={ resetTagSelectedHandler }>clear</button>
                <button className={ styles['delete-tag']} onClick={ deleteTagSelectedHandler }>delete</button>
                <button className={ styles['edit-tag']} onClick={ editTagHandler }>edit</button>
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
            <button disabled={ !formIsValid || isLoading }>save</button>
            </form>
            { isLoading && <LoadingSpinner />}
            { !isLoading && error && <p>{ error }</p> }
        </div>
    )
}

export default ProductModify;