import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { addToCart } from "../store/cartSlice";

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = useSelector((state: RootState) =>
    state.products.items.find((p) => p.id === Number(id))
  );
  const dispatch = useDispatch<AppDispatch>();

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} />
      <div className="product-info">
        <h2>{product.title}</h2>
        <p><strong>가격:</strong> ${product.price}</p>
        <p><strong>카테고리:</strong> {product.category}</p>
        <p>{product.description}</p>
        <button onClick={() => dispatch(addToCart(product))}>장바구니 담기</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
