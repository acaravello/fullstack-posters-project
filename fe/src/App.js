
import React from "react";
import { Route, Switch } from "react-router-dom"
import styles from "./App.module.css";
import Navbar from "./components/UI/Navbar";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import ProductModify from "./pages/ProductModify";

function App() {
  return (
    <div className={styles.app}>
      <Navbar></Navbar>
      <header className={ styles['app-header'] }>
        <Switch>
        <Route path="/" exact render={() => <Homepage />}/>
        <Route path="/new" exact render={ () => <ProductModify /> } />
        <Route path="/edit/:productId" exact render={ () => <ProductModify /> } />
        <Route path="/:productId" render={() => <ProductDetail /> } />
        </Switch>
      </header>
    </div>
  );
}

export default App;

