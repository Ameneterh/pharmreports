import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaBullhorn,
  FaBox,
  FaCog,
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaTable,
  FaTruck,
  FaUsers,
  FaUserCircle,
} from "react-icons/fa";
import {
  MdClose,
  MdOutlineContactSupport,
  MdContacts,
  MdMenu,
  MdCloseFullscreen,
  MdLogin,
} from "react-icons/md";
import { FcAbout } from "react-icons/fc";
import { TbListDetails } from "react-icons/tb";
import { RxHamburgerMenu, RxAvatar } from "react-icons/rx";
import { MdLogout } from "react-icons/md";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/dept_emblem.png";
import { IoMdCloseCircle } from "react-icons/io";
import { TbMessage, TbStarFilled } from "react-icons/tb";
import { Input } from "./Input";
import { useReportsStore } from "../store/reportsStore";

export default function HeaderComponent({ business }) {
  const menuItems = [
    // {
    //   name: "Login",
    //   path: "/",
    //   icon: <MdLogin />,
    //   isParent: true,
    // },
    {
      name: "Support",
      path: "/support",
      icon: <MdOutlineContactSupport />,
      isParent: false,
    },
    // {
    //   name: "About App",
    //   path: "/about",
    //   icon: <FcAbout />,
    //   isParent: false,
    // },
  ];

  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { error, isLoading, logout, user } = useAuthStore();
  const { sendReport, getRatings } = useReportsStore();

  const confirmLogout = () => {
    try {
      logout();
      navigate("/");
      // setShowModal(false);
    } catch (error) {
      console.log("Error logging out!");
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();

    try {
      await addRating({ rating, comment, rater: user._id });
    } catch (error) {
      console.log(error);
    } finally {
      confirmLogout();
    }
  };

  return (
    <header className="w-full px-5 md:px-20 py-2 sm:py-4 bg-blue-900 shadow fixed left-0 top-0 flex items-center justify-between z-50">
      <Link to="/">
        <div className="text-white flex items-center gap-1 max-h-14 overflow-hidden rounded-md">
          <img src={logo} alt="" className="w-14" />

          <p className="hidden sm:inline-block text-2xl ml-3">
            <span className="font-extrabold">AMSH Pharma</span>
            <span className="block font-bold text-xl -mt-1">Dept Reports</span>
          </p>
        </div>
      </Link>

      {/* navigation bars */}
      <nav className="hidden lg:block text-white">
        <ul className="p-2 flex gap-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                end={item.isParent}
                className={({ isActive }) =>
                  (isActive
                    ? "border-b-2 border-b-white flex items-center"
                    : "") +
                  "flex items-center px-4 p-2 rounded-md transition-all duration-300 border-b-2 border-b-transparent hover:border-b-2 hover:border-b-yellow-500"
                }
                to={item.path}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-md ml-2">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-8">
        {user ? (
          <div className="bg-white px-2 py-1 rounded flex items-center gap-2">
            <Link
              to={"/user-dashboard?tab=profile"}
              className="flex items-center"
            >
              <img src={user.avatar} className="rounded-full h-8 w-8" />
            </Link>
            <p className="font-bold text-md text-blue-800">
              <Link
                to={"/user-dashboard?tab=dash"}
                className=" uppercase cursor-pointer underline underline-offset-2 hover:scale-110 transition-all duration-500"
              >
                {user.fullname.split(" ")[0]}
              </Link>
            </p>
            <div className="flex items-center ml-4 bg-red-100 px-2 py-1 rounded">
              <MdLogout
                className="text-lg text-red-600 cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() => confirmLogout()}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-md">
            <Link
              to="/user-login"
              className="flex items-center gap-2 bg-blue-950 px-3 py-1 rounded text-white hover:text-blue-950 hover:bg-white"
            >
              <MdLogin />
              Login
            </Link>
            {/* <Link
              to="/add-new-business"
              className="bg-blue-950 px-3 py-1 rounded text-white hover:text-blue-950 hover:bg-white"
            >
              Register
            </Link> */}
          </div>
        )}

        {/* for small screens */}
        <div
          className="block lg:hidden z-99"
          onClick={() => setShowNav(!showNav)}
        >
          <MdMenu className="text-white" size={30} />
        </div>
      </div>

      {/* small screen navigation */}
      {showNav ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-[50%] h-screen bg-black text-white absolute top-12 right-0 opacity-90 p-4"
        >
          <div className="flex flex-col p-4 w-full">
            <div className="flex items-center justify-between w-full gap-4">
              <p className="flex-1 h-[1px] bg-gray-500"></p>
              <MdCloseFullscreen
                className="text-gray-500 cursor-pointer"
                size={20}
                onClick={() => setShowNav(!showNav)}
              />
            </div>
            <ul className="flex flex-col gap-5 bg-white/10 backdrop-blur-md shadow-lg rounded-xl mt-5 ">
              <li>
                <Link to="/">LOGIN</Link>
              </li>
              <li>
                <Link to="/support">SUPPORT</Link>
              </li>
              <li>
                <Link to="/about">ABOUT APP</Link>
              </li>
              {user && (
                <li>
                  <p
                    onClick={confirmLogout}
                    className="text-red-500 font-bold cursor-pointer"
                  >
                    LOG OUT
                  </p>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      ) : (
        <></>
      )}
    </header>
  );
}
