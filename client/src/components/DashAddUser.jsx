import { motion } from "framer-motion";
import { Input } from "./Input.jsx";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  CircleUserRound,
  Mail,
  Lock,
  FilePlus,
  FilePenLine,
  Loader,
  UserRoundPlus,
  Eye,
  EyeOff,
  Phone,
  CloudUpload,
} from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "./PasswordStrengthMeter.jsx";
import { useAuthStore } from "../store/authStore.js";
import MainLayout from "../layout/MainLayout.jsx";
import { PhoneField } from "./Input.jsx";

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

export default function DashAddUser() {
  const navigate = useNavigate();
  const { addUser, addNewUser, error, isLoading, user } = useAuthStore();

  const [fullname, setFullname] = useState("");
  const [email, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [addedAvatar, setAddedAvatar] = useState(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [avatarUploadProgress, setAvatarUploadProgress] = useState(null);
  const [avatarUploadError, setAvatarUploadError] = useState(null);

  const handleRegisterUser = async (e) => {
    e.preventDefault();

    try {
      await addNewUser({
        fullname,
        email,
        phoneNumber,
        role,
      });
      navigate("/user-dashboard?tab=users");
      toast.success("New user added successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto p-3 md:px-10 w-full bg-white mt-3">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full bg-white rounded-lg shadow-xl overflow-hidden p-2 md:p-6"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to bg-blue-500 text-transparent bg-clip-text">
          Add New User
        </h2>
        <div className="p-2">
          <form onSubmit={handleRegisterUser} className="flex flex-col gap-3">
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
                icon={Mail}
                type="email"
                // placeholder="Business Owner's Email"
                label="Staff Official Email"
                value={email}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-start lg:flex-row gap-4">
              <div className="relative flex items-center w-full">
                <Input
                  icon={Lock}
                  type="text"
                  label="Default user password"
                  value="Today12345"
                  disabled
                  // onChange={(e) => setPassword(e.target.value)}
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
              <div className="flex flex-col w-full relative mt-2">
                <label
                  htmlFor="role"
                  className="text-sm mb-1 absolute -top-3 left-2 bg-white px-1"
                >
                  Select User Role
                </label>
                <select
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-3 pr-3 py-[7px] bg-white rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-green-800 placeholder-green-800 transition duration-200 text-sm"
                >
                  <option value="">Select User Role</option>
                  <option value="staff">Admin Staff</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="pharmtech">Pharm Tech</option>
                </select>
              </div>
              <PhoneField
                phoneNumber={phoneNumber}
                setUserPhone={setPhoneNumber}
                label="User Phone Number"
              />
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
                <Loader className="animate-spin mx-auto" />
              ) : (
                <span className="flex items-center gap-2">
                  <UserRoundPlus className="size-5" />
                  Add New User
                </span>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
