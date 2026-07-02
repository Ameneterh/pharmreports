import { motion } from "framer-motion";
import { Input } from "../components/Input";
import { HashLink } from "react-router-hash-link";
import toast from "react-hot-toast";
import {
  CircleUserRound,
  Mail,
  Lock,
  Headset,
  MapPinHouse,
  FilePenLine,
  FilePlus,
  Handshake,
  Loader,
  Eye,
  EyeOff,
  CloudUpload,
} from "lucide-react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

import MainLayout from "../layout/MainLayout";
import { useAuthStore } from "../store/authStore";
import { PhoneField } from "../components/Input.jsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function RegisterUser() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setUserPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [addedAvatar, setAddedAvatar] = useState(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [avatarUploadProgress, setAvatarUploadProgress] = useState(null);
  const [avatarUploadError, setAvatarUploadError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const { addUser, error, isLoading } = useAuthStore();

  const handleRegisterUser = async (e) => {
    e.preventDefault();

    try {
      await addUser({
        fullname,
        username,
        phoneNumber,
        password,
        role,
      });
      toast.success("User Registered Successfully");
      navigate("/user-dashboard?tab=dash");
    } catch (error) {
      console.log(error);
      toast.error("Failed to register User.");
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl min-h-screen w-full mx-auto p-4 bg-opacity-80 text-black mt-20"
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full bg-white backdrop-filter backdrop-blur-xl rounded-lg shadow-xl overflow-hidden my-10"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-950 to bg-blue-500 text-transparent bg-clip-text">
              Register Your Account
            </h2>

            <form onSubmit={handleRegisterUser} className="flex flex-col gap-3">
              {/* business owner details */}
              <div className="flex items-center gap-2">
                <p className="text-orange-500 text-xl md:text-2xl font-bold">
                  Staff Details
                </p>
                <p className="h-[2px] bg-orange-500 w-full flex-1 hidden md:inline-block"></p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <Input
                  icon={CircleUserRound}
                  type="text"
                  // placeholder="Business Owner's Name"
                  label="Staff Full Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <Input
                  icon={CircleUserRound}
                  type="text"
                  // placeholder="Business Owner's Email"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-start lg:flex-row gap-4">
                <PhoneField
                  // onChange={(e) => setUserPhone(e.target.value)}
                  phoneNumber={phoneNumber}
                  setUserPhone={setUserPhone}
                  label="Business Owner's Phone"
                />
                <div className="flex flex-col gap-3 w-full">
                  <div className="relative flex items-center w-full">
                    <Input
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      label="Create Strong Password"
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
                </div>
                <div className="flex flex-col w-full relative mt-2">
                  <label
                    htmlFor="role"
                    className="text-sm mb-1 absolute -top-3 left-2 bg-white px-1"
                  >
                    Select User Role
                  </label>
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-3 pr-3 py-[6px] bg-white rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-green-800 placeholder-green-800 transition duration-200"
                  >
                    <option value="">Select User Role</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Admin Staff</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="pharmtech">Pharm Tech</option>
                  </select>
                </div>
              </div>

              {/* password strength meter */}
              <PasswordStrengthMeter password={password} />

              {/* agreement with terms and conditions */}
              <div className="p-3 w-full bg-sky-50 text-sm text-center mt-2 rounded-md">
                <p>
                  By clicking on <b>Register Account</b>, you indicate your
                  agreement with <b>ALL</b> our{" "}
                  <Link
                    to={"/t&c"}
                    className="block text-blue-600 hover:underline underline-offset-2 "
                  >
                    Terms and Conditions
                  </Link>
                </p>
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
              >
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Handshake size={18} />
                    Register Account
                  </span>
                )}
              </motion.button>
            </form>
          </div>

          {/* <div className="px-8 py-4 bg-gray-400 bg-opacity-50 flex justify-center">
            <p className="text-sm text-black">
              Already registered your business?{" "}
              <Link to="/add-handler" className="text-blue-800 hover:underline">
                Add Handler
              </Link>{" "}
              or{" "}
              <Link to="/user-login" className="text-blue-800 hover:underline">
                Login
              </Link>
            </p>
          </div> */}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
