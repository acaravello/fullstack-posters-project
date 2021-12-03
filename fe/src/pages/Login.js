
import React, { createRef, useState, useEffect } from "react";
import Input from "../components/UI/Input";
import styles from "./Login.module.css";
import { useHistory } from "react-router";

const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

const Login = ({setLoggedIn}) => {

    const usernameRef = createRef();
    const passwordRef = createRef();
    const history = useHistory();
    const [usernameIsFilled, setUsernameIsFilled] = useState(false);
    const [passwordIsFilled, setPasswordIsFilled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      let timeout;
      if(error) {
        timeout = setTimeout(() => {
          setError(null);
        },2500);
      };
      return () => {
        clearTimeout(timeout);
      }
    }, [error])

    const loginHandler = async () => {
      const loginObject = {
          username: usernameRef.current.value,
          password: passwordRef.current.value
      }
      let method = 'POST';
      let address = `${SERVER_ADDRESS}/login`;
      try {
          setIsLoading(true);
          const response = await fetch(address, {
              method: method,
              body: JSON.stringify(loginObject),
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          if(!response.ok) {
              throw new Error('Error: Wrong credentials');
          }
          const responseParsed = await response.json();
          localStorage.setItem('token', responseParsed.token);
          const remainingMilliseconds = 60 * 60 * 1000;
          const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem('postersExpiringDate', expiryDate);
          console.log("Response from login:");
          console.log(responseParsed);
          setLoggedIn();
          history.push('/');
      } catch(error) {
          console.log("error in logging in");
          setError(error.message)
      }
      setIsLoading(false);
  }

    const usernameChangeHandler = () => {
      if(usernameRef && usernameRef.current && usernameRef.current.value !== "") {
        setUsernameIsFilled(true);
      } else {
        setUsernameIsFilled(false);
      }
    }

    const passwordChangeHandler = () => {
      if(passwordRef && passwordRef.current && passwordRef.current.value !== "") {
        setPasswordIsFilled(true);
      } else {
        setPasswordIsFilled(false);
      }
    }

 return(
     <div className={styles['login-form-container']}>
        <Input type="text" id="login-username" ref={ usernameRef } label="username:" changeHandler={ usernameChangeHandler }/>
        <Input type="password" id="login-password" ref={ passwordRef } label="password:" changeHandler={ passwordChangeHandler } />
        <div className={styles['actions-container']}>
        <button className={styles['login-button']} onClick={ loginHandler } disabled={ !usernameIsFilled ||  !passwordIsFilled || isLoading}>login</button>
        </div>
        <p className={styles['error-message']}>{ error }</p>
     </div>
 )
}

export default Login;