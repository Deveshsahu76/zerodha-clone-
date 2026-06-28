import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://zerodha-clone-backend-po9t.onrender.com/login",
        user
      );

      // Save user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      // Redirect to Dashboard
      window.location.href =
        "https://zerodha-clone-dashboard-dszd.onrender.com/";

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          Login
        </button>

        <div className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/signup">Signup</a>
        </div>
      </form>
    </div>
  );
}

export default Login;