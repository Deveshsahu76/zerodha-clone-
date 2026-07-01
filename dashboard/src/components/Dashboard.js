import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";
import { FRONTEND_URL, getStoredAuth, verifySession } from "../utils/auth";

const Dashboard = () => {
  const [ready, setReady] = useState(false);
  const { token } = getStoredAuth();

  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        const session = await verifySession();
        if (!session?.valid) {
          window.location.href = `${FRONTEND_URL}/login`;
          return;
        }
      }

      setReady(true);
    };

    checkSession();
  }, [token]);

  if (!ready) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Checking session...</div>;
  }

  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <WatchList />
      </GeneralContextProvider>
      <div className="content">
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;