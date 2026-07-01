import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi, API_BASE_URL } from "../../utils/auth";

function ForgotPassword() {
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", token: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authApi.post(`${API_BASE_URL}/forgot-password`, { email: form.email });
      setMessage({ type: "success", text: response.data.message || "Account verified. Please set a new password." });
      setStep("reset");
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "No account found with this email." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authApi.post(`${API_BASE_URL}/reset-password`, {
        email: form.email,
        token: form.token,
        password: form.password,
      });
      setMessage({ type: "success", text: response.data.message || "Password reset successful." });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to reset your password now." });
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
              <h2 className="fw-bold mb-2">Reset your password</h2>
              <p className="text-muted mb-4">
                {step === "email"
                  ? "Enter the email linked to your account and we’ll verify it before resetting your password."
                  : "Your account is verified. Choose a new password and complete the reset."}
              </p>

              {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                  {message.text}
                </div>
              )}

              {step === "email" ? (
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Registered Email</label>
                    <input type="email" name="email" className="form-control" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                    {loading ? "Checking account..." : "Verify email"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Reset Code</label>
                    <input type="text" name="token" className="form-control" placeholder="Paste the reset code" value={form.token} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Create a new password" value={form.password} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                    {loading ? "Updating password..." : "Reset password"}
                  </button>
                </form>
              )}

              <div className="text-center mt-3">
                <Link to="/login">Back to login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
