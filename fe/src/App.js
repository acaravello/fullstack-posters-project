
import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom"
import styles from "./App.module.css";
import Navbar from "./components/UI/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import ProductModify from "./pages/ProductModify";
import { useHistory } from "react-router";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const expiringDate =localStorage.getItem('postersExpiringDate');
    const expiringMilliseconds = new Date(expiringDate).getTime();
    const now = new Date().getTime();
    if(now < expiringMilliseconds) { 
      loginHandler();
      return;
    }
    loggingOutHandler();
  })

  const loggingOutHandler = () => {
    history.replace('/');
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('postersExpiringDate');
  }

  const loginHandler = () => {
    setIsLoggedIn(true);
  }

  return (
    <div className={styles.app}>
      <Navbar isLoggedIn={ isLoggedIn } logoutHandler={ loggingOutHandler }></Navbar>
      <header className={styles['app-header']}>
        <Switch>
        <Route path="/" exact render={() => <Homepage />}/>
        {isLoggedIn && <Route path="/new" exact render={ () => <ProductModify /> } /> }
        {isLoggedIn && <Route path="/edit/:productId" exact render={ () => <ProductModify /> } /> }
        <Route path="/orders" render={ () => <Orders />} />
        {!isLoggedIn && <Route path="/login" exact render={() => <Login setLoggedIn={ loginHandler  }/> } /> }
        <Route path="/:productId" render={() => <ProductDetail isLoggedIn={ isLoggedIn } /> } />
        </Switch>
      </header>
    </div>
  );
}

export default App;

