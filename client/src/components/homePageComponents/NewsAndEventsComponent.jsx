import { motion } from "framer-motion";
import news from "./gallery.json";
import { Link } from "react-router-dom";
import { MdOutlineSearch, MdArrowForward } from "react-icons/md";
import { useState } from "react";
import NewsDetailsComponent from "../NewsDetailsComponent";

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

export default function NewsAndEventsComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = () => {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen mt-10 p-4 lg:px-20 lg:py-16"
    >
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 items-center">
        <h1 className="text-xl lg:text-3xl font-bold text-white">
          News & Events
        </h1>
        <div className="relative rounded-md flex-1">
          {/* <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
            Your Full Name:
          </label> */}
          <input
            type="text"
            name="name"
            placeholder="Enter your search"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-none outline-none rounded-full p-2 bg-gray-50 focus:border-none focus:outline-none"
          />
          <MdOutlineSearch size={18} className="absolute right-2 top-3" />
        </div>
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mt-6 lg:mt-8 flex flex-col lg:flex-row gap-10"
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {news.map((item) => (
            <NewsDetailsComponent item={item} />
          ))}
        </motion.div>

        <div className="flex flex-col w-full lg:w-1/3 p-3 gap-4">
          <div className="p-2 rounded-xl bg-slate-200 w-full flex flex-col gap-1 items-center text-center border-2 border-white shadow-md">
            <p>We are in 2025/2026 Session</p>
            <Link
              to="news-events"
              className="p-1 bg-slate-500 hover:bg-slate-600 text-white font-semibold w-full rounded-md"
            >
              Check School Calendar
            </Link>
          </div>
          {news.slice(3).map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="py-2 text-white rounded-lg w-full max-w-xl h-fit flex items-center gap-2"
              //   style={{ backgroundImage: `url(${item.image})` }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-10 w-10 rounded-md"
              />
              <div className="flex flex-col justify-between gap-1 px-2 h-full w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-100 font-light">
                    {item.date}
                  </p>
                  <Link to={item.id}>
                    <MdArrowForward />
                  </Link>
                </div>
                <p className="w-full text-slate-100 font-semibold line-clamp-1">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <Link
        to="/news-events"
        className="mx-auto max-w-fit mt-5 py-2 px-4 bg-gradient-to-r from-green-800 to-emerald-900 rounded-lg hover:from-green-600 hover:to-emerald-700 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-900 transition duration-300 cursor-pointer flex items-center justify-center hover:scale-110"
      >
        See More ...
      </Link>
    </motion.div>
  );
}
