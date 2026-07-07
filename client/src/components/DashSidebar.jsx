import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import {
  MdOutlineCreateNewFolder,
  MdAddBusiness,
  MdBusiness,
  MdOutlineNotificationsActive,
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRegAddressBook } from "react-icons/fa";
import { TbMessage } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button, Sidebar } from "flowbite-react";
import Divider from "./Divider";

export default function DashSidebar() {
  const { error, isLoading, logout, user } = useAuthStore();

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    // <div className="min-h-screen w-full">
    <Sidebar className="w-full md:min-h-screen flex flex-col justify-between">
      <Sidebar.Items className="mb-5">
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {user && (
            <>
              <Link to="/user-dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to="/user-dashboard?tab=profile">
                <Sidebar.Item
                  active={tab === "profile"}
                  icon={HiUser}
                  as="div"
                  className="capitalize"
                  label={
                    <span className="text-nowrap bg-gray-600 text-white px-2 py-[6px] rounded-md text-xs capitalize">
                      {user.rank
                        .split(" ")
                        .map((word) => word.slice(0, 5))
                        .join(" ")}
                    </span>
                  }
                >
                  Profile
                </Sidebar.Item>
              </Link>

              <Link to="/user-dashboard?tab=notifications">
                <Sidebar.Item
                  active={tab === "notifications"}
                  icon={MdOutlineNotificationsActive}
                  as="div"
                >
                  Nofications
                </Sidebar.Item>
              </Link>

              <Link to="/user-dashboard?tab=reports">
                <Sidebar.Item
                  active={tab === "reports"}
                  icon={HiDocumentText}
                  as="div"
                >
                  View Reports
                </Sidebar.Item>
              </Link>
            </>
          )}

          {(user.isAdmin || user.role === "architect") && (
            <>
              <Link to="/user-dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  View Users
                </Sidebar.Item>
              </Link>
            </>
          )}

          {(user.role === "pharmacist" || user.role === "pharmtech") && (
            <>
              <Link to="/user-dashboard?tab=send-report">
                <Sidebar.Item
                  active={tab === "send-report"}
                  icon={MdOutlineCreateNewFolder}
                  as="div"
                >
                  Send Report
                </Sidebar.Item>
              </Link>
            </>
          )}

          {user.isAdmin && (
            <>
              <Link to="/user-dashboard?tab=add-user">
                <Sidebar.Item
                  active={tab === "add-user"}
                  icon={FaRegAddressBook}
                  as="div"
                >
                  Add User
                </Sidebar.Item>
              </Link>
              <Link to="/user-dashboard?tab=generate-report">
                <Sidebar.Item
                  active={tab === "generate-report"}
                  icon={TbReportAnalytics}
                  as="div"
                >
                  Generate Report
                </Sidebar.Item>
              </Link>
            </>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    // </div>
  );
}
