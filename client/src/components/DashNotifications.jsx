import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRegSadTear } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline, IoIosTimer } from "react-icons/io";
import { SiParamountplus } from "react-icons/si";
import { FiPieChart } from "react-icons/fi";
import { PiInvoiceBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AdminDashboardComponent, {
  AdminDashboardUserTotalComponent,
  AdminDashboardReportComponent,
  LastWeekReportComponent,
} from "./AdminDashboardComponent";
import { UserDashboardComponents } from "./AdminDashboardComponent";
import Divider from "./Divider";
import { useReportsStore } from "../store/reportsStore";
import ReadReport from "./ReadReport";
import { BellPlus, Loader } from "lucide-react";

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

export default function DashNotifications() {
  const getLastSunday = () => {
    const today = new Date();
    const day = today.getDay(); // Sunday = 0, Monday = 1, ... Saturday = 6

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - day);
    lastSunday.setHours(0, 0, 0, 0);

    return lastSunday.toISOString().split("T")[0];
  };

  const { user } = useAuthStore();
  const { getAllUsers, isLoading } = useAuthStore();
  const { getAllReports } = useReportsStore();

  const [formData, setFormData] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // for users
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [userCount, setUserCount] = useState(0);

  // for reports
  const [reports, setReports] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [lastMonthReports, setLastMonthReports] = useState(0);
  const [lastWeekReports, setLastWeekReports] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [reportsByRole, setReportsByRole] = useState(0);

  // get users
  const getUsers = async () => {
    try {
      const { users, totalUsers, lastMonthUsers, userCounts } =
        await getAllUsers();
      setUsers(users);
      setTotalUsers(totalUsers);
      setLastMonthUsers(lastMonthUsers);
      setUserCount(userCounts);
    } catch (error) {
      console.log(error);
    }
  };

  // get users
  const getReports = async ({
    startDate = new Date(getLastSunday()),
    endDate = new Date(),
  } = {}) => {
    try {
      const {
        reports,
        totalReports,
        // lastMonthReports,
        lastWeekReports,
        reportCounts,
        reportsByRole,
      } = await getAllReports({ startDate, endDate });
      setReports(reports);
      setTotalReports(totalReports);
      // setLastMonthReports(lastMonthReports);
      setLastWeekReports(lastWeekReports);
      setReportCount(reportCounts);
      setReportsByRole(reportsByRole);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user.role === "architect" || user.isAdmin) {
      getUsers();
    }
    getReports();
  }, [user._id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Sending Notification!");
  };

  return (
    <div className="flex flex-col gap-4 w-full p-3 md:mt-6">
      <h1 className="text-2xl font-bold text-blue-900 bg-clip-text">
        Notifications
      </h1>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-96 max-h-fit bg-white rounded-md shadow-md shadow-slate-400 border p-3"
        >
          <p className="text-lg text-center font-bold text-blue-900">
            Send General Notification
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col mt-5 gap-5">
            <div className="flex flex-col sm:flex-row gap-3 relative w-full">
              <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                <span className="text-red-600 font-bold">*</span>Title:
              </p>
              <input
                value={formData.dutiesDone}
                onChange={(e) =>
                  setFormData({ ...formData, dutiesDone: e.target.value })
                }
                rows={10}
                placeholder="Enter description..."
                className="w-full sm:w-1/4 pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 relative w-full">
              <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                <span className="text-red-600 font-bold">*</span>Content:
              </p>
              <textarea
                value={formData.dutiesDone}
                onChange={(e) =>
                  setFormData({ ...formData, dutiesDone: e.target.value })
                }
                rows={10}
                placeholder="Enter description..."
                className="w-full sm:w-1/4 pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 relative w-full">
              <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                Remarks (optional):
              </p>
              <textarea
                value={formData.dutiesDone}
                onChange={(e) =>
                  setFormData({ ...formData, dutiesDone: e.target.value })
                }
                rows={10}
                placeholder="Enter description..."
                className="w-full sm:w-1/4 pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 text-xs bg-blue-700 hover:bg-opacity-90 rounded px-3 py-2 text-white max-w-fit"
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <Loader
                    size={18}
                    className="animate-spin mx-auto text-white font-bold"
                  />
                  <p>Sending ...</p>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-white">
                  <BellPlus size={18} className="text-white font-bold" />
                  <p>Send Notification</p>
                </span>
              )}
            </button>
          </form>
        </motion.div>

        {/* notifications content display */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full md:mx-auto col-span-2"
          //   className="w-full table-auto overflow-x-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 flex gap-5 col-span-2"
        >
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-gray-700">
              Recent Notifications
            </p>
            {reports.length > 0 ? (
              <table className="border-collapse table-auto mx-auto min-w-full border-none overflow-x-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
                {/* <thead className=" bg-gray-500">
                  <tr className="border-b-[2px] border-b-black text-sm">
                    <th className="text-left px-4 py-1 text-nowrap">
                      Report Date
                    </th>
                    <th className="text-left px-4 py-1 text-nowrap">
                      Reporter
                    </th>
                    <th className="text-left px-4 py-1 text-nowrap">
                      Duty Details
                    </th>
                    <th className="text-left px-4 py-1 text-nowrap">Station</th>
                    <th className="text-left px-4 py-1 text-nowrap">Actions</th>
                  </tr>
                </thead> */}

                <tbody className="">
                  {reports.slice(0, 10).map((business) => (
                    <tr
                      key={business._id}
                      className="border-b border-b-gray-600"
                    >
                      <td className="px-4 py-1 text-xs align-top">
                        <div className="flex-col md:flex-row items-center gap-1">
                          <div className="flex flex-col md:flex-row items-center gap-1">
                            {business.dutyDateTime
                              ? new Date(business.dutyDateTime).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    // hour: "numeric",
                                    // minute: "2-digit",
                                    // hour12: true,
                                  },
                                )
                              : ""}
                            <div className="flex items-start gap-2 text-nowrap">
                              <div className="flex flex-col">
                                <p className="flex items-center gap-1">
                                  <span className="font-semibold flex items-center gap-1">
                                    <span className="font-semibold">
                                      {business?.reporter?.rank === "admin"
                                        ? "Pharm Mrs"
                                        : business?.reporter?.role ===
                                            "pharmacist"
                                          ? "Pharm"
                                          : "Pharm Tech"}
                                    </span>{" "}
                                    <span className="flex items-center capitalize">
                                      {business?.reporter?.fullname}
                                    </span>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <p className="px-4 py-1 align-top line-clamp-2">
                            {business.dutiesDone}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-1 text-sm capitalize align-top">
                        <span
                          className="flex items-center gap-2 text-blue-700 rounded cursor-pointer w-fit hover:scale-110 transition-all duration-300 hover:underline underline-offset-2"
                          onClick={() => handleOpenModal(business)}
                        >
                          Read
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Reports found.</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* modal to update user status */}
      {showModal && (
        <ReadReport
          selectedReport={selectedReport}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
