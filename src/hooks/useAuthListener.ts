import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { login, logout } from "../store/userSlice";
import { resetCart, fetchCart, saveCart } from "../store/cartSlice";

export const useAuthListener = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loaded } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          login({
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? "",
          })
        );
        dispatch(fetchCart(user.uid));
      } else {
        dispatch(logout());
        dispatch(resetCart());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && loaded) {
      dispatch(saveCart({ uid: user.uid, items }));
    }
  }, [items, loaded, dispatch]);
};
