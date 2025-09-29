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
import EmailVerify from "./pages/EmailVerify.jsx";
import { Toaster } from "react-hot-toast";
import PropertyProvider from "./stores/propertyStore.jsx";

const Wrapper = ({ children }) => {
  return (
    <PropertyProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            },
            success: {
              style: {
                background: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
      </AuthProvider>
    </PropertyProvider>
  );
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
    element: (
      <Wrapper>
        <AdminDashboard />
      </Wrapper>
    ),
  },
  {
    path: "/admin-login",
    element: (
      <Wrapper>
        <OwnerPortalAuth />
      </Wrapper>
    ),
  },
  {
    path: "/verify-email/:token",
    element: (
      <Wrapper>
        <EmailVerify />
      </Wrapper>
    ),
  },
  {
    path: "/reset-password/:resetToken",
    element: (
      <Wrapper>
        <OwnerPortalAuth />
      </Wrapper>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
