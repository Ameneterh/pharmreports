import React from "react";
import { MdAddCall, MdEmail, MdLocationCity } from "react-icons/md";
import Divider from "./Divider";

export default function ReporterDetails({ user, formData }) {
  return (
    <section className="flex flex-col">
      <p className="flex items-center gap-1">
        Reporter:{" "}
        <span className="font-semibold flex items-center gap-1">
          <span className="font-semibold">
            {user?.role === "admin"
              ? "Pharm Mrs"
              : user?.role === "pharmacist"
                ? "Pharm"
                : "Pharm Tech"}
          </span>{" "}
          <span className="flex items-center capitalize">{user?.fullname}</span>
        </span>
      </p>
      <p className="flex items-center gap-1">
        Work Station:{" "}
        <span className="font-semibold">{formData?.workStation}</span>
      </p>
      <p className="flex items-center gap-1">
        Duty Type: <span className="font-semibold">{formData?.dutyType}</span>
      </p>
      <p className="flex items-center gap-1">
        Time of Duty:{" "}
        <span className="font-semibold">{formData?.timeOfDuty}</span>
        <span>
          {formData?.timeOfDuty === "Night" ? "8pm - 8am" : "8am - 5pm"}
        </span>
      </p>
      <p className="flex items-center gap-1">
        Date & Time of Report:{" "}
        <span className="font-semibold">
          {formData?.dutyDateTime
            ? new Date(formData?.dutyDateTime).toLocaleString("en-US", {
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
    </section>
  );
}
