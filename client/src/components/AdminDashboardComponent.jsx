import React from "react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { MdLocalPharmacy } from "react-icons/md";
import { TbReport, TbReportAnalytics } from "react-icons/tb";
import { Link } from "react-router-dom";

// total user count component
export function AdminDashboardUserTotalComponent({
  totalUsers,
  lastMonthUsers,
  heading,
  type,
  userCount,
}) {
  return (
    <Link
      to="/user-dashboard?tab=users"
      className="flex flex-col p-3 bg-gray-200 hover:bg-opacity-70 min-w-64 w-full md:w-64 min-h-[110px] rounded-lg shadow-md cursor-pointer"
    >
      <div className="flex gap-2 items-center justify-end">
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">{heading}</h3>
        </div>
        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-[40px] p-2 shadow-lg" />
      </div>
      <p className="bg-red-600 w-full h-[1px] mt-2"></p>
      <div className="flex items-center justify-between py-2">
        <div className="text-5xl flex items-center gap-1">
          {totalUsers}
          <p className="text-sm">
            Users <span className="block -mt-1">Unboarded</span>
          </p>
        </div>
        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-black"></div>
      </div>
      <div className="grid grid-cols-3 mt-2 text-sm items-center justify-center bg-gray-400 rounded py-1">
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Pharm</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {userCount?.pharmacist}
          </span>
        </p>
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Tech</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {userCount.pharmtech}
          </span>
        </p>
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Admin</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {userCount.staff}
          </span>
        </p>
      </div>
    </Link>
  );
}

// all report count component
export function AdminDashboardReportComponent({
  totalReports,
  heading,
  reportCount,
  reportsByRole,
}) {
  return (
    <Link
      to="/user-dashboard?tab=reports"
      className="flex flex-col p-3 bg-gray-200 hover:bg-opacity-70 min-w-64 w-full md:w-64 min-h-[110px] rounded-lg shadow-md cursor-pointer"
    >
      <div className="flex gap-2 items-center justify-end">
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">{heading}</h3>
        </div>
        <TbReport className="bg-teal-600 text-white rounded-full text-[40px] p-2 shadow-lg" />
      </div>
      <p className="bg-red-600 w-full h-[1px] mt-2"></p>
      <div className="flex items-center justify-between py-2">
        <div className="text-5xl flex items-center gap-1">
          {totalReports}
          <p className="text-sm">
            Reports <span className="block -mt-1">Submitted</span>
          </p>
        </div>
        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-black"></div>
      </div>
      <div className="grid grid-cols-3 mt-2 text-sm items-center justify-center bg-gray-400 rounded py-1">
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Pharm</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {reportsByRole?.pharmacist}
          </span>
        </p>
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Tech</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {reportsByRole?.pharmtech ? reportsByRole.pharmtech : 0}
          </span>
        </p>
      </div>
    </Link>
  );
}

// last week report count component
export function LastWeekReportComponent({
  totalReports,
  heading,
  reportCount,
  reportsByRole,
}) {
  return (
    <Link
      to="/user-dashboard?tab=reports"
      className="flex flex-col p-3 bg-gray-200 hover:bg-opacity-70 min-w-64 w-full md:w-64 min-h-[110px] rounded-lg shadow-md cursor-pointer"
    >
      <div className="flex gap-2 items-center justify-end">
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">{heading}</h3>
        </div>
        <TbReportAnalytics className="bg-teal-600 text-white rounded-full text-[40px] p-2 shadow-lg" />
      </div>
      <p className="bg-red-600 w-full h-[1px] mt-2"></p>
      <div className="flex items-center justify-between py-2">
        <div className="text-5xl flex items-center gap-1">
          {totalReports}
          <p className="text-sm">
            Reports <span className="block -mt-1 text-nowrap">This Week</span>
          </p>
        </div>
        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-black"></div>
      </div>
      <div className="grid grid-cols-3 mt-2 text-sm items-center justify-center bg-gray-400 rounded py-1">
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Pharm</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {reportsByRole?.pharmacist}
          </span>
        </p>
        <p className="text-green-800 flex flex-col items-center">
          <span className="text-black text-sm">Tech</span>
          <span className="flex gap-1 items-center text-lg font-bold -mt-1">
            <MdLocalPharmacy size={18} />
            {reportsByRole?.pharmtech ? reportsByRole.pharmtech : 0}
          </span>
        </p>
      </div>
    </Link>
  );
}

export default function AdminDashboardComponent({
  totalUsers,
  lastMonthUsers,
  heading,
  type,
}) {
  return (
    <div className="flex flex-col p-3 bg-gray-200 hover:bg-opacity-70 min-w-64 w-full md:w-64 min-h-[110px] rounded-md shadow-md cursor-pointer">
      <div className="flex gap-2 items-center justify-between">
        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">{heading}</h3>
        </div>
      </div>
      <p className="text-3xl my-2">
        {totalUsers}
        <span className="text-sm ml-2">{type}</span>
      </p>
      <div className="flex gap-2 text-sm items-center">
        <span className="text-green-500 text-lg flex items-center">
          <HiArrowNarrowUp />
          {lastMonthUsers}
        </span>
        <div className="text-gray-500 capitalize">{type} Last Month</div>
      </div>
    </div>
  );
}

export function UserDashboardComponents({
  totalPaid,
  icon,
  text,
  unit,
  bgColor,
  indicator,
}) {
  return (
    <div
      className={`flex flex-row items-center justify-between min-w-[120px] w-full sm:w-64 h-[110px] rounded overflow-hidden border border-white bg-${bgColor}`}
    >
      <div className="p-3">
        <h2>{text}</h2>
        <p className="text-2xl">
          {totalPaid.toLocaleString()} {unit}
        </p>
      </div>
      <div
        className={`h-full  p-1 flex items-center text-3xl text-green-700 ${indicator}`}
      >
        {icon}
      </div>
    </div>
  );
}
