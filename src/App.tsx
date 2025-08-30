import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { useAuth } from "./hooks/useAuth";
import { useAuthListener } from "./hooks/useAuthListener";

import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AuthModal from "./components/AuthModal";

function App() {
  useAuthListener();
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart);
  const { signOutUser } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <Router>
      <nav>
        <div className="nav-left">
          <Link to="/products" className="logo">🛍 Shop</Link>
        </div>
        <div className="nav-right">
          <Link to="/products">상품 목록</Link>
          <Link to="/cart">🛒 장바구니 ({cart.items.length})</Link>
          {user.isLoggedIn ? (
            <>
              <span>{user.displayName ?? user.email} 님</span>
              <button onClick={signOutUser}>로그아웃</button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)}>로그인</button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </Router>
  );
}

export default App;
