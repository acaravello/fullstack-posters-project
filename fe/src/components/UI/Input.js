
import React from "react";
import styles from "./Input.module.css";

const Input = React.forwardRef(({ type, id, label, changeHandler=() => {} }, ref) => {
    return(
        <div className={styles.input}>
            <label htmlFor={ id }>{ label }</label>
            <input ref={ ref } type={ type } id={ id } onChange={ changeHandler }/>
        </div>
    )
});

export default Input;
