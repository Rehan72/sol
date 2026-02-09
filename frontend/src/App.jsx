import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Preloader from "./components/ui/Preloader";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import Master from "./router/Master";
import { AnimatePresence } from "framer-motion";
import EventAuditor from "./components/debug/EventAuditor";
import { ToastProvider } from "./context/ToastContext";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ToastProvider>
      <div className="bg-deep-navy min-h-screen text-white">
        <EventAuditor />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
          ) : (
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/*" element={<Master />} />
              </Routes>
            </Router>
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
};

export default App;
