
import { createStore, combineReducers } from "redux";
export const SET_PAGE = "SET_PAGE";

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

const rootReducers = combineReducers({
    products: productsReducer,
})

const store = createStore(rootReducers);
export default store;
