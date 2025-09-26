import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import OwnerPortalAuth from "./pages/OwnerLogin.jsx";
import AdminDashboard from "./pages/Dashboard.jsx";
import AuthProvider from "./stores/authStore.jsx";

const AuthWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AuthWrapper><AdminDashboard /></AuthWrapper>,
  },
  {
    path: "/owner-login",
    element: <AuthWrapper><OwnerPortalAuth /></AuthWrapper>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
