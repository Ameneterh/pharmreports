import { useState } from "react";
import { motion } from "framer-motion";
import { usePatientStore } from "../../store/patientStore";
import { CiSearch } from "react-icons/ci";
import { GiSpyglass } from "react-icons/gi";
import { MdArrowForwardIos, MdEditNote, MdPersonAddAlt1 } from "react-icons/md";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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

export default function AddNewPatient() {
  const getToday = () => {
    const today = new Date();
    return today.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  const navigate = useNavigate();
  const [hospitalNumber, setHospitalNumber] = useState("");
  const [openAddPatientField, setOpenAddPatientField] = useState(false);
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

  // Update nested objects such as emergencyContact.
  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Update socialHistory.smoking.status, for example.
  const updateSocial = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      socialHistory: {
        ...prev.socialHistory,
        [section]: {
          ...prev.socialHistory[section],
          [field]: value,
        },
      },
    }));
  };

  // Update an item in an array of nested objects.
  const updateArrayItem = (arrayName, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addArrayItem = (arrayName, item) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], item],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // clearPatientMessages();
    setValidationError("");

    // Client-side checks for the required fields.
    if (
      !form.hospitalNumber.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.dateOfBirth ||
      !form.sex
    ) {
      toast.error("Please complete all required fields.");
      setValidationError("Please complete all required fields.");
      return;
    }

    if (form.dateOfBirth > new Date().toISOString().slice(0, 10)) {
      toast.error("Date of birth cannot be in the future.");
      setValidationError("Date of birth cannot be in the future.");
      return;
    }

    // Remove incomplete optional array entries.
    // Keep only meaningful entries before submission.
    const allergies = form.allergies
      .filter((item) => item.allergen.trim())
      .map((item) => ({
        ...item,
        allergen: item.allergen.trim(),
      }));

    const medicalHistory = form.medicalHistory.filter((item) =>
      item.condition.trim(),
    );

    const familyHistory = form.familyHistory.filter(
      (item) =>
        item.condition.trim() || item.relationship.trim() || item.notes.trim(),
    );

    const herbalMedicineHistory = form.herbalMedicineHistory.filter((item) =>
      item.productName.trim(),
    );

    const fullname = [form.firstName, form.middleName, form.lastName]
      .map((name) => name.trim())
      .filter(Boolean)
      .join(" ");

    const payload = {
      ...form,
      hospitalNumber: form.hospitalNumber.trim(),
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
      fullname,
      dateOfBirth: form.dateOfBirth,
      phone: form.phone.trim(),
      allergies,
      medicalHistory,
      familyHistory,
      herbalMedicineHistory,
    };

    const result = await addPatient(payload);

    if (result.success) {
      toast.success("Patient added successfully.");
      setForm({
        ...initialForm,
        emergencyContact: {
          ...initialForm.emergencyContact,
        },
        socialHistory: {
          ...initialForm.socialHistory,
          smoking: { ...initialForm.socialHistory.smoking },
          alcohol: { ...initialForm.socialHistory.alcohol },
        },
      });
      navigate("/user-dashboard?tab=add-encounter");
    }
  };

  // search function
  // const handleSearch = () => {
  //   if (!hospitalNumber.trim().toLowerCase()) return;

  //   getPatient(hospitalNumber.trim().toLowerCase());
  // };

  // const getPatients = async ({ startDate, endDate }) => {
  //   try {
  //     const patients = await getAllPatients({ startDate, endDate });

  //     setPatients(patients);
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };

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
        className="min-h-screen max-w-7xl w-full mx-auto mt-2 mb-10 md:p-4 backdrop-filter backdrop-blur-lg rounded-xl"
      >
        <p className="flex items-center text-sm mb-6 text-blue-950 border-b-2 border-b-red-900 pb-2">
          Pharmaceutical Care Plan{" "}
          <MdArrowForwardIos size={12} className="mx-1" />{" "}
          <span className="font-bold">Add New Patient</span>
        </p>

        <div className="flex flex-col gap-6">
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
                  // value={hospitalNumber}
                  className="rounded-full w-full py-1 pl-8 focus:outline-none uppercase"
                  // onChange={(e) => setHospitalNumber(e.target.value)}
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
                    <span className="font-normal">{patient[0]?.fullname}</span>
                  </p>

                  <div className="flex items-center gap-2 w-full">
                    {/* edit records link */}
                    <Link
                      to={`/edit-patient-records/${form.hospitalNumber}`}
                      className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                      // onClick={() => handleViewRecord(hospitalNumber)}
                    >
                      <MdEditNote size={20} />{" "}
                      <span className="inline-block">Review Encounters</span>
                    </Link>

                    {/* add encounter link */}
                    <Link
                      to={`/edit-patient-records/${form.hospitalNumber}`}
                      className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                      // onClick={() => handleViewRecord(hospitalNumber)}
                    >
                      <MdEditNote size={20} />{" "}
                      <span className="inline-block">Add Encounter</span>
                    </Link>

                    {/* view records link */}
                    {/* <Link
                      to={`/view-patient-records/${hospitalNumber}`}
                      className="bg-blue-700 py-[6px] px-4 text-white rounded text-sm font-light hover:scale-105 transition-all duration-500 flex items-center gap-2 max-w-fit cursor-pointer mt-4"
                      // onClick={() => handleViewRecord(hospitalNumber)}
                    >
                      <BiSolidBinoculars size={20} />{" "}
                      <span className="inline-block">View Record</span>
                    </Link> */}
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
              {/* <h1 className="text-sm font-bold">Add New Patient</h1> */}

              {/* new patient details form */}
              <div className="mx-auto w-full space-y-6">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="w-full md:mx-auto"
                >
                  <div>
                    <h1 className="text-3xl mt-2 font-bold text-gray-900">
                      Register Patient
                    </h1>
                    <p className="mt-1 mb-2 text-sm text-gray-700">
                      Enter patient demographics and baseline pharmaceutical
                      care history.
                    </p>
                  </div>

                  {/* {validationError && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                      {validationError}
                    </div>
                  )} */}

                  {/* {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )} */}

                  {/* {message && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                      {message}
                    </div>
                  )} */}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* DEMOGRAPHICS */}
                    <Section title="Patient Demographics">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Field label="Hospital Number *">
                          <input
                            className={inputClass}
                            name="hospitalNumber"
                            value={form.hospitalNumber}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            autoComplete="off"
                          />
                        </Field>

                        <Field label="First Name *">
                          <input
                            className={inputClass}
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                          />
                        </Field>

                        <Field label="Middle Name">
                          <input
                            className={inputClass}
                            name="middleName"
                            value={form.middleName}
                            onChange={handleChange}
                          />
                        </Field>

                        <Field label="Last Name *">
                          <input
                            className={inputClass}
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                          />
                        </Field>

                        <Field label="Date of Birth *">
                          <input
                            className={inputClass}
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().slice(0, 10)}
                            required
                          />
                        </Field>

                        <Field label="Sex *">
                          <select
                            className={inputClass}
                            name="sex"
                            value={form.sex}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </Field>

                        <Field label="Phone Number">
                          <input
                            className={inputClass}
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+234..."
                          />
                        </Field>
                      </div>

                      <p className="text-xs text-gray-500">
                        Fields marked * are required. Full name is generated
                        automatically.
                      </p>
                    </Section>

                    {/* EMERGENCY CONTACT */}
                    <Section title="Emergency Contact">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Contact Name">
                          <input
                            className={inputClass}
                            value={form.emergencyContact.name}
                            onChange={(e) =>
                              updateNested(
                                "emergencyContact",
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </Field>

                        <Field label="Relationship">
                          <input
                            className={inputClass}
                            value={form.emergencyContact.relationship}
                            onChange={(e) =>
                              updateNested(
                                "emergencyContact",
                                "relationship",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. spouse, parent"
                          />
                        </Field>

                        <Field label="Contact Phone">
                          <input
                            className={inputClass}
                            type="tel"
                            value={form.emergencyContact.phone}
                            onChange={(e) =>
                              updateNested(
                                "emergencyContact",
                                "phone",
                                e.target.value,
                              )
                            }
                          />
                        </Field>

                        <Field label="Contact Address">
                          <input
                            className={inputClass}
                            value={form.emergencyContact.address}
                            onChange={(e) =>
                              updateNested(
                                "emergencyContact",
                                "address",
                                e.target.value,
                              )
                            }
                          />
                        </Field>
                      </div>
                    </Section>

                    {/* ALLERGIES */}
                    <Section title="Drug and Other Allergies">
                      {form.allergies.map((item, index) => (
                        <div
                          key={index}
                          className="space-y-3 rounded-md border p-4"
                        >
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Field label="Allergen">
                              <input
                                className={inputClass}
                                value={item.allergen}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "allergies",
                                    index,
                                    "allergen",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. penicillin"
                              />
                            </Field>

                            <Field label="Reaction">
                              <input
                                className={inputClass}
                                value={item.reaction}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "allergies",
                                    index,
                                    "reaction",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. rash, swelling"
                              />
                            </Field>

                            <Field label="Severity">
                              <select
                                className={inputClass}
                                value={item.severity}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "allergies",
                                    index,
                                    "severity",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">Select severity</option>
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                                <option value="unknown">Unknown</option>
                              </select>
                            </Field>

                            <Field label="Status">
                              <select
                                className={inputClass}
                                value={item.status}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "allergies",
                                    index,
                                    "status",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="active">Active</option>
                                <option value="resolved">Resolved</option>
                                <option value="uncertain">Uncertain</option>
                              </select>
                            </Field>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeArrayItem("allergies", index)}
                            className="text-sm text-red-600"
                          >
                            Remove allergy
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("allergies", {
                            allergen: "",
                            reaction: "",
                            severity: "unknown",
                            status: "active",
                          })
                        }
                        className="rounded-md border px-4 py-2 text-sm"
                      >
                        + Add Allergy
                      </button>
                    </Section>

                    {/* MEDICAL HISTORY */}
                    <Section title="Medical History">
                      {form.medicalHistory.map((item, index) => (
                        <div
                          key={index}
                          className="space-y-3 rounded-md border p-4"
                        >
                          <Field label="Condition / Diagnosis">
                            <input
                              className={inputClass}
                              value={item.condition}
                              onChange={(e) =>
                                updateArrayItem(
                                  "medicalHistory",
                                  index,
                                  "condition",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. hypertension"
                            />
                          </Field>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Field label="Diagnosis Date">
                              <input
                                className={inputClass}
                                type="date"
                                value={item.diagnosisDate}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "medicalHistory",
                                    index,
                                    "diagnosisDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>

                            <Field label="Status">
                              <select
                                className={inputClass}
                                value={item.status}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "medicalHistory",
                                    index,
                                    "status",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="unknown">Unknown</option>
                                <option value="active">Active</option>
                                <option value="resolved">Resolved</option>
                              </select>
                            </Field>
                          </div>

                          <Field label="Notes">
                            <textarea
                              className={inputClass}
                              value={item.notes}
                              onChange={(e) =>
                                updateArrayItem(
                                  "medicalHistory",
                                  index,
                                  "notes",
                                  e.target.value,
                                )
                              }
                            />
                          </Field>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("medicalHistory", index)
                            }
                            className="text-sm text-red-600"
                          >
                            Remove condition
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("medicalHistory", {
                            condition: "",
                            diagnosisDate: "",
                            status: "unknown",
                            notes: "",
                          })
                        }
                        className="rounded-md border px-4 py-2 text-sm"
                      >
                        + Add Medical Condition
                      </button>
                    </Section>

                    {/* FAMILY HISTORY */}
                    <Section title="Family History">
                      {form.familyHistory.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-md border p-4 md:grid-cols-3"
                        >
                          <Field label="Condition">
                            <input
                              className={inputClass}
                              value={item.condition}
                              onChange={(e) =>
                                updateArrayItem(
                                  "familyHistory",
                                  index,
                                  "condition",
                                  e.target.value,
                                )
                              }
                            />
                          </Field>

                          <Field label="Family Relationship">
                            <input
                              className={inputClass}
                              value={item.relationship}
                              onChange={(e) =>
                                updateArrayItem(
                                  "familyHistory",
                                  index,
                                  "relationship",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. father"
                            />
                          </Field>

                          <Field label="Notes">
                            <input
                              className={inputClass}
                              value={item.notes}
                              onChange={(e) =>
                                updateArrayItem(
                                  "familyHistory",
                                  index,
                                  "notes",
                                  e.target.value,
                                )
                              }
                            />
                          </Field>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("familyHistory", index)
                            }
                            className="text-left text-sm text-red-600"
                          >
                            Remove entry
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("familyHistory", {
                            condition: "",
                            relationship: "",
                            notes: "",
                          })
                        }
                        className="rounded-md border px-4 py-2 text-sm"
                      >
                        + Add Family History
                      </button>
                    </Section>

                    {/* SOCIAL HISTORY */}
                    <Section title="Social History">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Smoking Status">
                          <select
                            className={inputClass}
                            value={form.socialHistory.smoking.status}
                            onChange={(e) =>
                              updateSocial("smoking", "status", e.target.value)
                            }
                          >
                            <option value="unknown">Unknown</option>
                            <option value="never">Never</option>
                            <option value="current">Current</option>
                            <option value="former">Former</option>
                          </select>
                        </Field>

                        <Field label="Smoking Quantity">
                          <input
                            className={inputClass}
                            value={form.socialHistory.smoking.quantity}
                            onChange={(e) =>
                              updateSocial(
                                "smoking",
                                "quantity",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 5 cigarettes/day"
                          />
                        </Field>

                        <Field label="Alcohol Use">
                          <select
                            className={inputClass}
                            value={form.socialHistory.alcohol.status}
                            onChange={(e) =>
                              updateSocial("alcohol", "status", e.target.value)
                            }
                          >
                            <option value="unknown">Unknown</option>
                            <option value="none">None</option>
                            <option value="occasional">Occasional</option>
                            <option value="regular">Regular</option>
                          </select>
                        </Field>

                        <Field label="Alcohol Quantity">
                          <input
                            className={inputClass}
                            value={form.socialHistory.alcohol.quantity}
                            onChange={(e) =>
                              updateSocial(
                                "alcohol",
                                "quantity",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 6 Hero beer bottles/day"
                          />
                        </Field>

                        <Field label="Occupation / Exposure">
                          <input
                            className={inputClass}
                            value={form.socialHistory.occupationExposure}
                            onChange={(e) =>
                              updateNested(
                                "socialHistory",
                                "occupationExposure",
                                e.target.value,
                              )
                            }
                          />
                        </Field>

                        <Field label="Living Arrangement">
                          <input
                            className={inputClass}
                            value={form.socialHistory.livingArrangement}
                            onChange={(e) =>
                              updateNested(
                                "socialHistory",
                                "livingArrangement",
                                e.target.value,
                              )
                            }
                          />
                        </Field>
                      </div>

                      <Field label="Additional Social History Notes">
                        <textarea
                          className={inputClass}
                          value={form.socialHistory.notes}
                          onChange={(e) =>
                            updateNested(
                              "socialHistory",
                              "notes",
                              e.target.value,
                            )
                          }
                        />
                      </Field>
                    </Section>

                    {/* HERBAL MEDICINES */}
                    <Section title="Herbal Medicine History">
                      {form.herbalMedicineHistory.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-3 rounded-md border p-4 md:grid-cols-2"
                        >
                          <Field label="Product Name">
                            <input
                              className={inputClass}
                              value={item.productName}
                              onChange={(e) =>
                                updateArrayItem(
                                  "herbalMedicineHistory",
                                  index,
                                  "productName",
                                  e.target.value,
                                )
                              }
                            />
                          </Field>

                          <Field label="Purpose">
                            <input
                              className={inputClass}
                              value={item.purpose}
                              onChange={(e) =>
                                updateArrayItem(
                                  "herbalMedicineHistory",
                                  index,
                                  "purpose",
                                  e.target.value,
                                )
                              }
                            />
                          </Field>

                          <Field label="Frequency">
                            <input
                              className={inputClass}
                              value={item.frequency}
                              onChange={(e) =>
                                updateArrayItem(
                                  "herbalMedicineHistory",
                                  index,
                                  "frequency",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. twice daily"
                            />
                          </Field>

                          <Field label="Current Use">
                            <select
                              className={inputClass}
                              value={
                                item.currentUse === true
                                  ? "true"
                                  : item.currentUse === false
                                    ? "false"
                                    : ""
                              }
                              onChange={(e) =>
                                updateArrayItem(
                                  "herbalMedicineHistory",
                                  index,
                                  "currentUse",
                                  e.target.value === ""
                                    ? null
                                    : e.target.value === "true",
                                )
                              }
                            >
                              <option value="">Unknown</option>
                              <option value="true">Currently using</option>
                              <option value="false">Not currently using</option>
                            </select>
                          </Field>

                          <div className="md:col-span-2">
                            <Field label="Notes">
                              <textarea
                                className={inputClass}
                                value={item.notes}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "herbalMedicineHistory",
                                    index,
                                    "notes",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("herbalMedicineHistory", index)
                            }
                            className="text-left text-sm text-red-600"
                          >
                            Remove product
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("herbalMedicineHistory", {
                            productName: "",
                            purpose: "",
                            frequency: "",
                            currentUse: null,
                            notes: "",
                          })
                        }
                        className="rounded-md border px-4 py-2 text-sm"
                      >
                        + Add Herbal Medicine
                      </button>
                    </Section>

                    {/* SUBMIT */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? "Saving Patient..." : "Save Patient"}
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          setForm({
                            ...initialForm,
                            emergencyContact: {
                              ...initialForm.emergencyContact,
                            },
                            socialHistory: {
                              ...initialForm.socialHistory,
                              smoking: {
                                ...initialForm.socialHistory.smoking,
                              },
                              alcohol: {
                                ...initialForm.socialHistory.alcohol,
                              },
                            },
                          });
                          clearPatientMessages();
                          setValidationError("");
                        }}
                        className="rounded-md border px-6 py-3 font-medium"
                      >
                        Clear Form
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          )}

          {/* {viewRecord && <EditPatientRecord patient={patient[0]} />} */}
        </div>
      </motion.div>
    </div>
  );
}
