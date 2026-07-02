import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  Trash2,
  FilePenLine,
  BadgePoundSterling,
  Share2,
  Search,
  Check,
  X,
  CircleX,
  Loader,
  Binoculars,
  MailOpen,
  MessageSquareText,
  ScanText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Input } from "./Input";
import { MdFilterList } from "react-icons/md";
import { ReportFiltersComponent } from "./DashFilterComponent";
import { useReportsStore } from "../store/reportsStore";
import ReadReport from "./ReadReport";
import { pdf } from "@react-pdf/renderer";
import ReportsPDF from "./ReportsPDF";

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

export default function DashReports() {
  const getLastSunday = () => {
    const today = new Date();
    const day = today.getDay(); // Sunday = 0, Monday = 1, ... Saturday = 6

    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - day);
    lastSunday.setHours(0, 0, 0, 0);

    return lastSunday.toISOString().split("T")[0];
  };

  const { user } = useAuthStore();
  const { getAllReports, isLoading } = useReportsStore();

  // sorting and filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(false);

  const [formData, setFormData] = useState({});

  // others
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState(getLastSunday());
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReadReportsModal, setShowReadReportsModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);

  const getReports = async ({ startDate, endDate }) => {
    try {
      const { reports } = await getAllReports({ startDate, endDate });
      setReports(reports);

      return reports;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    getReports({ startDate, endDate });
  }, [user?._id]);

  const generatePDF = async () => {
    const reports = await getReports({
      startDate,
      endDate,
    });

    const blob = await pdf(
      <ReportsPDF reports={reports} startDate={startDate} endDate={endDate} />,
    ).toBlob();

    window.open(URL.createObjectURL(blob), "_blank");
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleShowMore = async () => {
    // const startIndex = users.length;
    // try {
    //   const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
    //   const data = await res.json();
    //   if (res.ok) {
    //     setUsers((prev) => [...prev, ...data.users]);
    //     if (data.users.length < 10) {
    //       setShowMore(false);
    //     }
    //   }
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  const handleDeleteUser = async () => {
    // setShowModal(false);
    // try {
    //   const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
    //     method: "DELETE",
    //   });
    //   const data = await res.json();
    //   if (res.ok) {
    //     setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
    //   } else {
    //     console.log(data.message);
    //   }
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  const selectedReports = reports
    .filter((report) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        report?.reporter?.fullname?.toLowerCase().includes(search) ||
        new Date(user?.createdAt)
          .toLocaleDateString("en-GB")
          .toLowerCase()
          .includes(search);

      return matchesSearch;
    })
    .sort((a, b) => {
      let result = 0;

      switch (sortBy) {
        case "date":
          result = new Date(a.createdAt) - new Date(b.createdAt);
          break;

        case "reporter":
          result = a.reporter?.fullname.localeCompare(b.reporter?.fullname);
          break;

        case "status":
          result = a.status?.localeCompare(b.status);
          break;

        default:
          break;
      }

      return sortOrder === "asc" ? result : -result;
    });

  return (
    <div className="w-full table-auto overflow-x-scroll md:mt-4 md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 flex gap-5 mt-8 sm:mt-0">
      {showFilters && (
        <ReportFiltersComponent
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          user={user}
        />
      )}

      <div className="flex flex-col gap-5 w-full">
        <h1 className="text-xl font-extrabold">Reports List:</h1>

        <div className="flex gap-5 items-center">
          {!showFilters && (
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <p className="text-primary">Filters</p>
              <MdFilterList className="w-5 h-5" />
            </div>
          )}

          {/* search bar */}
          <div className="w-full max-w-96">
            <Input
              icon={Search}
              type="text"
              placeholder="Search by Reporter ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* select reports period */}
          <div className="flex items-center gap-3">
            {/* <div className="flex flex-col"> */}
            {/* <p className="text-xs">Start Date</p> */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm h-9 px-1"
            />
            {/* </div> */}
            to
            {/* <div className="flex flex-col"> */}
            {/* <p className="text-xs">End Date</p> */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm h-9 px-1"
            />
            {/* </div> */}
          </div>

          <button
            onClick={() => getReports({ startDate, endDate })}
            className="flex items-center gap-2 text-xs bg-blue-700 hover:bg-opacity-90 rounded px-3 py-2 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader
                  size={18}
                  className="animate-spin mx-auto text-white font-bold"
                />
                <p>Searching ...</p>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-white">
                <Search size={18} className="text-white font-bold" />
                <p>Search</p>
              </span>
            )}
          </button>

          <button
            onClick={generatePDF}
            // onClick={() => handleOpenReadReportModal({ startDate, endDate })}
            className="flex items-center gap-2 text-xs bg-blue-700 hover:bg-opacity-90 rounded px-3 py-2 text-white"
          >
            <span className="flex items-center gap-1 text-white">
              <ScanText size={18} className="text-white font-bold" />
              <span className="text-nowrap">Read All</span>
            </span>
          </button>
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full md:mx-auto"
        >
          {selectedReports.length > 0 ? (
            <table className="border-collapse table-auto mx-auto min-w-full border-none">
              <thead className=" bg-gray-500">
                <tr className="border-b-[2px] border-b-black text-sm">
                  <th className="text-left px-4 py-1 text-nowrap">
                    Report Date
                  </th>
                  <th className="text-left px-4 py-1 text-nowrap">
                    Created At
                  </th>
                  <th className="text-left px-4 py-1 text-nowrap">
                    Reporter/Work Station Details
                  </th>
                  <th className="text-left px-4 py-1 text-nowrap">Comments</th>
                  <th className="text-left px-4 py-1 text-nowrap">
                    Report Details
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {selectedReports.map((business) => (
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
                    <td className="px-4 py-1 text-sm align-top">
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
                    </td>
                    <td className="px-4 py-1 align-top">
                      <div className="flex flex-col lg:flex-row items-start gap-2">
                        <div className="flex flex-col text-sm border-r border-gray-800 pr-2">
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

                          <span className={`text-sm cursor-pointer`}>
                            Work Station:{" "}
                            <span className="capitalize font-bold">
                              {business.workStation}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-col text-sm">
                          <span className={`text-sm cursor-pointer`}>
                            Duty Type:{" "}
                            <span className="capitalize font-bold">
                              {business.dutyType}
                            </span>
                          </span>
                          <span className={`text-sm cursor-pointer`}>
                            Time of Duty:{" "}
                            <span className="capitalize font-bold">
                              {business.timeOfDuty}
                            </span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <MessageSquareText size={16} />
                        <span>{business?.comments?.length}</span>
                        <span className="text-xs">
                          {business?.comments?.length === 1
                            ? "comment"
                            : "comments"}
                        </span>
                      </div>
                      {}
                    </td>

                    <td className="flex items-center gap-2 px-4 py-1 text-sm capitalize align-top">
                      <span
                        className="flex items-center gap-2 px-2 py-1 bg-blue-700 text-white rounded cursor-pointer w-fit hover:scale-110 hover:bg-blue-900 transition-all duration-300"
                        title="Read Report"
                        onClick={() => handleOpenModal(business)}
                      >
                        <MailOpen size={16} />
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
      </div>

      {/* read reports modal */}
      {/* {showReadReportsModal && <ReadManyReport reports={reports} />} */}

      {/* modal to update user status */}
      {showModal && (
        <ReadReport
          selectedReport={selectedReport}
          showModal={showModal}
          setShowModal={setShowModal}
          getReports={getReports}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
}
