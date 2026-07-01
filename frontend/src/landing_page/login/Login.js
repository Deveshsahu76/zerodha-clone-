import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL, DASHBOARD_URL, saveAuth, verifySession } from "../../utils/auth";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const checkSession = async () => {
      const session = await verifySession();
      if (session?.valid) {
        window.location.href = DASHBOARD_URL;
      }
    };

    checkSession();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, user);
      saveAuth(res.data.token, res.data.user);
      setMessage({ type: "success", text: "Login successful. Taking you to your dashboard…" });
      setTimeout(() => {
        window.location.href = DASHBOARD_URL;
      }, 600);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-lg-5">
              <h2 className="fw-bold mb-2">Welcome back</h2>
              <p className="text-muted mb-4">Log in to continue to your trading dashboard.</p>

              {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" placeholder="Enter your email" value={user.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input type={showPassword ? "text" : "password"} name="password" className="form-control" placeholder="Enter your password" value={user.password} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label" htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#">Forgot password?</a>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                New to Zerodha? <Link to="/signup">Create account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;