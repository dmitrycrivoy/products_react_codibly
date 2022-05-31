import actionTypes from "../constants/action-types";

const UPDATE_PRODUCT_ID_TEXT = actionTypes.UPDATE_PRODUCT_ID_TEXT;
const SET_PRODUCTS = actionTypes.SET_PRODUCTS;

const initialState = {
    productsData: {},
    inputProductIdText: '',
}

const productsReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case SET_PRODUCTS:
            return {...state, productsData: payload};
        case UPDATE_PRODUCT_ID_TEXT:
            return {...state, inputProductIdText: payload};
        default:
            return state;
    }

}

export default productsReducer;