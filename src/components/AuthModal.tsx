import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { FirebaseError } from "firebase/app";

interface AuthModalProps {
  onClose: () => void;
}

function AuthModal({ onClose }: AuthModalProps) {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isLogin && password.length < 6) {
      setErrorMessage("❌ 비밀번호는 6자리 이상이어야 합니다.");
      return;
    }

    try {
      setSubmitting(true);
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      const error = err as FirebaseError;
      switch (error.code) {
        case "auth/invalid-credential":
          setErrorMessage("❌ 이메일 또는 비밀번호가 올바르지 않습니다.");
          break;
        case "auth/user-not-found":
          setErrorMessage("❌ 해당 이메일로 가입된 계정이 없습니다.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage("❌ 이미 가입된 이메일입니다. 로그인 해주세요.");
          setIsLogin(true);
          break;
        case "auth/weak-password":
          setErrorMessage("❌ 비밀번호는 6자리 이상이어야 합니다.");
          break;
        default:
          setErrorMessage("❌ " + (error.message || "인증 중 문제가 발생했습니다."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="logo">🛍 Shop</div>
        <h2>{isLogin ? "로그인" : "회원가입"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="비밀번호 (6자리 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isLogin ? undefined : 6}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />

          {errorMessage && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {errorMessage}
            </p>
          )}

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
          </button>
        </form>

        <button
          type="button"
          className="switch-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage(null);
          }}
        >
          {isLogin ? "👉 회원가입으로 전환" : "👉 로그인으로 전환"}
        </button>

        <div className="divider">또는</div>

        <button
          className="google-btn"
          onClick={async () => {
            setErrorMessage(null);
            await signInWithGoogle();
            onClose();
          }}
        >
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
