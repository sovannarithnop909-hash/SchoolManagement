import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { api } from "../api/client";
import { roleHome } from "../utils/roles";

export function LoginPage() {
  const [form, setForm] = useState({
    email: "admin@school.com",
    password: "School@123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { t } = useLocale();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      login(response.data.user, response.data.token);
      navigate(roleHome[response.data.user.role] || "/dashboard");
    } catch (error) {
      alert(t(error.response?.data?.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to={roleHome[user.role] || "/dashboard"} replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{t("Welcome back")}</h1>
          <p>{t("Sign in to your school portal")}</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            <span>{t("Email")}</span>
            <div className="input-wrap">
              <Mail size={16} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </label>

          <label>
            <span>{t("Password")}</span>
            <div className="input-wrap">
              <Lock size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className="auth-actions">
            <label className="checkbox-row">
              <input type="checkbox" /> {t("Remember me")}
            </label>
            <a href="/">{t("Forgot password?")}</a>
          </div>

          <button className="primary-btn full" type="submit" disabled={loading}>
            {loading ? t("Signing in...") : t("Login")}
          </button>
        </form>
      </div>
    </div>
  );
}
