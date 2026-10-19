import { FaHospitalUser, FaRegHospital, FaUserCircle } from "react-icons/fa";
import { FaBedPulse } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { usePatientStore } from "../store/patientStore";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";

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

const visitRecords = [
  {
    visitId: "OP000002",
    visitDate: "2026-09-25",
  },
  {
    visitId: "IP000002",
    visitDate: "2026-09-30",
  },
  {
    visitId: "OP000002",
    visitDate: "2026-10-01",
  },
];

export default function ViewPatientRecords() {
  const { user } = useAuthStore();
  const { getPatientByHospitalNumber } = usePatientStore();
  const { hospitalNumber } = useParams();

  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("patientDetails");

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

  const getPatientById = async () => {
    const patient = await getPatientByHospitalNumber(hospitalNumber);
    setPatient(patient);
    try {
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getPatientById();
  }, []);

  return (
    <MainLayout>
      <div className="py-2 px-2 md:px-4 mt-6 w-full relative min-h-svh bg-white">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="w-full min-h-screen mt-20 backdrop-filter backdrop-blur-lg flex flex-col md:flex-row gap-4 md:gap-8 mx-auto mb-10 rounded-xl"
        >
          <div className="flex flex-col items-center min-w-80 bg-white">
            <div className="flex items-start gap-2 w-full h-fit p-2 bg-slate-100 rounded">
              <FaUserCircle size={80} className="text-green-800" />
              <div className="flex flex-col text-sm">
                <div className="flex flex-col">
                  <p className="text-xs -mb-1">Patient Name</p>
                  <p
                    className="font-bold uppercase text-nowrap line-clamp-1"
                    title={patient?.fullname}
                  >
                    {patient?.fullname}
                  </p>
                </div>
                <div className="h-[1px] my-1 bg-red-600 w-full"></div>
                <p className="font-semibold text-xs">
                  MR Number:{" "}
                  <span className="font-normal uppercase">
                    {patient?.hospitalNumber}
                  </span>
                </p>
                <p className="font-semibold text-xs">
                  Phone Number:{" "}
                  <span className="font-normal uppercase">
                    {patient?.phoneNumber}
                  </span>
                </p>
                <p className="font-semibold text-xs">
                  Age:{" "}
                  <span className="font-normal">
                    {calculateAge(patient?.dateOfBirth)}
                  </span>
                </p>
                <p className="font-semibold text-xs">
                  Gender:{" "}
                  <span className="font-normal uppercase">
                    {patient?.phoneNumber}
                  </span>
                </p>
                <p className="font-semibold text-xs">
                  Last Visit:{" "}
                  <span className="font-normal">
                    {patient?.updatedAt
                      ? new Date(patient?.updatedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </span>
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col items-start mt-3">
              <p className="text-sm font-semibold">Patient Visit Records</p>
              {visitRecords?.length > 0 ? (
                <div className="flex flex-col items-start gap-1 p-2 w-full">
                  {visitRecords?.map((visit, index) => (
                    <div className="text-xs flex items-center gap-2 border p-2 rounded w-full hover:bg-gray-50 cursor-pointer">
                      {index + 1}
                      <FaHospitalUser
                        size={16}
                        className="text-blue-900"
                      />{" "}
                      <p className="text-xs">
                        {" "}
                        {visit.visitId} -{" "}
                        {new Date(visit.visitDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No visits found</p>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <h1 className="w-full p-1 mb-1 bg-gray-100 rounded text-sm">
              Viewing details for visit{" "}
              <span className="font-semibold">{visitRecords[0].visitId}</span>{" "}
              dated{" "}
              <span className="font-semibold">
                {new Date(visitRecords[0].visitDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </h1>

            {/* buttons for active buttons */}
            <div className="flex items-center gap-1 border-b-2 border-b-gray-900">
              <p
                className={`text-xs text-nowrap p-1 cursor-pointer px-2 ${activeTab === "patientDetails" ? "bg-gray-900 text-white py-1 rounded-t-md rounded-bl-none rounded-br-none" : "bg-white font-normal"}`}
                onClick={() => setActiveTab("patientDetails")}
              >
                Patient Details
              </p>
              <p
                className={`text-xs text-nowrap p-1 cursor-pointer px-2 ${activeTab === "drugHistory" ? "bg-gray-900 text-white py-1 rounded-t-md rounded-bl-none rounded-br-none" : "bg-white font-normal"}`}
                onClick={() => setActiveTab("drugHistory")}
              >
                Drug History
              </p>
              <p
                className={`text-xs text-nowrap p-1 cursor-pointer px-2 ${activeTab === "drugTherapyProblem" ? "bg-gray-900 text-white py-1 rounded-t-md rounded-bl-none rounded-br-none" : "bg-white font-normal"}`}
                onClick={() => setActiveTab("drugTherapyProblem")}
              >
                DTPs
              </p>
              <p
                className={`text-xs text-nowrap p-1 cursor-pointer px-2 ${activeTab === "pharmaCarePlan" ? "bg-gray-900 text-white py-1 rounded-t-md rounded-bl-none rounded-br-none" : "bg-white font-normal"}`}
                onClick={() => setActiveTab("pharmaCarePlan")}
              >
                Pharma Care Plan
              </p>
              <p
                className={`text-xs text-nowrap p-1 cursor-pointer px-2 ${activeTab === "drugMonitoring" ? "bg-gray-900 text-white py-1 rounded-t-md rounded-bl-none rounded-br-none" : "bg-white font-normal"}`}
                onClick={() => setActiveTab("drugMonitoring")}
              >
                Drug Monitoring
              </p>
              <p
                className={`text-xs text-nowrap p-1 cursor-pointer px-2 ${activeTab === "labData" ? "bg-gray-900 text-white py-1 rounded-t-md rounded-bl-none rounded-br-none" : "bg-white font-normal"}`}
                onClick={() => setActiveTab("labData")}
              >
                Lab Data
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
