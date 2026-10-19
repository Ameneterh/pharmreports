import React from "react";
import { useAuthStore } from "../../../store/authStore";
import { FaAllergies } from "react-icons/fa";
import { MdLocalDrink, MdOutlineFamilyRestroom } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";

// const inputClass =
//   "w-full rounded-md border border-gray-300 px-3 py-2 " +
//   "outline-none focus:border-blue-500 focus:ring-1 " +
//   "focus:ring-blue-500";
const labelClass = "block text-sm font-light text-gray-700";
const inputClass =
  "rounded-md border-none border-gray-300 px-3 " +
  "outline-none focus:border-blue-500 focus:ring-1 " +
  "focus:ring-blue-500";

function Field({ label, patient, user, title }) {
  return (
    <div className="flex items-center relative mt-2" title={title || ""}>
      <div className="w-full text-xs text-nowrap absolute -top-2 bg-white text-red-900 flex items-center gap-2">
        <p>{label}</p> <p className="flex-1 h-[1px] bg-red-900"></p>
      </div>
      <input
        value={patient}
        disabled={!user?.isAdmin}
        className={`rounded-md w-fit pt-2 pb-1 bg-transparent border-none outline-none focus:outline-none text-sm ${
          !user?.isAdmin ? "cursor-not-allowed" : ""
        }`}
        // onChange={(e) => setWard(e.target.value)}
      />
    </div>
    // <div className="flex items-center w-fit">
    //   <label className={labelClass}>{label}</label>
    //   {children}
    // </div>
  );
}

export default function EditDrugHistoryDetails({ patient }) {
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    // Adjust if the birthday hasn't occurred yet this year
    if (days < 0) {
      months--;

      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      days += previousMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years >= 1) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    }

    if (months >= 1) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    }

    return `${days} ${days === 1 ? "day" : "days"}`;
  };

  const { user } = useAuthStore();

  return (
    <div className="text-sm font-light py-2">
      {/* medication history */}
      <div className="mt-6 flex flex-col gap-2 rounded-md border border-gray-400 w-full p-3 relative">
        <h1 className="flex items-center absolute -top-4 left-1 bg-white px-1 font-bold">
          <GiMedicines className="mr-1" size={16} />
          Medication History
        </h1>

        <div className="flex items-center flex-wrap gap-4 p-1">
          {patient?.familyHistory?.length > 0 ? (
            patient.familyHistory.map((history, index) => (
              <div
                key={index}
                className="bg-red-200 rounded-md p-2 text-sm flex items-center gap-3"
              >
                <div>
                  <p className="flex items-center gap-1">
                    {history?.relationship} {history?.condition}{" "}
                    {history?.notes}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No family history recorded.</p>
          )}
        </div>
      </div>

      {/* herbal medicines history */}
      <div className="mt-6 flex flex-col gap-2 rounded-md border border-gray-400 w-full p-3 relative">
        <h1 className="flex items-center absolute -top-4 left-1 bg-white px-1 font-bold">
          <GiMedicines className="mr-1" size={16} />
          Herbal Medicines History
        </h1>

        <div className="flex items-center flex-wrap gap-4 p-1">
          {patient?.herbalMedicineHistory?.length > 0 ? (
            patient.herbalMedicineHistory.map((history, index) => (
              <div key={index} className="text-sm flex items-center gap-3">
                <div className="flex items-start gap-1">
                  <p>{index + 1}. </p>
                  <p className="flex items-center gap-1">
                    {history?.productName}, {history?.purpose},{" "}
                    {history?.currentUse === true
                      ? "currently uses"
                      : "had used"}{" "}
                    {history?.frequency}, {history?.notes}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No herbal medicine history recorded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
