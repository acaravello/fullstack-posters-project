
import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const portal = document.getElementById('overlays');

const Backdrop = () => {
    return(
        <div className={ styles.backdrop }></div>
    )
}

const ModalOverlay = ({ children }) => {
    return (
        <div className={ styles.modal }>
            <div className={ styles.content }> { children }</div>
        </div>
    )
}

const Modal = ({ children }) => {
    return(
        <>
        { ReactDOM.createPortal(<Backdrop />, portal) }
        { ReactDOM.createPortal(<ModalOverlay>{ children }</ModalOverlay>, portal) }
        </>
    )
}

export default Modal;