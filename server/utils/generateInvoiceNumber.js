// utils/generateInvoiceNumber.js

import Counter from "../models/counter.model.js";

export const generateInvoiceNumber = async (businessId, businessName) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const prefix = businessName
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join("");

  const counter = await Counter.findOneAndUpdate(
    {
      business: businessId,
      year: currentYear,
    },
    {
      $inc: {
        seq: 1,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return `${prefix}-${currentYear}/${currentMonth}/${String(counter.seq).padStart(6, "0")}`;
};
