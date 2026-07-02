import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import InvoiceHeader from "../components/InvoiceHeader.jsx";
import CompanyDetails from "../components/ReporterDetails.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "../layout/MainLayout.jsx";
import { useAuthStore } from "../store/authStore.js";
import OrderedTextarea, {
  Input,
  InvInput,
  PhoneField,
} from "../components/Input.jsx";
import { Button } from "flowbite-react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaCloudDownloadAlt } from "react-icons/fa";
import {
  CalendarDays,
  FileDigit,
  FolderPen,
  Mail,
  MapPinCheck,
  PhoneCall,
} from "lucide-react";
import { MdAddBusiness, MdLockReset } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { TbReport } from "react-icons/tb";
import { FaSave } from "react-icons/fa";
import { workStations, dutyType, dutyTime } from "../assets/static_assets.js";
import ReporterDetails from "../components/ReporterDetails.jsx";
import { useReportsStore } from "../store/reportsStore.js";

export default function SendReport() {
  const { user } = useAuthStore();
  const { sendReport } = useReportsStore();
  // const { createInvoice, getAllInvoices } = useInvoiceStore();

  const navigate = useNavigate();

  const contentRef = useRef();
  const handlePrint = useReactToPrint({ contentRef });

  const [isChecked, setIsChecked] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const [formData, setFormData] = useState({});

  const [client_name, setName] = useState("");
  const [client_address, setAddress] = useState("");
  const [client_phone, setPhone] = useState("");
  const [client_email, setEmail] = useState("");
  // const [invoiceNumber, setInvNumber] = useState("");
  // const [invDate, setInvDate] = useState(Date.now());
  const [invoiceType, setInvoiceType] = useState("");
  const [validity, setValidity] = useState("");

  //   invoice table states
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");

  //   populate list
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  //   get clients and one client
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const { registerClient, getAllClients, getOneClient } = useClientStore();

  const getRegisteredClients = async () => {
    try {
      const { clients } = await getAllClients();
      const filteredClients = clients.filter(
        (client) => user?.business._id === client?.staff?.business._id,
      );
      setClients(filteredClients);
    } catch (error) {
      console.log(error);
    }
  };

  // const getInvoices = async () => {
  //   try {
  //     const { invoices } = await getAllInvoices();
  //     // const filteredInvoices = invoices.filter(
  //     //   (invoice) => user.business._id === invoice.company._id,
  //     // );
  //     setInvoices(invoices);
  //     // setInvNumber((invoices.length + 1).toString().padStart(6, "0"));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getInvoices = async () => {
  //   try {
  //     const { invoices } = await getAllInvoices();
  //     const filteredInvoices = invoices.filter(
  //       (invoice) => user.affiliation._id === invoice.company._id
  //     );
  //     setInvoices(filteredInvoices);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (user?.fullname === undefined) {
      navigate("/add-handler");
    }
    getRegisteredClients();
    // getInvoices();
  }, []);

  const getClient = async (clientId) => {
    try {
      const { client } = await getOneClient(clientId);
      setClient(client);
      setName(client.client_name);
      setEmail(client.client_email);
      setPhone(client.client_phone);
      setAddress(client.client_address);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    const staff = user._id;
    try {
      await registerClient(
        client_name,
        client_email,
        client_phone,
        client_address,
        staff,
      );
      getRegisteredClients();
      setIsChecked(false);
    } catch (error) {
      console.log(error);
    }
  };

  // reset client details
  const resetClient = () => {
    window.location.reload();
    setClient(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    // setIsChecked(true);
  };

  // save invoice
  const saveReport = async () => {
    try {
      await sendReport({
        workStation: formData.workStation,
        dutyType: formData.dutyType,
        timeOfDuty: formData.timeOfDuty,
        dutyDateTime: formData.dutyDateTime,
        dutiesDone: formData.dutiesDone,
        challenges: formData.challenges,
        observations: formData.observations,
        interventions: formData.interventions,
        outOfStock: formData.outOfStock,
        remarks: formData.remarks,
        reporter: user._id,
      });

      toast.success("Report submitted successfully");
      navigate("/user-dashboard?tab=reports");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="md:px-10 mt-6 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen max-w-7xl w-full mx-auto mt-2 mb-10 p-4 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl bg-white"
      >
        <p className="text-xl font-extrabold mb-6 text-blue-950 text-center border-b-2 border-b-red-900 pb-2">
          Send Daily Report
        </p>
        {/* content of invoice to print */}
        {showInvoice ? (
          <>
            <div ref={contentRef} className="w-full px-20 py-10 relative">
              <p className="text-xl font-bold text-center mb-5">
                Report's Preview:
              </p>
              <ReporterDetails user={user} formData={formData} />

              <div className="flex flex-col gap-2 border-t border-t-gray-900 mt-2 py-2 w-full">
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Work Done:</p>
                  <p className="whitespace-pre-line text-sm">
                    {formData.dutiesDone}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Challenges:</p>
                  <p className="whitespace-pre-line text-sm">
                    {formData.challenges}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Observations:</p>
                  <p className="whitespace-pre-line text-sm">
                    {formData.observations}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Interventions:</p>
                  <p className="whitespace-pre-line text-sm">
                    {formData.interventions}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Out of Stock:</p>
                  <p className="whitespace-pre-line text-sm">
                    {formData.outOfStock}
                  </p>
                </div>
                <div className="flex flex-col w-full mb-2">
                  <p className="font-bold">Remarks:</p>
                  <p className="whitespace-pre-line text-sm">
                    {formData.remarks}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-y-3 gap-x-3 items-center justify-center border-t border-gray-500 py-4 mt-4">
              <button
                onClick={() => setShowInvoice(false)}
                className="hover:bg-blue-600 text-blue-600 font-bold py-2 px-8 rounded shadow border-2 border-blue-600 bg-white hover:text-white transition-all duration-300"
              >
                Edit Report
              </button>

              <Button
                className="bg-blue-600 text-white hover:bg-opacity-70 px-8 py-1 rounded flex items-center gap-2"
                onClick={saveReport}
              >
                <FaCloudDownloadAlt className="text-xl mr-2" />
                Send Report
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center gap-y-5">
              {/* duty details */}
              <article className="flex flex-col px-2 border border-blue-700 rounded relative">
                <h1 className="text-sm font-bold absolute -top-3 px-1 bg-white text-blue-700">
                  Duty Details:
                </h1>

                <div className="flex flex-col gap-3 mt-6 w-full">
                  <div className="flex flex-col sm:flex-row gap-3 items-center mb-1 w-full">
                    {/* choose duty station */}
                    <div className="flex flex-col sm:flex-row gap-3 relative w-full">
                      <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                        <span className="text-red-600 font-bold">*</span>Duty
                        Station:
                      </p>
                      <select
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workStation: e.target.value,
                          })
                        }
                        className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                      >
                        <option>Select Duty Station</option>
                        {workStations &&
                          workStations.map((workStation) => {
                            return (
                              <option
                                key={workStation.id}
                                value={workStation?.name}
                              >
                                {workStation?.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>

                    {/* choose duty type */}
                    <div className="flex flex-col sm:flex-row gap-3 relative w-full">
                      <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                        <span className="text-red-600 font-bold">*</span>Duty
                        Type:
                      </p>
                      <select
                        onChange={(e) =>
                          setFormData({ ...formData, dutyType: e.target.value })
                        }
                        className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                      >
                        <option>Select Duty Type</option>
                        {dutyType &&
                          dutyType.map((duty) => {
                            return (
                              <option key={duty.id} value={duty?.name}>
                                {duty?.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center w-full mb-3">
                    {/* choose duty time */}
                    <div className="flex flex-col sm:flex-row gap-3 relative w-full">
                      <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                        <span className="text-red-600 font-bold">*</span>Time of
                        Duty:
                      </p>
                      <select
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeOfDuty: e.target.value,
                          })
                        }
                        className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                      >
                        <option>Select Duty Time</option>
                        {dutyTime &&
                          dutyTime.map((dutytime) => {
                            return (
                              <option key={dutytime.id} value={dutytime?.name}>
                                {dutytime?.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>

                    {/* choose duty time & date */}
                    <div className="flex flex-col sm:flex-row gap-3 relative w-full">
                      <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                        <span className="text-red-600 font-bold">*</span>Duty
                        Date/Time:
                      </p>
                      <input
                        type="datetime-local"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dutyDateTime: e.target.value,
                          })
                        }
                        className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* report details */}
              <article className="flex flex-col px-2 border border-blue-700 rounded relative pb-3">
                <h1 className="text-sm font-bold absolute -top-3 px-1 bg-white text-blue-700">
                  Report Details:
                </h1>

                <div className="flex flex-col gap-3 mt-6 w-full">
                  {/* duties carried out */}
                  <div className="flex flex-col sm:flex-row gap-3 relative w-full">
                    <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                      <span className="text-red-600 font-bold">*</span>Duties
                      Carried Out:
                    </p>
                    <textarea
                      value={formData.dutiesDone}
                      onChange={(e) =>
                        setFormData({ ...formData, dutiesDone: e.target.value })
                      }
                      rows={10}
                      placeholder="Enter description..."
                      className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                    />
                  </div>

                  {/* challenges encountered */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-1 relative w-full">
                    <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                      <span className="text-red-600 font-bold">*</span>
                      Challenges Encountered:
                    </p>
                    <textarea
                      value={formData.challenges}
                      onChange={(e) =>
                        setFormData({ ...formData, challenges: e.target.value })
                      }
                      rows={10}
                      placeholder="Challenges ..."
                      className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                    />
                  </div>

                  {/* observations */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-1 relative w-full">
                    <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                      <span className="text-red-600 font-bold">*</span>
                      Observations:
                    </p>
                    <textarea
                      value={formData.observations}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          observations: e.target.value,
                        })
                      }
                      rows={10}
                      placeholder="Observations ..."
                      className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                    />
                  </div>

                  {/* Clinical Interventions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-1 relative w-full">
                    <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                      <span className="text-red-600 font-bold">*</span>
                      Interventions:
                    </p>
                    <textarea
                      value={formData.interventions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interventions: e.target.value,
                        })
                      }
                      rows={10}
                      placeholder="Interventions ..."
                      className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                    />
                  </div>

                  {/* out of stock report */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-1 relative w-full">
                    <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                      <span className="text-red-600 font-bold">*</span>
                      Out of Stock (if any):
                    </p>
                    <textarea
                      value={formData.outOfStock}
                      onChange={(e) =>
                        setFormData({ ...formData, outOfStock: e.target.value })
                      }
                      rows={10}
                      placeholder="Out of Stock ..."
                      className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                    />
                  </div>

                  {/* remarks */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-1 relative w-full">
                    <p className="text-xs bg-white font-semibold absolute -top-2 left-2 px-1 flex items-center gap-[2px]">
                      Remarks (if any):
                    </p>
                    {/* <OrderedTextarea
                      value={formData.remarks}
                      formData={formData}
                      setFormData={setFormData}
                      fieldName="remarks"
                    /> */}
                    <textarea
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                      rows={10}
                      placeholder="Remarks ..."
                      className="w-full sm:w-1/4 pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
                    />
                  </div>
                </div>
              </article>

              {/* preview button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-x-4 gap-y-3">
                <motion.button
                  className="py-2 px-6 bg-gradient-to-r from-slate-600 to-blue-800 rounded-lg hover:border-white hover:from-blue-800 hover:to-slate-600 border focus:outline-none transition duration-200 cursor-pointer flex items-center justify-center text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInvoice(true)}
                >
                  <VscPreview className="mr-2" size={18} />
                  Preview Report
                </motion.button>

                {/* <motion.button
                  className="py-2 px-6 bg-gradient-to-r from-slate-600 to-green-800 rounded-lg hover:border-white hover:from-green-800 hover:to-slate-600 border focus:outline-none transition duration-200 cursor-pointer flex items-center justify-center text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInvoice(true)}
                >
                  <TbReport className="mr-2" size={18} />
                  Send Report
                </motion.button> */}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
