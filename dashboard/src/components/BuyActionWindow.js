import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";
import { API_BASE_URL } from "../utils/auth";

const BuyActionWindow = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleBuyClick = async () => {
    if (!uid || Number(stockQuantity) <= 0 || Number(stockPrice) <= 0) {
      setStatus({ type: "error", text: "Please enter a valid quantity and price." });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/newOrder`, {
        name: uid,
        qty: Number(stockQuantity),
        price: Number(stockPrice),
        mode: "BUY",
      });

      setStatus({ type: "success", text: "Order placed successfully." });
      setTimeout(() => generalContext.closeBuyWindow(), 700);
    } catch (err) {
      setStatus({ type: "error", text: "Order failed. Please try again." });
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      {status.text && (
        <div className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
          {status.text}
        </div>
      )}

      <div className="buttons">
        <span>Margin required ₹140.65</span>

        <div>
          <Link
            className="btn btn-blue"
            to="#"
            onClick={handleBuyClick}
          >
            Buy
          </Link>

          <Link
            className="btn btn-grey"
            to="#"
            onClick={handleCancelClick}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;