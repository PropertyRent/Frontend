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
import NoticePage from "./pages/NoticePage.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx";
import ScreeningForm from "./pages/ScreeningForm.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import { Toaster } from "react-hot-toast";
import PropertyProvider from "./stores/propertyStore.jsx";

const Wrapper = ({ children }) => {
  return (
    <PropertyProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#374151",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
              border: "1px solid #e5e7eb",
              padding: "16px 20px",
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "300px",
              maxWidth: "400px",
            },
            success: {
              duration: 3500,
              style: {
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                border: "1px solid #10b981",
                boxShadow: "0 20px 25px -5px rgb(16 185 129 / 0.2), 0 10px 10px -5px rgb(16 185 129 / 0.1)",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#10b981",
              },
            },
            error: {
              duration: 4500,
              style: {
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#ffffff",
                border: "1px solid #ef4444",
                boxShadow: "0 20px 25px -5px rgb(239 68 68 / 0.2), 0 10px 10px -5px rgb(239 68 68 / 0.1)",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#ef4444",
              },
            },
            loading: {
              style: {
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#ffffff",
                border: "1px solid #3b82f6",
                boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.2), 0 10px 10px -5px rgb(59 130 246 / 0.1)",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#3b82f6",
              },
            },
          }}
          containerStyle={{
            top: 'auto',
            right: '20px',
            bottom: '20px',
            left: 'auto',
          }}
          toastClassName="toast-custom"
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
        path: "/notice",
        element: <NoticePage />,
      },
      {
        path: "/apply/:propertyId",
        element: <ApplicationPage />,
      },
      {
        path: "/screening",
        element: <ScreeningForm />,
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
