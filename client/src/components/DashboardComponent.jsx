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

export default function DashboardComponent() {
  const getLastSunday = () => {
    const today = new Date();
    const day = today.getDay(); // Sunday = 0, Monday = 1, ... Saturday = 6

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - day);
    lastSunday.setHours(0, 0, 0, 0);

    return lastSunday.toISOString().split("T")[0];
  };

  const { user } = useAuthStore();
  const { getAllUsers } = useAuthStore();
  const { getAllReports } = useReportsStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
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

  return (
    <div className="flex flex-col gap-4 w-full p-3 md:mt-6">
      <h1 className="text-2xl font-bold text-blue-900 bg-clip-text">
        Dashboard
      </h1>
      {user.role === "architect" || user.isAdmin ? (
        <>
          <div className="flex-wrap flex gap-4">
            {/* show total number of registered users */}
            <AdminDashboardUserTotalComponent
              totalUsers={totalUsers}
              heading={"total user count"}
              userCount={userCount}
            />

            {/* show total number reports submitted */}
            <AdminDashboardReportComponent
              totalReports={totalReports}
              heading={"total report count"}
              reportCount={userCount}
              reportsByRole={reportsByRole}
            />

            {/* show total number reports submitted */}
            {/* <LastWeekReportComponent
              totalReports={lastWeekReports}
              heading={"this week's reports"}
              reportCount={userCount}
              reportsByRole={reportsByRole}
            /> */}

            {/* total clients created */}
            {/* <AdminDashboardComponent
              totalUsers={totalClients}
              type="Clients"
              heading={"all clients"}
              lastMonthUsers={lastMonthClients}
            /> */}

            {/* total invoices created */}
            {/* <AdminDashboardComponent
              totalUsers={totalInvoices}
              type="Invoices"
              heading={"all invoices"}
              lastMonthUsers={lastMonthInvoices}
            /> */}
          </div>
        </>
      ) : (
        <></>
      )}

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full md:mx-auto"
      >
        <p className="text-lg font-bold mb-1">Recent Reports</p>
        {reports.length > 0 ? (
          <table className="border-collapse table-auto mx-auto min-w-full border-none">
            <thead className=" bg-gray-500">
              <tr className="border-b-[2px] border-b-black text-sm">
                <th className="text-left px-4 py-1 text-nowrap">Report Date</th>
                <th className="text-left px-4 py-1 text-nowrap">Reporter</th>
                <th className="text-left px-4 py-1 text-nowrap">
                  Duty Details
                </th>
                <th className="text-left px-4 py-1 text-nowrap">Station</th>
                <th className="text-left px-4 py-1 text-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="">
              {reports.slice(0, 5).map((business) => (
                <tr key={business._id} className="border-b border-b-gray-600">
                  <td className="px-4 py-1 text-sm align-top">
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
                  </td>
                  {/* <td className="px-4 py-1 text-sm align-top">
                    {business.createdAt
                      ? new Date(business.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </td> */}
                  <td className="px-4 py-1 align-top">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col text-sm">
                        <p className="flex items-center gap-1">
                          <span className="font-semibold flex items-center gap-1">
                            <span className="font-semibold">
                              {business?.reporter?.role === "admin"
                                ? "Pharm Mrs"
                                : business?.reporter?.role === "pharmacist"
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
                  </td>
                  <td className="px-4 py-1 align-top">
                    <div className="flex items-center text-sm gap-1">
                      <span className={`text-sm cursor-pointer capitalize`}>
                        {business.dutyType}
                      </span>
                      Duty
                      <span className={`text-sm cursor-pointer capitalize`}>
                        {business.timeOfDuty}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-1 align-top text-sm">
                    {business.workStation}
                  </td>
                  <td className="px-4 py-1 text-sm capitalize align-top">
                    <span
                      className="flex items-center gap-2 text-blue-700 rounded cursor-pointer w-fit hover:scale-110 transition-all duration-300 hover:underline underline-offset-2"
                      onClick={() => handleOpenModal(business)}
                    >
                      Read Report
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Reports found.</p>
        )}
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
