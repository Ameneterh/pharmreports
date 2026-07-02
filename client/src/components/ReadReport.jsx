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

export default function ReadReport({
  selectedReport,
  showModal,
  setShowModal,
  getReports,
  startDate,
  endDate,
}) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { commentReport } = useReportsStore();
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await commentReport({
        comment,
        reportId: selectedReport._id,
        commentBy: user._id,
      });

      toast.success("Comment sent successfully");
      setShowModal(false);
      getReports({ startDate, endDate });
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="p-2 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full sm:w-[75%]  max-h-[90vh] sm:max-h-[85vh] relative">
        {/* top close button */}
        <span
          className="flex items-center absolute top-1 right-2 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <span className="text-xs text-gray-400 mr-1">Close</span>
          <CircleX className="text-red-500" />
        </span>

        {/* bottom close button */}
        <span
          className="flex items-center absolute bottom-2 left-2 sm:bottom-4 sm:right-10 cursor-pointer bg-white rounded-full max-w-fit p-1"
          onClick={() => setShowModal(false)}
        >
          <span className="text-xs text-gray-400 mr-1">Close</span>
          <CircleX className="text-red-500" />
        </span>
        <div className="flex flex-col p-2 rounded border text-sm bg-white">
          <div className="flex flex-col pb-2 border-b-2">
            <p className="capitalize font-bold text-lg text-center text-blue-900">
              Reading Report
            </p>
          </div>

          {/* reporter details */}
          <article className="flex flex-col px-4 mt-3">
            <section className="flex flex-col border-b border-b-gray-900 pb-3">
              <p className="flex items-center gap-1">
                Reporter:{" "}
                <span className="font-semibold flex items-center gap-1">
                  <span className="font-semibold">
                    {selectedReport?.reporter?.role === "admin"
                      ? "Pharm Mrs"
                      : selectedReport?.reporter?.role === "pharmacist"
                        ? "Pharm"
                        : "Pharm Tech"}
                  </span>{" "}
                  <span className="flex items-center capitalize">
                    {selectedReport?.reporter?.fullname}
                  </span>
                </span>
              </p>
              <p className="flex items-center gap-1">
                Work Station:{" "}
                <span className="font-semibold">
                  {selectedReport?.workStation}
                </span>
              </p>
              <p className="flex items-center gap-1">
                Duty Type:{" "}
                <span className="font-semibold">
                  {selectedReport?.dutyType}
                </span>
              </p>
              <p className="flex items-center gap-1">
                Time of Duty:{" "}
                <span className="font-semibold">
                  {selectedReport?.timeOfDuty}
                </span>
                <span>
                  {selectedReport?.timeOfDuty === "Night"
                    ? "8pm - 8am"
                    : "8am - 5pm"}
                </span>
              </p>
              <p className="flex items-center gap-1">
                Date & Time of Report:{" "}
                <span className="font-semibold">
                  {selectedReport?.dutyDateTime
                    ? new Date(selectedReport?.dutyDateTime).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )
                    : ""}
                </span>
              </p>
            </section>

            <div className="overflow-y-auto max-h-[55vh] p-2">
              <div className="flex flex-col gap-2 py-2 w-full">
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Work Done:</p>
                  <p className="whitespace-pre-line text-sm">
                    {selectedReport?.dutiesDone}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Challenges:</p>
                  <p className="whitespace-pre-line text-sm">
                    {selectedReport?.challenges}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Observations:</p>
                  <p className="whitespace-pre-line text-sm">
                    {selectedReport?.observations}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Interventions:</p>
                  <p className="whitespace-pre-line text-sm">
                    {selectedReport?.interventions}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Out of Stock:</p>
                  <p className="whitespace-pre-line text-sm">
                    {selectedReport?.outOfStock}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Remarks:</p>
                  <p className="whitespace-pre-line text-sm">
                    {selectedReport?.remarks}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Comments:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 p-2 bg-slate-200 gap-2">
                    {selectedReport?.comments?.length > 0 ? (
                      selectedReport?.comments?.map((comment) => (
                        <div
                          key={comment._id}
                          className="flex flex-col text-sm"
                        >
                          <div className="p-1 bg-slate-50 rounded h-full">
                            <span className="block text-xs">
                              Comment by:{" "}
                              <span className="font-semibold">
                                {comment?.commentBy?.isAdmin &&
                                comment?.commentBy?.role === "pharmacist"
                                  ? "Pharm Mrs"
                                  : comment?.commentBy?.role === "pharmacist"
                                    ? "Pharm"
                                    : "Pharm Tech"}
                              </span>{" "}
                              <span className="font-bold">
                                {comment?.commentBy.fullname}
                              </span>
                            </span>
                            <p className="ml-4">{comment?.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No comments</p>
                    )}
                  </div>
                </div>
              </div>
              {/* display comments if available */}
            </div>
          </article>

          {/* make comment on report */}
          <div className="flex items-center py-4 border-t-[1px] border-t-gray-800 w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col md:flex-row items-end gap-3"
            >
              <div className="relative w-full">
                <p className="text-xs bg-white px-2 absolute left-2 -top-2">
                  Send Comment on Report
                </p>
                <textarea
                  value={comment}
                  rows={10}
                  placeholder="Comment to be sent ..."
                  className="w-full p-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-2 py-2 bg-green-700 text-white rounded cursor-pointer w-fit hover:scale-110 hover:bg-green-900 transition-all duration-300"
                title="Comment on Report"
                // onClick={() => handleOpenModal(business)}
              >
                <MessageSquareText size={16} />
                <span className="text-nowrap">Send Comment</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
