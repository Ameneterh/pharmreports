import { FaRegHospital } from "react-icons/fa";
import { FaBedPulse } from "react-icons/fa6";
import { useAuthStore } from "../../store/authStore";

export default function EditPatientRecord({ patient }) {
  const { user } = useAuthStore();

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

  return (
    <div className="">
      <form className="flex flex-col">
        <div className="flex flex-col md:flex-row items-center w-full gap-4">
          <div className="flex items-center relative w-full">
            <div className="w-full text-xs text-nowrap absolute -top-2 bg-white text-red-900 flex items-center gap-2">
              <p>Full Name</p> <p className="flex-1 h-[1px] bg-red-900"></p>
            </div>
            <input
              value={patient.fullname}
              disabled={!user.isAdmin}
              className={`rounded-md w-full py-2 bg-transparent border-none outline-none focus:outline-none text-sm ${
                !user.isAdmin ? "cursor-not-allowed" : ""
              }`}
              // onChange={(e) => setWard(e.target.value)}
            />
          </div>

          <div className="flex items-center relative w-full">
            <div className="w-full text-xs text-nowrap absolute -top-2 bg-white text-red-900 flex items-center gap-2">
              <p>Phone Number</p> <p className="flex-1 h-[1px] bg-red-900"></p>
            </div>
            <input
              value={patient.phone}
              disabled={!user.isAdmin}
              className={`rounded-md w-full py-2 bg-transparent border-none outline-none focus:outline-none text-sm ${
                !user.isAdmin ? "cursor-not-allowed" : ""
              }`}
              // onChange={(e) => setWard(e.target.value)}
            />
          </div>

          <div className="flex items-center w-full gap-2">
            <div className="flex items-center relative">
              <div className="w-full text-xs text-nowrap absolute -top-2 bg-white text-red-900 flex items-center gap-2">
                <p>Date of Birth (Y/M/D)</p>{" "}
                <p className="flex-1 h-[1px] bg-red-900"></p>
              </div>

              <input
                value={patient.dateOfBirth}
                disabled={!user.isAdmin}
                className={`rounded-md py-2 border-none outline-none focus:outline-none text-sm bg-transparent ${
                  !user.isAdmin ? "cursor-not-allowed" : ""
                }`}
                // onChange={(e) => setWard(e.target.value)}
              />

              <p className="text-sm text-nowrap absolute right-0">
                {calculateAge(patient.dateOfBirth)}
              </p>
            </div>
          </div>

          <div className="flex items-center w-full gap-2">
            <div className="flex items-center relative">
              <div className="w-full text-xs text-nowrap absolute -top-2 bg-white text-red-900 flex items-center gap-2">
                <p>Date Admitted (Y/M/D)</p>{" "}
                <p className="flex-1 h-[1px] bg-red-900"></p>
              </div>

              <input
                value={patient.dateOfBirth}
                disabled={!user.isAdmin}
                className={`rounded-md py-2 border-none outline-none focus:outline-none text-sm bg-transparent ${
                  !user.isAdmin ? "cursor-not-allowed" : ""
                }`}
                // onChange={(e) => setWard(e.target.value)}
              />

              <p className="text-sm text-nowrap absolute right-0">
                {calculateAge(patient.dateOfBirth)}
              </p>
            </div>
          </div>
        </div>
        <hr className="my-3" />
        <div className="flex flex-col md:flex-row items-center w-full gap-4">
          <div className="flex items-center relative w-full">
            <p className="text-xs absolute -top-2 left-1 bg-white px-1">Ward</p>
            <input
              value={patient.ward}
              disabled={!user.isAdmin}
              className={`rounded-md w-full py-1 pl-8 bg-transparent border-none outline-none focus:outline-none text-sm ${
                !user.isAdmin ? "cursor-not-allowed" : ""
              }`}
              // onChange={(e) => setWard(e.target.value)}
            />
          </div>

          <div className="flex items-center relative w-full">
            <p className="text-xs absolute -top-2 left-1 bg-white px-1">Bed</p>
            <input
              type="text"
              value={patient.bed}
              disabled={!user.isAdmin}
              className={`rounded-md w-full py-1 pl-8 bg-transparent border-none outline-none focus:outline-none text-sm ${
                !user.isAdmin ? "cursor-not-allowed" : ""
              }`}
              // onChange={(e) => setBed(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
