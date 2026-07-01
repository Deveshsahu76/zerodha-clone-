import axios from "axios";

export const API_BASE_URL = "https://zerodha-clone-backend-po9t.onrender.com";
export const DASHBOARD_URL = "https://zerodha-clone-dashboard-dszd.onrender.com";
export const FRONTEND_URL = "https://zerodha-clone-frontend-7qlg.onrender.com";

export const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  try {
    const token = window.localStorage.getItem("token");
    const user = window.localStorage.getItem("user");

    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  } catch (error) {
    return { token: null, user: null };
  }
};

export const saveAuth = (token, user) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("token", token || "session");
  window.localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
};

export const verifySession = async () => {
  try {
    const response = await authApi.get("/verify");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const logoutSession = async () => {
  try {
    await authApi.post("/logout");
  } catch (error) {
    // Ignore logout errors and continue.
  }
  clearAuth();
};
