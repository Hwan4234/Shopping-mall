import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function AuthForm() {
  const { signUpWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      signInWithEmail(email, password);
    } else {
      signUpWithEmail(email, password);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>{isLogin ? "로그인" : "회원가입"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit">{isLogin ? "로그인" : "회원가입"}</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: "none", color: "#2563eb" }}
        >
          {isLogin ? "회원가입" : "로그인"}으로 전환
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
