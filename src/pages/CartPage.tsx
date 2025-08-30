import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../store/cartSlice";

function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return <p style={{ padding: "20px" }}>장바구니가 비어 있습니다.</p>;
  }

  return (
    <div className="cart-page">
      <h2>🛒 장바구니</h2>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id}>
            <div className="cart-item-info">
              <img src={item.image} alt={item.title} className="cart-img" />
              <span>
                {item.title} - ${item.price} × {item.quantity}
              </span>
            </div>
            <div>
              <button onClick={() => dispatch(increaseQuantity(item.id))}>＋</button>
              <button onClick={() => dispatch(decreaseQuantity(item.id))}>－</button>
              <button onClick={() => dispatch(removeFromCart(item.id))}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>총합: ${totalPrice.toFixed(2)}</h3>
      <button onClick={() => dispatch(clearCart())}>계산하기</button>
    </div>
  );
}

export default CartPage;
