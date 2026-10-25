import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore.js";
import { MdArrowForwardIos, MdEditNote, MdPersonAddAlt1 } from "react-icons/md";
import { usePatientStore } from "../../store/patientStore.js";
import { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { GiSpyglass } from "react-icons/gi";
import EncounterForm from "./EncounterComponents/EncounterForm.jsx";

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

const initialForm = {
  hospitalNumber: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  phone: "",

  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
    address: "",
  },

  allergies: [],

  medicalHistory: [],

  familyHistory: [],

  socialHistory: {
    smoking: {
      status: "unknown",
      quantity: "",
    },
    alcohol: {
      status: "unknown",
      quantity: "",
    },
    occupationExposure: "",
    livingArrangement: "",
    notes: "",
  },

  herbalMedicineHistory: [],
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 " +
  "outline-none focus:border-blue-500 focus:ring-1 " +
  "focus:ring-blue-500";

const labelClass = "block text-sm font-medium text-gray-700";

function Section({ title, children }) {
  return (
    <section className="space-y-4 rounded-lg border bg-white p-5">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function AddEncounter() {
  const getToday = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  const { user } = useAuthStore();
  const [openAddNewEncounter, setOpenAddNewEncounter] = useState(false);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState(getToday());

  const [form, setForm] = useState(initialForm);

  const [validationError, setValidationError] = useState("");

  const { addPatient, getAllPatients, isLoading, error, message } =
    usePatientStore();

  // const clearPatientMessages = usePatientStore(
  //   (state) => state.clearPatientMessages,
  // );

  // Update ordinary fields.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // search function
  const handleSearch = () => {
    if (!form.hospitalNumber.trim().toLowerCase()) return;

    getPatient(form.hospitalNumber.trim().toLowerCase());
  };

  const getPatients = async ({ startDate, endDate }) => {
    try {
      const patients = await getAllPatients({ startDate, endDate });

      setPatients(patients);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getPatients({ startDate, endDate });
  }, []);

  const getPatient = async (hospitalNumber) => {
    const patient = patients.patients.filter(
      (patient) => patient.hospitalNumber.toLowerCase() === hospitalNumber,
    );

    setPatient(patient);
  };

  return (
    <div className="md:px-10 mt-6 w-full relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full mx-auto mt-2 mb-10 p-4 backdrop-filter backdrop-blur-lg rounded-xl"
      >
        <p className="flex items-center text-sm mb-6 text-blue-950 border-b-2 border-b-red-900 pb-2">
          Pharmaceutical Care Plan{" "}
          <MdArrowForwardIos size={12} className="mx-1" />{" "}
          <span className="font-bold">Add Encounter</span>
        </p>
        <div className="flex flex-wrap gap-6 w-full">
          <div className="flex flex-col gap-6 w-full">
            {!patient && (
              <div className="flex gap-4 p-2 pt-4 rounded-md bg-white">
                <div className="flex items-center relative w-full">
                  <p className="text-xs absolute -top-3 left-3 bg-white px-2">
                    EMR Number
                  </p>

                  <input
                    name="hospitalNumber"
                    value={form.hospitalNumber}
                    onChange={handleChange}
                    className="rounded-full w-full py-1 pl-8 focus:outline-none uppercase"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />

                  <CiSearch
                    className="absolute left-2 font-extrabold"
                    size={20}
                  />
                </div>
                <button
                  className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2"
                  onClick={handleSearch}
                >
                  <GiSpyglass size={20} />{" "}
                  <span className="hidden md:inline-block">Search</span>
                </button>
              </div>
            )}

            {/* result of patient existence or not */}
            {patient && (
              <div className="px-2">
                {patient?.length > 0 ? (
                  <div className="flex flex-col text-sm">
                    <p className="font-bold">
                      Patient{" "}
                      <span className="uppercase">{form.hospitalNumber}</span>{" "}
                      already exists
                    </p>
                    <p className="font-bold">
                      Full Name:{" "}
                      <span className="font-normal">
                        {patient[0]?.fullname}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 w-full">
                      {/* edit records link */}
                      <Link
                        to={`/edit-patient-records/${form.hospitalNumber}`}
                        className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                        // onClick={() => handleViewRecord(hospitalNumber)}
                      >
                        <MdEditNote size={20} />{" "}
                        <span className="inline-block">
                          Review/Edit Encounters
                        </span>
                      </Link>

                      {/* add encounter link */}
                      <div
                        className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                        onClick={() => setOpenAddNewEncounter(true)}
                      >
                        <MdEditNote size={20} />{" "}
                        <span className="inline-block">Add New Encounter</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="flex items-center text-sm text-red-800 mb-3">
                      Patient with EMR Number{" "}
                      <span className="uppercase px-1">
                        {form.hospitalNumber}
                      </span>{" "}
                      not found!
                    </p>

                    <Link
                      to="/user-dashboard?tab=add-patient"
                      className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer"
                      /* onClick={() => setOpenAddPatientField(true)} */
                    >
                      <MdPersonAddAlt1 size={20} />{" "}
                      <span className="hidden md:inline-block">
                        Add Patient
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* if adding patient details */}
            {openAddNewEncounter && (
              <div className="px-2 w-full">
                {/* <h1 className="text-sm font-bold">Add New Patient</h1> */}

                {/* new patient details form */}
                <div className="mx-auto w-full space-y-6">
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="w-full md:mx-auto"
                  >
                    {/* <div>
                      <h1 className="text-3xl mt-2 font-bold text-gray-900">
                        Add New Patient Encounter
                      </h1>
                      <p className="mt-1 mb-2 text-sm text-gray-700">
                        Enter New Patient Encounter Details. All fields marked
                        with * are required.
                      </p>
                    </div> */}
                    <EncounterForm patientId={patient[0]?._id} />
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
