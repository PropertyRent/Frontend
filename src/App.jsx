import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./stores/authStore";
import PropertyProvider from "./stores/propertyStore";
import ChatbotWidget from "./components/Chatbot/ChatbotWidget";
import SupportBoardIntegration from "./components/SupportBoardIntegration";

const App = () => {
  return (
    <PropertyProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
          {/* Chatbot Widget - Available on all pages */}
          <ChatbotWidget />
          {/* Support Board Chatbot Integration */}
          <SupportBoardIntegration />
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#374151",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
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
                boxShadow:
                  "0 20px 25px -5px rgb(16 185 129 / 0.2), 0 10px 10px -5px rgb(16 185 129 / 0.1)",
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
                boxShadow:
                  "0 20px 25px -5px rgb(239 68 68 / 0.2), 0 10px 10px -5px rgb(239 68 68 / 0.1)",
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
                boxShadow:
                  "0 20px 25px -5px rgb(59 130 246 / 0.2), 0 10px 10px -5px rgb(59 130 246 / 0.1)",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#3b82f6",
              },
            },
          }}
          containerStyle={{
            top: "auto",
            right: "20px",
            bottom: "20px",
            left: "auto",
          }}
          toastClassName="toast-custom"
        />
      </AuthProvider>
    </PropertyProvider>
  );
};

export default App;
