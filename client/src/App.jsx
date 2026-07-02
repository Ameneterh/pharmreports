import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Spinner from "./components/Spinner";
import FloatingShapes from "./components/FloatingShapes";
import HeaderComponent from "./components/HeaderComponent";
import LoginPage from "./pages/LoginPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import { useLocation } from "react-router-dom";
import RegisterUser from "./pages/RegisterUser.jsx";

// protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, justLoggedOut, setJustLoggedOut } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !justLoggedOut) {
      toast.error("You need to log in to access this page");
    }
  }, [isAuthenticated, justLoggedOut, setJustLoggedOut]);

  if (!isAuthenticated) {
    return <Navigate to="/user-login" replace />;
  }

  if (user?.status !== "active") {
    return <Navigate to="/verify-handler" replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.status === "active") {
    return <Navigate to="/user-dashboard?tab=dash" replace />;
  }

  return children;
};

function App() {
  const contentRef = useRef();
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-tr bg-slate-300 flex relative overflow-hidden">
      <FloatingShapes
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShapes
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShapes
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="10%"
        delay={2}
      />

      {/* routes */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && user?.status === "active" ? (
              <Navigate to="/user-dashboard?tab=dash" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route path="/support" element={<ContactUs />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* protected routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* private routes for only authenticated users */}

        <Route
          path="/reset-password"
          element={
            <RedirectAuthenticatedUser>
              <PasswordResetPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectAuthenticatedUser>
              <RegisterUser />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/user-login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
