import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./productSlice";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  loaded: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  loaded: false,
};

export const fetchCart = createAsyncThunk<CartItem[], string>(
  "cart/fetchCart",
  async (uid) => {
    const docRef = doc(db, "carts", uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data().items as CartItem[];
    } else {
      return [];
    }
  }
);

export const saveCart = createAsyncThunk<
  void,
  { uid: string; items: CartItem[] }
>("cart/saveCart", async ({ uid, items }) => {
  const docRef = doc(db, "carts", uid);
  await setDoc(docRef, { items });
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    resetCart: (state) => {
      state.items = [];
      state.loading = false;
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.loaded = false;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.loading = false;
      state.loaded = true;
      state.items = [];
    });
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
