import React from "react";
import { useNavigate } from "react-router-dom";

function OpenAccount() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      // Login hai to Dashboard
      window.location.href =
        "https://zerodha-clone-dashboard-dszd.onrender.com/";
    } else {
      // Login nahi hai to Signup
      navigate("/signup");
    }
  };

  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">Open a Zerodha account</h1>

        <p>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
          F&O trades.
        </p>

        <button
          onClick={handleClick}
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{
            width: "20%",
            margin: "0 auto",
          }}
        >
          Sign up Now
        </button>
      </div>
    </div>
  );
}

export default OpenAccount;