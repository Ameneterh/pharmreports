import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Trash2,
  FilePenLine,
  BadgePoundSterling,
  Share2,
  Search,
  Check,
  X,
  CircleX,
  MessageSquareText,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useReportsStore } from "../store/reportsStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ReadNotification({
  selectedNotification,
  handleReadNotification,
  showModal,
  setShowModal,
  getNotifications,
}) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { commentReport } = useReportsStore();
  const [reply, setReply] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   await commentReport({
    //     comment,
    //     reportId: selectedReport._id,
    //     commentBy: user._id,
    //   });

    //   toast.success("Comment sent successfully");
    //   setShowModal(false);
    //   getReports({ startDate, endDate });
    // } catch (error) {
    //   // toast.error(error.response.data.message);
    //   console.log(error);
    // }
  };

  return (
    <div className="p-2 fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-85 rounded shadow-md shadow-slate-100 w-full sm:w-[50%]  max-h-[90vh] sm:max-h-[85vh] relative">
        {/* top close button */}
        <span
          className="flex items-center absolute top-1 right-2 cursor-pointer bg-white py-1 px-2 rounded-full"
          onClick={() => handleReadNotification(selectedNotification?._id)}
        >
          <span className="text-xs text-gray-400 mr-1">Close</span>
          <CircleX className="text-red-500" />
        </span>

        <div className="flex flex-col p-2 rounded border text-sm">
          <div className="flex flex-col pb-2 border-b-2">
            <p className="capitalize font-bold text-lg text-center text-blue-900">
              Reading Notification
            </p>
          </div>

          {/* notifiers details */}
          <article className="flex flex-col px-4 mt-3 pb-6">
            <section className="flex flex-col border-b border-b-gray-900 pb-3">
              <p className="flex items-center gap-1">
                Notification By:{" "}
                <span className="font-semibold flex items-center gap-1">
                  <span className="font-semibold">
                    {selectedNotification?.notificationBy?.rank ===
                    "Dep Director"
                      ? "Pharm Mrs"
                      : selectedNotification?.notificationBy?.role ===
                          "pharmacist"
                        ? "Pharm"
                        : "Pharm Tech"}
                  </span>{" "}
                  <span className="flex items-center capitalize">
                    {selectedNotification?.notificationBy?.fullname}
                  </span>
                </span>
              </p>
            </section>

            {/* notification details */}
            <section className="flex flex-col mt-3">
              <p className="flex items-start gap-1">
                <span className="font-semibold">Title:</span>{" "}
                {selectedNotification?.title}
              </p>
              <p className="flex items-start gap-1 mt-2">
                <span className="font-semibold">Content:</span>{" "}
                {selectedNotification?.content}
              </p>
              {selectedNotification?.remarks && (
                <p className="flex items-start gap-1 mt-2">
                  <span className="font-semibold">Remarks:</span>{" "}
                  {selectedNotification?.remarks}
                </p>
              )}
            </section>
          </article>

          {/* make reply on notification */}
          <div className="flex items-center py-4 border-t-[1px] border-t-gray-800 w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col md:flex-row items-end gap-3"
            >
              <div className="relative w-full">
                <p className="bg-opacity-20 text-xs bg-white px-2 absolute left-0 -top-2">
                  Reply to Notification (Optional)
                </p>
                <textarea
                  value={reply}
                  rows={10}
                  placeholder="Reply to be sent ..."
                  className="bg-white bg-opacity-5 w-full pl-3 pr-3 py-2 border border-t-transparent border-l-transparent border-r-transparent placeholder-gray-400 transition duration-200 flex-1 text-xs focus:border-transparent focus:ring-0 focus:outline-none focus:border-b-red-600 border-b-gray-800"
                  onChange={(e) => setReply(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-2 py-2 bg-green-700 text-white rounded cursor-pointer w-fit hover:scale-110 hover:bg-green-900 transition-all duration-300"
                title="Reply to Notification"
                // onClick={() => handleOpenModal(business)}
              >
                <MessageSquareText size={16} />
                <span className="text-nowrap">Send Reply</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
