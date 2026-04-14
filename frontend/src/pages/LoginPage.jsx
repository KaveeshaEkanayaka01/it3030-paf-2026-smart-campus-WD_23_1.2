import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGoogleLoginUrl } from "../api/authApi";
import useAuth from "../hooks/useAuth";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegisterMode) {
        await register(formData);
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Authentication failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return (
  <div className="login-page">
    <div className="login-card">
      <div className="login-header">
        <h1>{isRegisterMode ? "Create Account" : "Welcome Back"}</h1>
        <p>
          {isRegisterMode
            ? "Create your Smart Campus account"
            : "Login to continue to your account"}
        </p>
      </div>

      <div className="login-body">
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegisterMode && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Enter your department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn primary-btn">
            {isRegisterMode ? "Register" : "Login"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className="login-btn google-btn">
          Continue with Google
        </button>

        <p className="toggle-text">
          {isRegisterMode
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegisterMode((prev) => !prev)}
            className="toggle-btn"
          >
            {isRegisterMode ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  </div>
);
};

export default LoginPage;