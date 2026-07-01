import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import { FRONTEND_URL, getStoredAuth, verifySession } from "../utils/auth";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const { token } = getStoredAuth();

      if (!token) {
        const session = await verifySession();
        if (!session?.valid) {
          window.location.href = `${FRONTEND_URL}/login`;
          return;
        }
      }

      setLoading(false);
    };

    bootstrapSession();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h2>;
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;