import { motion } from "framer-motion";
import logo from "../../assets/InvoiceCore_logoName.png";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function OurClientListComponent({ clients }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2 lg:gap-8 min-w-full p-4 lg:py-20 lg:px-20 text-black border-t-2 border-white bg-white"
    >
      <div className="flex flex-col gap-2 font-light w-full max-w-96 mx-auto items-center justify-center text-center">
        <div className="flex items-center p-2 bg-blue-950 rounded-md">
          <img src={logo} alt="company_logo" className="w-24 lg:w-40" />
        </div>
        <p className="text-blue-950 text-lg lg:text-3xl font-extrabold">
          Our Esteemed Clients
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-4">
        {clients
          .filter((client) => client.plan !== "trial")
          .map((client, id) => (
            <div
              className="flex flex-col gap-3 items-center rounded-md p-2 shadow-md border"
              key={id}
            >
              <img
                src={client.business_logo}
                alt={client.business_name}
                className="h-12"
              />
              <h1 className="text-sm font-extrabold text-gray-500 line-clamp-1">
                {client.business_name}
              </h1>
            </div>
          ))}
      </div>
    </motion.div>
  );
}
