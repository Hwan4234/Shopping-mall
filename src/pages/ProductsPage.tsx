import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { Link } from "react-router-dom";

function ProductsPage() {
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>상품 불러오는 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((product) => product.category === selectedCategory);

  return (
    <div className="products-page">
      <h2>Products</h2>

      <div className="category-filter">
        <button
          className={selectedCategory === "all" ? "active" : ""}
          onClick={() => setSelectedCategory("all")}
        >
          모두
        </button>
        <button
          className={selectedCategory === "electronics" ? "active" : ""}
          onClick={() => setSelectedCategory("electronics")}
        >
          전자기기
        </button>
        <button
          className={selectedCategory === "jewelery" ? "active" : ""}
          onClick={() => setSelectedCategory("jewelery")}
        >
          쥬얼리
        </button>
        <button
          className={selectedCategory === "men's clothing" ? "active" : ""}
          onClick={() => setSelectedCategory("men's clothing")}
        >
          남성의류
        </button>
        <button
          className={selectedCategory === "women's clothing" ? "active" : ""}
          onClick={() => setSelectedCategory("women's clothing")}
        >
          여성의류
        </button>
      </div>

      <div className="products-grid">
        {filteredItems.map((product) => (
          <div key={product.id} className="card">
            <Link to={`/products/${product.id}`}>
              <img src={product.image} alt={product.title} className="product-img" />
              <h3>{product.title}</h3>
            </Link>
            <p style={{ fontWeight: "bold" }}>${product.price}</p>
            <button onClick={() => dispatch(addToCart(product))}>
              장바구니 담기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
