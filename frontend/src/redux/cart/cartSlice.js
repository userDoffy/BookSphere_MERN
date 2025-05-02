import { createSlice } from "@reduxjs/toolkit";

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.length;
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  return { totalAmount, totalItems };
};

const storedItems = JSON.parse(localStorage.getItem("cart")) || [];
const { totalAmount, totalItems } = calculateTotals(storedItems);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: storedItems, //id title price averageRating cover_url dateAdded
    totalAmount,
    totalItems,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      if (state.items.some((item) => item.id === newItem.id)) {
        return;
      }
      state.items.push(newItem);

      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      const { totalAmount, totalItems } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalItems = totalItems;

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;

      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
