import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInvoiceStore } from "../store/invoiceStore";
import { useAuthStore } from "../store/authStore";
import { use } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import {
  AtSign,
  Loader,
  LockKeyhole,
  User,
  CalendarClock,
  PhoneOutgoing,
  EyeOff,
  Eye,
  KeySquare,
} from "lucide-react";

export default function DashUpdatePassword({ setShowUpdatePassword }) {
  const { user, updatePassword } = useAuthStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   console.log(
  //     "user: ",
  //     user._id,
  //     "old pass: ",
  //     oldPassword,
  //     "new pass: ",
  //     newPassword,
  //     "confirm pass: ",
  //     confirmPassword,
  //   );

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const response = await updatePassword({
        userId: user._id,
        oldPassword,
        password: newPassword,
      });

      if (response?.success) {
        toast.success(response.message);
        setShowUpdatePassword(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  //   const { updateInvoicePayment, getAllInvoices } = useInvoiceStore();
  //   const [paymentAmount, setPaymentAmount] = useState("");
  //   const [paymentMethod, setPaymentMethod] = useState("");
  //   const [reference, setReference] = useState("");

  //   const [invoices, setInvoices] = useState([]);
  //   const [selectedInvoice, setSelectedInvoice] = useState(null);

  //   const getInvoices = async () => {
  //     try {
  //       const { invoices } = await getAllInvoices();

  //       if (user.role === "architect") {
  //         setInvoices(invoices);
  //       } else {
  //         const filteredInvoice = invoices.filter(
  //           (invoice) => user.business._id === invoice.company._id,
  //         );
  //         setInvoices(filteredInvoice);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     getInvoices();
  //   }, [invoice.totalAmountReceived]);

  //   const formatNumber = (value) => {
  //     if (!value) return "";

  //     const parts = value.split(".");

  //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //     return parts.join(".");
  //   };

  //   const handleChange = (e) => {
  //     let value = e.target.value.replace(/,/g, "");

  //     // Allow only numbers and one decimal point
  //     value = value.replace(/[^\d.]/g, "");

  //     // Prevent multiple decimal points
  //     const parts = value.split(".");
  //     if (parts.length > 2) {
  //       value = parts[0] + "." + parts.slice(1).join("");
  //     }

  //     setPaymentAmount(value);
  //   };

  //   const handleUpdatePayment = async (e) => {
  //     e.preventDefault();

  //     try {
  //       await updateInvoicePayment(
  //         invoice._id,
  //         paymentAmount,
  //         paymentMethod,
  //         reference,
  //       );
  //       toast.success("Invoice payment updated successfully");
  //     } catch (error) {
  //       toast.error(
  //         error.response?.data?.message || "Failed to update invoice payment",
  //       );
  //     } finally {
  //       setShowModal(false);
  //     }
  //   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex min-h-full justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-fit mt-20">
        <h3 className="flex flex-col items-center mb-5 text-lg text-gray-800 dark:text-gray-400 font-bold text-center">
          <KeySquare className="text-red-600" size={40} />
          Update Password
        </h3>

        <div className="flex flex-col p-2 rounded border-t-2 text-sm">
          <form
            onSubmit={handlePasswordUpdate}
            className="w-full flex flex-col gap-2"
          >
            {/* old password */}
            <div className="mt-2 relative rounded-md border border-black">
              <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                Old Password:
              </label>
              <input
                type="text"
                // id="old_password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
              />
            </div>

            {/* new password */}
            <div className="mt-2 relative rounded-md border border-black">
              <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                New Password:
              </label>
              <input
                type="text"
                id="new_password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
              />
            </div>

            {/* confirm new password */}
            <div className="mt-2 relative rounded-md border border-black">
              <label className="absolute font-semibold -top-3 bg-white px-1 left-1 text-xs text-gray-800">
                Confirm Password:
              </label>
              <input
                type="text"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full outline-none border-none focus:outline-none focus:border-none rounded-md p-2 bg-white"
              />
            </div>

            {/* buttons */}
            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={() => setShowUpdatePassword(false)}
                className="bg-gray-500 text-white px-4 rounded py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 rounded py-2"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
