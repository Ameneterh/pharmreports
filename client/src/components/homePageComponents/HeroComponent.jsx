import { motion } from "framer-motion";
import {
  CircleUserRound,
  Mail,
  Headset,
  MapPinHouse,
  FilePenLine,
  Loader,
} from "lucide-react";
import schimage from "../../assets/school_front.jpg";
import { useState } from "react";
import logo from "../../assets/InvoiceCore_bg.png";
import schinaseLogo from "../../assets/InvoiceCore_logoName.png";
import { Link } from "react-router-dom";

export default function HeroComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="pt-20 bg-top bg-cover bg-no-repeat"
      // style={{
      //   backgroundImage: `url(${schimage})`,
      // }}
    >
      <div className="h-full pt-10 md:pt-20 w-full bg-gradient-to-tr from-slate-200 via-white to-gray-200 flex flex-col lg:flex-row items-center justify-center min-h-screen">
        <div className="pb-6 h-full w-full px-4 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
            <p className="capitalize text-lg lg:text-2xl text-blue-950 font-semibold">
              get more done with
            </p>
            <div
              className="relative h-20 w-64 bg-cover bg-center bg-no-repeat text-black mb-5 bg-blue-950 p-2 rounded-md"
              style={{
                backgroundImage: `url(${schinaseLogo})`,
              }}
            >
              {/* <p className="text-xs italic text-white absolute bottom-1 right-1">
                Smart Invoicing. Stronger Business
              </p> */}
            </div>
            <p className="text-black text-sm text-center font-extralight">
              <b>InvoiceCore</b> by Schinase Tech Hubb is a powerful business
              invoicing platform designed to help companies register, manage
              accounts, and generate professional invoices with ease. Built for
              growing businesses, <b>InvoiceCore</b> centralizes account
              handlers, steamlines billing operations, and ensures accurate,
              secure financial transactions; all in one smart scalable system.
            </p>

            <Link
              to="/add-new-business"
              className="mt-5 max-w-48 py-2 px-4 bg-gradient-to-r from-green-700 to-emerald-700 font-normal rounded-lg hover:from-green-800 hover:to-emerald-800 border border-green-700 focus:outline-none focus:ring-1 focus:ring-green-800 focus:ring-offset-1 focus:ring-offset-gray-900 transition duration-300 cursor-pointer text-white flex items-center justify-center hover:scale-110"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                "Try for free"
              )}
            </Link>
          </div>
          <div className="flex flex-col gap-2 relative items-center justify-center">
            <img src={logo} alt="" className="rounded-xl" />
            <p className="px-2 py-2 md:py-3 text-sm text-white bg-yellow-700 absolute bottom-2 w-[97%] rounded-md text-center font-bold italic font-serif md:text-lg">
              Smart Invoicing. Stronger Business
            </p>
            {/* <p className="text-center text-sm text-white font-bold max-w-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ab
              ullam ad incidunt tempore eligendi minima ipsum, porro recusandae
              nesciunt animi cumque nihil dignissimos assumenda exercitationem,
              hic cum pariatur a.
            </p> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
