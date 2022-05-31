import actionTypes from "../constants/action-types";

export const setProducts = (products) => {
    return {
        type: actionTypes.SET_PRODUCTS,
        payload: products
    }
}

export const updateProductIdText = (newProductIdText) => {
    return {
        type: actionTypes.UPDATE_PRODUCT_ID_TEXT,
        payload: newProductIdText
    }
}