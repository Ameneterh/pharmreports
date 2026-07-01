import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaUserInjured,
} from "react-icons/fa";
import {
  MdOutlineMarkEmailRead,
  MdOutlineDriveFileRenameOutline,
  MdOutlinePhoneInTalk,
  MdOutlineMessage,
  MdWhatsapp,
} from "react-icons/md";
import { useState } from "react";
import { useContactStore } from "../store/contactStore";
import { useAuthStore } from "../store/authStore";

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

export default function ContactUs() {
  const navigate = useNavigate();
  const { sendMessage } = useContactStore();
  const { user } = useAuthStore();

  const [name, setName] = useState(
    user?.surname + " " + user?.otherNames || "",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({
        sender_name: name.toLowerCase(),
        sender_email: email.toLowerCase(),
        sender_phone: phone,
        text,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="pt-10 sm:pt-20 max-w-6xl min-h-screen w-full mx-auto mt-10 p-4 bg-opacity-80 text-blue-950 mb-10"
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full"
        >
          <h1 className="text-xl md:text-3xl font-bold border-l-[6px] border-l-orange-600 pl-3 mb-6 md:leading-[20px]">
            Contact the <br />
            <span className="md:text-5xl">Dev Team</span>
          </h1>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col lg:flex-row w-full"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white text-black rounded-md lg:rounded-lg p-2 lg:p-4 flex flex-col"
          >
            <p className="text-lg lg:text-2xl text-center font-bold mb-4">
              Send us a direct message
            </p>

            <div className="flex flex-col gap-5 lg:gap-6">
              {/* full name */}
              <div className="relative rounded-md border border-black">
                <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
                />
                <MdOutlineDriveFileRenameOutline
                  size={18}
                  className="absolute right-2 top-3"
                />
              </div>

              {/* phone number */}
              <div className="relative rounded-md border border-black">
                <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                  Your Phone Number:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
                />
                <MdOutlinePhoneInTalk
                  size={18}
                  className="absolute right-2 top-3"
                />
              </div>

              {/* email */}
              <div className="relative rounded-md border border-black">
                <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                  Your Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
                />
                <MdOutlineMarkEmailRead
                  size={18}
                  className="absolute right-2 top-3"
                />
              </div>

              {/* message */}
              <div className="relative rounded-md border border-black">
                <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                  Your message to us:
                </label>
                <textarea
                  type="text"
                  name="message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
                />
                <MdOutlineMessage
                  size={18}
                  className="absolute right-2 top-3"
                />
              </div>
            </div>

            <motion.button
              className="mx-auto mt-5 py-2 px-4 bg-gradient-to-r from-green-800 to-emerald-900 rounded-lg hover:from-green-600 hover:to-emerald-700 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-900 transition duration-200 cursor-pointer flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              Submit Message
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
