import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore.js";
import { CiSearch } from "react-icons/ci";
import { GiSpyglass } from "react-icons/gi";
import { BiSolidBinoculars } from "react-icons/bi";
import {
  MdNumbers,
  MdPersonAddAlt1,
  MdOutlineDateRange,
  MdOutlineSaveAs,
  MdEditNote,
} from "react-icons/md";
import { FaRegHospital, FaUserPlus, FaPhoneVolume } from "react-icons/fa";
import { FaBedPulse, FaUserDoctor } from "react-icons/fa6";
import { usePatientStore } from "../../store/patientStore.js";
import EditPatientRecord from "./EditPatientRecord.jsx";

export default function AddNewPatient() {
  const { user } = useAuthStore();
  const { addPatient, getAllPatients } = usePatientStore();

  const navigate = useNavigate();

  const [hospitalNumber, setHospitalNumber] = useState("");
  const [openAddPatientField, setOpenAddPatientField] = useState(false);
  const [viewRecord, setViewRecord] = useState(false);

  // patient details
  const [fullname, setFullname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [ward, setWard] = useState("");
  const [bed, setBed] = useState("");
  const [consultant, setConsultant] = useState("");
  const [dischargeStatus, setDischargeStatus] = useState("");

  const getToday = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState(getToday());

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

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

  // search function
  const handleSearch = () => {
    if (!hospitalNumber.trim().toLowerCase()) return;

    getPatient(hospitalNumber.trim().toLowerCase());
  };

  // save invoice
  const savePatient = async (e) => {
    e.preventDefault();

    try {
      await addPatient({
        hospitalNumber,
        fullname,
        phoneNumber,
        dateOfBirth,
        admissionDate,
        ward,
        bed,
        consultant,
        createdBy: user._id,
      });

      toast.success("New patient saved successfully");
      navigate("/user-dashboard?tab=view-patient");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  // handle view record
  const handleViewRecord = async () => {
    try {
      setViewRecord(true);
    } catch (error) {
      toast.error(error);
    }
  };

  console.log(patient);

  return (
    <div className="md:px-10 mt-6 w-full relative bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen max-w-7xl w-full mx-auto mt-2 mb-10 md:p-4 backdrop-filter backdrop-blur-lg rounded-xl"
      >
        <p className="text-xl font-extrabold mb-6 text-blue-950 text-center border-b-2 border-b-red-900 pb-2">
          Add/Update, View Patient Record
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 p-2">
            <div className="flex items-center relative w-full">
              <p className="text-xs absolute -top-3 left-3 bg-white px-2">
                EMR Number
              </p>

              <input
                value={hospitalNumber}
                className="rounded-full w-full py-1 pl-8 focus:outline-none uppercase"
                onChange={(e) => setHospitalNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <CiSearch className="absolute left-2 font-extrabold" size={20} />
            </div>
            <button
              className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2"
              onClick={handleSearch}
            >
              <GiSpyglass size={20} />{" "}
              <span className="hidden md:inline-block">Search</span>
            </button>
          </div>

          {/* result of patient existence or not */}
          {patient && (
            <div className="px-2">
              {patient?.length > 0 ? (
                <div className="flex flex-col text-sm">
                  <p className="font-bold">
                    Patient <span className="uppercase">{hospitalNumber}</span>{" "}
                    already exists
                  </p>
                  <p className="font-bold">
                    Full Name:{" "}
                    <span className="font-normal">{patient[0]?.fullname}</span>
                  </p>

                  <div className="flex items-center gap-2 w-full">
                    {/* edit records link */}
                    <Link
                      to={`/edit-patient-records/${hospitalNumber}`}
                      className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                      // onClick={() => handleViewRecord(hospitalNumber)}
                    >
                      <MdEditNote size={20} />{" "}
                      <span className="inline-block">Add Record</span>
                    </Link>

                    {/* view records link */}
                    <Link
                      to={`/view-patient-records/${hospitalNumber}`}
                      className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                      // onClick={() => handleViewRecord(hospitalNumber)}
                    >
                      <BiSolidBinoculars size={20} />{" "}
                      <span className="inline-block">View Record</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="flex items-center text-sm text-red-800 mb-3">
                    Patient with EMR Number{" "}
                    <span className="uppercase px-1">{hospitalNumber}</span> not
                    found!
                  </p>

                  <div
                    className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer"
                    onClick={() => setOpenAddPatientField(true)}
                  >
                    <MdPersonAddAlt1 size={20} />{" "}
                    <span className="hidden md:inline-block">Add Patient</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* if adding patient details */}
          {openAddPatientField && (
            <div className="px-2">
              <h1 className="text-sm font-bold">Add New Patient</h1>

              {/* new patient details form */}
              <form onSubmit={savePatient} className="flex flex-col mt-6 gap-4">
                {/* first line */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                  {/* hospital number */}
                  <div className="flex items-center relative w-full">
                    <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                      Hospital Number
                    </p>
                    <input
                      value={hospitalNumber}
                      className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm uppercase"
                      onChange={(e) => setHospitalNumber(e.target.value)}
                    />
                    <MdNumbers
                      className="absolute left-2 font-extrabold"
                      size={20}
                    />
                  </div>

                  {/* patient full name */}
                  <div className="flex items-center relative w-full">
                    <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                      Full Name
                    </p>
                    <input
                      value={fullname}
                      className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                      onChange={(e) => setFullname(e.target.value)}
                    />
                    <FaUserPlus
                      className="absolute left-2 font-extrabold"
                      size={20}
                    />
                  </div>

                  <div className="flex items-center w-full gap-2">
                    {/* date of birth */}
                    <div className="flex items-center relative w-full">
                      <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                        Date of Birth
                      </p>
                      <input
                        value={dateOfBirth}
                        type="date"
                        className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                      <MdOutlineDateRange
                        className="absolute left-2 font-extrabold"
                        size={20}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center relative w-full">
                      <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                        Phone Number
                      </p>
                      <input
                        value={phoneNumber}
                        type="text"
                        className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <FaPhoneVolume
                        className="absolute left-2 font-extrabold"
                        size={20}
                      />
                    </div>
                  </div>
                </div>

                {/* second line */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                  {/* hospital number */}
                  <div className="flex items-center relative w-full">
                    <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                      Managing Consultant
                    </p>
                    <input
                      value={consultant}
                      className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                      onChange={(e) => setConsultant(e.target.value)}
                    />
                    <FaUserDoctor
                      className="absolute left-2 font-extrabold"
                      size={20}
                    />
                  </div>

                  {/* patient full name */}
                  <div className="flex items-center relative w-full">
                    <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                      Admission Date
                    </p>
                    <input
                      value={admissionDate}
                      type="date"
                      className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                      onChange={(e) => setAdmissionDate(e.target.value)}
                    />
                    <MdOutlineDateRange
                      className="absolute left-2 font-extrabold"
                      size={20}
                    />
                  </div>

                  {/* ward and bed */}
                  <div className="flex items-center w-full gap-2">
                    <div className="flex items-center relative w-full">
                      <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                        Ward
                      </p>
                      <input
                        value={ward}
                        className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                        onChange={(e) => setWard(e.target.value)}
                      />
                      <FaRegHospital
                        className="absolute left-2 font-extrabold"
                        size={20}
                      />
                    </div>

                    <div className="flex items-center relative w-full">
                      <p className="text-xs absolute -top-2 left-1 bg-white px-1">
                        Bed
                      </p>
                      <input
                        type="text"
                        value={bed}
                        className="rounded-md w-full py-2 pl-8 focus:outline-none text-sm"
                        onChange={(e) => setBed(e.target.value)}
                      />
                      <FaBedPulse
                        className="absolute left-2 font-extrabold"
                        size={20}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit"
                  type="submit"
                >
                  <MdOutlineSaveAs size={20} />{" "}
                  <span className="hidden md:inline-block">Save Patient</span>
                </button>
              </form>
            </div>
          )}

          {/* {viewRecord && <EditPatientRecord patient={patient[0]} />} */}
        </div>
      </motion.div>
    </div>
  );
}
