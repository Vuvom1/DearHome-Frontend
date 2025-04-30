import { createSlice } from '@reduxjs/toolkit';
import { addToCart, updateQuantity, removeFromCart, clearCart } from '../actions/CartAction';

const cartReducer = createSlice({
    name: 'cart',
    initialState: {
        items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
        totalQuantity: 0,
        totalPrice: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart, (state, action) => {
                const existingItem = state.items.find(item => item.id === action.payload.id);
                if (existingItem) {
                    existingItem.quantity += action.payload.quantity;
                    existingItem.totalPrice += action.payload.price * action.payload.quantity;
                } else {
                    state.items.push({
                        ...action.payload,
                        totalPrice: action.payload.price * action.payload.quantity,
                    });
                }
                state.totalQuantity += action.payload.quantity;
                state.totalPrice += action.payload.price * action.payload.quantity;

                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(updateQuantity, (state, action) => {
                const item = state.items.find(item => item.id === action.payload.id );
                if (item) {
                    const quantityDifference = action.payload.quantity - item.quantity;
                   
                    item.quantity = action.payload.quantity;
                    item.totalPrice = item.price * action.payload.quantity;
                    state.totalQuantity += quantityDifference;
                    state.totalPrice += item.price * quantityDifference;

                    if (item.quantity <= 0) {
                        state.items.splice(itemIndex, 1);
                    }

                    localStorage.setItem('cart', JSON.stringify(state.items));
                }
            })
            .addCase(removeFromCart, (state, action) => {
                const itemIndex = state.items.findIndex(item => item.id === action.payload.id );
                if (itemIndex !== -1) {
                    const item = state.items[itemIndex];
                    state.totalQuantity -= item.quantity;
                    state.totalPrice -= item.totalPrice;
                    state.items.splice(itemIndex, 1);

                    localStorage.setItem('cart', JSON.stringify(state.items));
                }
            })
            .addCase(clearCart, (state) => {
                state.items = [];
                state.totalQuantity = 0;
                state.totalPrice = 0;

                localStorage.removeItem('cart');
            });  
    },

});

export default cartReducer.reducer;