import { motion } from "framer-motion";
import { Input } from "../components/Input";
import {
  Mail,
  Lock,
  Loader,
  MapPinHouse,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import MainLayout from "../layout/MainLayout";
import { useBusinessStore } from "../store/businessStore";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, login, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/user-dashboard?tab=dash");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center w-full p-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto w-full bg-white backdrop-filter backdrop-blur-xl rounded-lg shadow-xl overflow-hidden my-10 flex flex-col"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-950 to bg-blue-500 text-transparent bg-clip-text pt-8">
            Welcome Back!
          </h2>

          {/* if loginHandler is true, show the login form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                icon={Mail}
                type="email"
                // placeholder="Handler Email"
                label="User Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative flex items-center w-full">
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  // placeholder="Enter Strong Password"
                  label="User Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute right-2 inset-y-0 cursor-pointer flex items-center mt-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-green-500" />
                  ) : (
                    <Eye className="size-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <Link
                  to="/reset-password"
                  className="text-sm text-green-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <p className="text-red-800 font-semibold mt-2 p-2 text-center bg-red-100 rounded">
                  {error}
                </p>
              )}

              <motion.button
                className="py-3 px-8 bg-gradient-to-r from-slate-600 to-blue-800 rounded-lg hover:border-white hover:from-blue-800 hover:to-slate-600 border focus:outline-none transition duration-200 cursor-pointer flex items-center justify-center text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <Loader className="w-6 h-6 animate-spin mx-auto text-white font-bold" />
                    <p>Logging in ...</p>
                  </span>
                ) : (
                  <span className="flex items-center gap-3 text-white">
                    <LogIn className="w-5 h-5 mx-auto text-white font-bold" />
                    <p>Login</p>
                  </span>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
