import React from "react";
import { Link } from "react-router-dom";

export default function PharmaCareLinks({ linkUrl, title, icon: Icon }) {
  return (
    <Link
      to={linkUrl}
      className="w-full h-48 sm:w-48 border border-white hover:border-red-700 rounded-xl bg-white bg-opacity-20 backdrop-blur-md backdrop-filter hover:scale-105 hover:bg-opacity-35 transition-all duration-500 hover:shadow-lg flex flex-col items-center justify-center p-4"
    >
      <Icon size={96} className="text-blue-950" />
      <p className="text-sm text-green-950 font-semibold">{title}</p>
    </Link>
  );
}
