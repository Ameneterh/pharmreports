import React from "react";
import { useAuthStore } from "../../../store/authStore";
import { FaAllergies, FaFileMedicalAlt } from "react-icons/fa";
import { MdLocalDrink, MdOutlineFamilyRestroom } from "react-icons/md";

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

export default function EditPatientDemographicData({ patient }) {
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
      {/* demographic info */}
      <div className="mt-3 flex flex-col gap-2 rounded-md border border-gray-400 w-full p-3 relative">
        <h1 className="absolute -top-3 left-1 bg-white px-1 font-bold">
          Patient Demographic Data
        </h1>

        <div className="flex items-center flex-wrap gap-4">
          <Field label="First Name" patient={patient?.firstName} user={user} />
          {patient?.middleName && (
            <Field
              label="Middle Name"
              patient={patient?.middleName}
              user={user}
            />
          )}
          <Field label="Last Name" patient={patient?.lastName} user={user} />
          <div className="flex items-center relative">
            <Field
              label="DOB"
              patient={patient?.dateOfBirth?.split("T")[0]}
              user={user}
            />
            <p className="absolute right-0 top-4 bg-gray-200 px-1 rounded">
              {calculateAge(patient?.dateOfBirth)}
            </p>
          </div>
          <Field label="Phone Number" patient={patient?.phone} user={user} />
        </div>

        <hr />

        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-semibold mt-1 text-blue-950">
            Emergency Contact Information
          </h1>
          <div className="flex items-center flex-wrap gap-4">
            <Field
              label="Emergency Contact Name"
              patient={patient?.emergencyContact?.name}
              user={user}
            />
            <Field
              label="Phone Number"
              patient={patient?.emergencyContact?.phone}
              user={user}
            />
            <Field
              label="Relationship"
              patient={patient?.emergencyContact?.relationship}
              user={user}
            />
            <Field
              label="Address"
              patient={patient?.emergencyContact?.address}
              user={user}
              title={patient?.emergencyContact?.address}
            />
          </div>
        </div>
      </div>

      {/* allergies */}
      <div className="mt-4 flex flex-col gap-2 rounded-md border-2 border-red-700 w-full p-3 relative">
        <h1 className="flex items-center absolute -top-4 left-1 bg-white px-1 font-bold text-lg text-red-600">
          <FaAllergies className="mr-1" size={16} /> Patient Allergies
        </h1>

        <div className="flex items-center flex-wrap gap-4 p-1">
          {patient?.allergies?.length > 0 ? (
            patient.allergies.map((allergy, index) => (
              <div
                key={index}
                className="bg-red-200 rounded-md p-2 text-sm flex items-center gap-3"
              >
                <div>
                  <p className="flex items-center gap-1">
                    Allergen:{" "}
                    <span className="font-bold">{allergy?.allergen}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    Reaction(s):{" "}
                    <span className="font-bold capitalize">
                      {allergy?.reaction}
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    Severity:{" "}
                    <span className="font-bold capitalize">
                      {allergy?.severity}
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    Status:{" "}
                    <span className="font-bold capitalize">
                      {allergy?.status}
                    </span>
                  </p>
                </div>

                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <FaAllergies className="text-red-600" size={50} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No allergies recorded.</p>
          )}
          {/* <Field label="First Name" patient={patient?.firstName} user={user} /> */}
        </div>
      </div>

      {/* medical history */}
      <div className="mt-6 flex flex-col gap-2 rounded-md border border-gray-400 w-full p-3 relative">
        <h1 className="flex items-center absolute -top-4 left-1 bg-white px-1 font-bold">
          <FaFileMedicalAlt className="mr-1" size={16} />
          Medical History
        </h1>

        <div className="flex items-center flex-wrap p-1">
          {patient?.medicalHistory?.length > 0 ? (
            patient.medicalHistory.map((history, index) => (
              <div key={index} className="rounded-md text-sm flex items-center">
                <div>
                  <p className="flex items-center gap-1">
                    {index + 1}. {history?.condition}, diagnosed on{" "}
                    {history?.diagnosisDate?.split("T")[0]}{" "}
                    {history?.status === "active"
                      ? "(Treatment Ongoing)"
                      : "(Resolved)"}
                    {history?.notes !== "" && (
                      <span className="text-gray-500">
                        {" "}
                        - Notes: {history?.notes}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No medical history recorded.
            </p>
          )}
        </div>
      </div>

      {/* family history */}
      <div className="mt-6 flex flex-col gap-2 rounded-md border border-gray-400 w-full p-3 relative">
        <h1 className="flex items-center absolute -top-4 left-1 bg-white px-1 font-bold">
          <MdOutlineFamilyRestroom className="mr-1" size={16} />
          Family History
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

      {/* social history */}
      <div className="mt-6 flex flex-col gap-2 rounded-md border border-gray-400 w-full p-3 relative">
        <h1 className="flex items-center absolute -top-4 left-1 bg-white px-1 font-bold">
          <MdLocalDrink className="mr-1" size={16} /> Social History
        </h1>

        <div className="flex items-center flex-wrap gap-4 p-1">
          {patient?.socialHistory ? (
            <div className="text-sm flex items-center flex-wrap gap-x-3">
              <div>
                <p className="flex items-center gap-1 capitalize">
                  Smoking: {patient?.socialHistory?.smoking?.status}{" "}
                  {patient?.socialHistory?.smoking?.quantity}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 capitalize">
                  Alcohol Consumption: {patient?.socialHistory?.alcohol?.status}{" "}
                  {patient?.socialHistory?.alcohol?.quantity}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 capitalize">
                  Environmental Exposure:{" "}
                  {patient?.socialHistory?.occupationExposure}{" "}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 capitalize">
                  Living arrangement:{" "}
                  {patient?.socialHistory?.livingArrangement}{" "}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 capitalize">
                  Additional Notes: {patient?.socialHistory?.notes}{" "}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No social history recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
