// /Users/minhvuvo/Documents/GitHub/DearHome-Frontend/src/store/actions/CartAction.jsx

import { createAction } from "@reduxjs/toolkit";

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

export const addToCart = createAction(ADD_TO_CART);
export const removeFromCart = createAction(REMOVE_FROM_CART);
export const clearCart = createAction(CLEAR_CART);
export const updateQuantity = createAction(UPDATE_QUANTITY);