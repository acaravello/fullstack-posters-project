
import { createStore, combineReducers } from "redux";
export const SET_PAGE = "SET_PAGE";
export const ADD_TO_CART = "ADD_ITEM_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_ITEM_FROM_CART";
export const EMPTY_CART = "EMPTY CART";

const cartInitialState = {
    items: [],
    totalAmount: 0,
    addItem: (item) => {},
    removeItem: (id) => {},
    emptyCart: () => {}
}

const productsReducer = (state = { page: 0}, action) => {
    switch(action.type) {
        case SET_PAGE:
            return {
                ...state,
                page: action.payload
            };
        default:
            return state;
    }
}
const cartReducer = (state = cartInitialState, action) => {
    switch(action.type) {
        case ADD_TO_CART:
            let updatedProducts;
            const exisitingProductInd = state.items.findIndex(item => item._id === action.item._id);
            const existingProduct = state.items[exisitingProductInd];
            if(existingProduct) {
                let updatedExistingProduct = {
                    ...existingProduct,
                    quantity: existingProduct.quantity + 1
                }
                updatedProducts = state.items.map(product => product._id === action.item._id ? updatedExistingProduct : product)
            } else {
                updatedProducts = state.items.concat(action.item);
            }
            const updatedTotalAmount = (state.totalAmount + action.item.price);
            return { ...state, items: updatedProducts, totalAmount: updatedTotalAmount }
        case REMOVE_FROM_CART:
            const itemIndex = state.items.findIndex(item => item._id === action.id);
            const itemToRemove = state.items[itemIndex];
            if(itemToRemove) {
                let updatedTotalAmount = state.totalAmount - itemToRemove.price;
                let updatedItems;
                if(itemToRemove.quantity > 1) {
                    updatedItems = state.items.map(item => item._id === action.id ? { ...item, quantity: item.quantity - 1} : item);
                } else {
                    updatedItems = state.items.filter(item => item._id !== action.id);
                }
                return { ...state, items: updatedItems, totalAmount: updatedTotalAmount }
            }
            return state;
        case EMPTY_CART:
            return {
                ...state, items: [], totalAmount: 0
            }
        default: 
            return state;
    }
}

const rootReducers = combineReducers({
    products: productsReducer,
    cart: cartReducer
})

const store = createStore(rootReducers);
export default store;
