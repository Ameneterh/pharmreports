import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js";
import PharmaCareLinks from "../components/PharmaCareComponents/PharmaCareLinks.jsx";
import { TiUserAdd } from "react-icons/ti";
import { FaUserEdit } from "react-icons/fa";
import { GrOverview } from "react-icons/gr";

export default function PharmaCarePage() {
  const { user } = useAuthStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  // save invoice
  const savePatient = async () => {
    try {
      //   await sendReport({
      //     workStation: formData.workStation,
      //     dutyType: formData.dutyType,
      //     timeOfDuty: formData.timeOfDuty,
      //     reportStartDate: formData.reportStartDate,
      //     reportEndDate: formData.reportEndDate,
      //     dutyDateTime: formData.dutyDateTime,
      //     dutiesDone: formData.dutiesDone,
      //     challenges: formData.challenges,
      //     observations: formData.observations,
      //     interventions: formData.interventions,
      //     outOfStock: formData.outOfStock,
      //     remarks: formData.remarks,
      //     reporter: user._id,
      //   });

      toast.success("New patient saved successfully");
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
    <div className="md:px-10 mt-6 w-full relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen max-w-7xl w-full mx-auto mt-2 mb-10 p-4 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl"
      >
        <p className="text-xl font-extrabold mb-6 text-blue-950 text-center border-b-2 border-b-red-900 pb-2">
          Pharmaceutical Care Plan
        </p>
        <div className="flex flex-wrap gap-6">
          <PharmaCareLinks
            linkUrl="/user-dashboard?tab=add-patient"
            title="Add/Update Patient"
            icon={TiUserAdd}
          />
          {/* <PharmaCareLinks
            linkUrl="/user-dashboard?tab=update-record"
            title="Update Record"
            icon={FaUserEdit}
          /> */}
          <PharmaCareLinks
            linkUrl="/user-dashboard?tab=add-patient"
            title="View Record"
            icon={GrOverview}
          />
        </div>
      </motion.div>
    </div>
  );
}
