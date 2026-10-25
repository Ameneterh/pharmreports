import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import MainLayout from "../layout/MainLayout";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashboardComponent from "../components/DashboardComponent";
import DashUsers from "../components/DashUsers";
import DashProfile from "../components/DashProfile";
import SendReport from "./SendReport";
import DashReports from "../components/DashReports";
import DashAddUser from "../components/DashAddUser";
import DashGenerateReport from "../components/DashGenerateReport";
import DashGeneralInformation from "../components/DashGeneralInformation";
import AddNewPatient from "../components/PharmaCareComponents/AddNewPatient";
import ReviewEncounter from "../components/PharmaCareComponents/ReviewEncounter";
import AddEncounter from "../components/PharmaCareComponents/AddEncounter";

export default function UserDashboard() {
  const { user, logout, isLoading } = useAuthStore();

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-screen mt-20 backdrop-filter backdrop-blur-lg shadow-2xl flex flex-col md:flex-row"
      >
        {/* <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
          Dashboard
        </h2> */}

        {/* Sidebar */}
        <div className="">
          <DashSidebar />
        </div>

        {/* user */}
        {tab === "profile" && <DashProfile />}
        {tab === "add-user" && <DashAddUser />}
        {tab === "users" && <DashUsers />}

        {/* for dashboard */}
        {tab === "dash" && <DashboardComponent />}

        {/* reports routes */}
        {tab === "send-report" && <SendReport />}
        {tab === "reports" && <DashReports />}
        {tab === "generate-report" && <DashGenerateReport />}

        {/* view general information */}
        {tab === "general-information" && <DashGeneralInformation />}

        {/* pharma care links */}
        {tab === "add-patient" && <AddNewPatient />}
        {tab === "add-encounter" && <AddEncounter />}
        {tab === "review-encounter" && <ReviewEncounter />}
      </motion.div>
    </MainLayout>
  );
}
