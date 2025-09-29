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
import ContactPage from "./pages/Contact.jsx";
import AboutPage from "./pages/About.jsx";
import ManagementPage from "./pages/ManagementService.jsx";
import Properties from "./pages/Properties.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import PreScreening from "./pages/PreScreening.jsx";

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
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/services/maintenance",
        element: <ManagementPage />,
      },
      {
        path: "/properties",
        element: <Properties />,
      },
      {
        path: "/properties/:id",
        element: <PropertyDetail />,
      },
      {
        path: "/pre-screening",
        element: <PreScreening />,
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
    path: "/admin-login",
    element: <AuthWrapper><OwnerPortalAuth /></AuthWrapper>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
