import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/auth";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const passwordHints = useMemo(() => {
    const value = form.password;
    const checks = [
      { label: "At least 8 characters", valid: value.length >= 8 },
      { label: "One uppercase letter", valid: /[A-Z]/.test(value) },
      { label: "One number", valid: /\d/.test(value) },
      { label: "One special character", valid: /[^A-Za-z0-9]/.test(value) },
    ];
    return checks;
  }, [form.password]);

  const isPasswordValid = passwordHints.every((item) => item.valid);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (!isPasswordValid) {
      setMessage({ type: "error", text: "Please use a stronger password." });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post(`${API_BASE_URL}/signup`, {
        fullname: form.fullname,
        email: form.email,
        password: form.password,
      });

      setMessage({ type: "success", text: "Account created successfully. Redirecting to login…" });
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage({ type: "error", text: "Account already exists. Please login." });
        return;
      }

      setMessage({ type: "error", text: error.response?.data?.message || "Signup failed. Please try again." });
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
              <h2 className="fw-bold mb-2">Open your account</h2>
              <p className="text-muted mb-4">Start investing with a secure Zerodha-style account.</p>

              {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="fullname" className="form-control" placeholder="Enter your full name" value={form.fullname} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input type={showPassword ? "text" : "password"} name="password" className="form-control" placeholder="Create a password" value={form.password} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ul className="small text-muted mt-2 mb-0">
                    {passwordHints.map((item) => (
                      <li key={item.label} className={item.valid ? "text-success" : ""}>{item.label}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type={showPassword ? "text" : "password"} name="confirmPassword" className="form-control" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
                </div>

                <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Continue"}
                </button>
              </form>

              <div className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;