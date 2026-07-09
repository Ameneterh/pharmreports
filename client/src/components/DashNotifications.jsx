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
import { BellPlus, Check, Loader, X } from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";
import toast from "react-hot-toast";
import ReadNotification from "./ReadNotification";

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
  const { user } = useAuthStore();
  const { sendNotification, readNotification, getAllNotifications, isLoading } =
    useNotificationStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    remarks: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleOpenModal = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getNotifications = async () => {
    try {
      const { notifications } = await getAllNotifications();
      setNotifications(notifications.notifications);
      return notifications;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    getNotifications();
  }, [user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendNotification({
        title: formData.title,
        content: formData.content,
        remarks: formData.remarks,
        notificationBy: user._id,
      });
      setFormData({
        title: "",
        content: "",
        remarks: "",
      });
      getNotifications();
      toast.success("New notification sent successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send notification.");
    }
  };

  const handleReadNotification = async (id) => {
    try {
      await readNotification({ id, user });
      getNotifications();
      toast.success("Notification read successfully!");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark notification as read.");
    }
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
          className="bg-opacity-40 w-full max-w-96 max-h-fit bg-white rounded-md shadow-md shadow-slate-400 border p-3"
        >
          <p className="text-lg text-center font-bold text-blue-900">
            Send General Notification
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col mt-5 gap-5">
            <div className="flex flex-col sm:flex-row gap-3 relative w-full">
              <p className="bg-opacity-10 text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                <span className="text-red-600 font-bold">*</span>Title:
              </p>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                rows={10}
                placeholder="Enter description..."
                className="bg-white bg-opacity-5 w-full sm:w-1/4 pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600 border-b-gray-800"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 relative w-full">
              <p className="bg-opacity-10 text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                <span className="text-red-600 font-bold">*</span>Content:
              </p>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={10}
                placeholder="Enter description..."
                className="bg-white bg-opacity-5 w-full sm:w-1/4 pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600 border-b-gray-800"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 relative w-full">
              <p className="bg-opacity-10 text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                Remarks (optional):
              </p>
              <textarea
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                rows={10}
                placeholder="Enter description..."
                className="bg-white bg-opacity-5 w-full sm:w-1/4 pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600 border-b-gray-800"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 text-xs bg-blue-700 hover:bg-opacity-90 rounded px-3 py-2 text-white max-w-fit"
              disabled={isLoading}
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
        >
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-gray-900">
              Recent Notifications
            </p>
            {notifications?.length > 0 ? (
              <table className="border-collapse table-auto mx-auto min-w-full border-none overflow-x-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
                <tbody className="">
                  {notifications?.slice(0, 10).map((notification) => (
                    <tr
                      key={notification?._id}
                      className="border-b border-b-gray-600"
                    >
                      <td className="py-1 text-xs align-top">
                        <div className="flex-col md:flex-row items-center gap-1">
                          <div className="flex items-start md:items-center gap-1">
                            {notification?.createdAt
                              ? new Date(
                                  notification?.createdAt,
                                ).toLocaleString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                            <div className="flex items-start gap-2 text-nowrap">
                              <div className="flex flex-col">
                                <p className="flex items-center gap-1">
                                  <span className="font-semibold flex items-center gap-1">
                                    <span className="font-semibold">
                                      {notification?.notificationBy?.rank ===
                                      "admin"
                                        ? "Pharm Mrs"
                                        : notification?.notificationBy?.role ===
                                            "pharmacist"
                                          ? "Pharm"
                                          : "Pharm Tech"}
                                    </span>{" "}
                                    <span className="flex items-center capitalize">
                                      {notification?.notificationBy?.fullname}
                                    </span>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <p className="px-4 py-1 align-top line-clamp-2">
                            <span className="font-semibold block">
                              <span className="flex items-center gap-1">
                                {notification?.readBy?.some(
                                  (item) => item.reader._id === user._id,
                                ) ? (
                                  <Check size={16} className="text-blue-700" />
                                ) : (
                                  <X size={16} className="text-red-700" />
                                )}

                                {notification?.title}
                              </span>
                            </span>
                            {notification?.content}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-1 text-sm capitalize align-top">
                        <span
                          className="flex items-center gap-2 text-blue-700 rounded cursor-pointer w-fit hover:scale-110 transition-all duration-300 hover:underline underline-offset-2"
                          onClick={() => handleOpenModal(notification)}
                        >
                          Read
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No new notifications found!</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* modal to update user status */}
      {showModal && (
        <ReadNotification
          selectedNotification={selectedNotification}
          showModal={showModal}
          setShowModal={setShowModal}
          handleReadNotification={handleReadNotification}
        />
      )}
    </div>
  );
}
