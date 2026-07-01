import dayjs from "./dayjs.js";

const TZ = "Africa/Lagos";

export function getDeadline(reportDate, shift) {
  const base = dayjs.tz(reportDate, TZ);

  if (shift === "Morning") {
    return base.endOf("day"); // same day 11:59 PM
  }

  if (shift === "Night") {
    return base.add(1, "day").hour(11).minute(59).second(59);
  }

  throw new Error("Invalid shift type");
}

export function isSubmissionAllowed(report, user) {
  const now = dayjs().tz(TZ);

  // ✅ ADMIN OVERRIDE
  if (user.role === "admin") return true;

  // ✅ MANUAL REOPEN (if you added it)
  if (report.isManuallyOpened) {
    if (!report.manualOpenExpiresAt) return true;

    if (now.isBefore(dayjs(report.manualOpenExpiresAt))) {
      return true;
    }
  }

  // ✅ NORMAL DEADLINE CHECK
  return now.isBefore(dayjs(report.submissionDeadline));
}
