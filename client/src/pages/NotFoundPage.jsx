import React from "react";
import { motion } from "framer-motion";
import MainLayout from "../layout/MainLayout";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-90">
        <div className="relative p-[2px] rounded-2xl overflow-hidden mt-20 w-full md:w-[500px]">
          {/* Animated border */}
          <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,#06b6d4,#3b82f6,#8b5cf6,#06b6d4)]" />

          {/* Content */}
          <div className="relative bg-gray-900 rounded-2xl px-10 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              <img
                src="https://res.cloudinary.com/ameneterh/image/upload/v1779519750/typingfrog_q9nohb.png"
                alt="not found page image - surprised frog"
                className="w-40"
              />
              <div className="flex flex-col gap-6 flex-1 text-center">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-500 to-red-600 text-transparent bg-clip-text">
                  OOPS! PAGE NOT FOUND
                </h2>

                <p className="">
                  You must have picked the wrong door because I can't seem to
                  lay my eyes on the page you've been looking for.
                </p>
                <Link
                  to={"/"}
                  className="w-full p-2 bg-blue-950 flex items-center justify-center rounded text-white hover:opacity-90 hover:scale-110 transition-all duration-300"
                >
                  Please, Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
