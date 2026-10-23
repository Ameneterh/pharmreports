import { useEffect, useState } from "react";
import { RiHealthBookFill } from "react-icons/ri";
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
  MdArrowForwardIos,
  MdArrowRight,
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRegAddressBook } from "react-icons/fa";
import { TbMessage } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button, Sidebar } from "flowbite-react";
import Divider from "./Divider";
import { useUpdatesStore } from "../store/updatesStore";

export default function DashSidebar() {
  const { error, isLoading, logout, user } = useAuthStore();
  const { getAllUpdates, readUpdate, unreadCount } = useUpdatesStore();

  const [updates, setUpdates] = useState([]);
  const [openUserLinks, setOpenUserLinks] = useState(false);
  const [openReportsLinks, setOpenReportsLinks] = useState(false);
  const [openPharmaCareLinks, setOpenPharmaCareLinks] = useState(false);

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const getUpdates = async () => {
    try {
      const { updates } = await getAllUpdates(user?._id);
      setUpdates(updates);
      return updates;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    getUpdates();
  }, [user?._id]);

  return (
    // <div className="min-h-screen w-full">
    <Sidebar className="w-full md:min-h-screen flex flex-col justify-between text-sm">
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

              <Link to="/user-dashboard?tab=general-information">
                <Sidebar.Item
                  active={tab === "general-information"}
                  icon={MdOutlineNotificationsActive}
                  as="div"
                  className=""
                >
                  General Info{" "}
                  <div className="relative inline-block">
                    <span className="absolute -top-4 left-0 text-xs bg-red-900 text-white px-1 font-semibold">
                      {unreadCount || 0}
                    </span>
                  </div>
                </Sidebar.Item>
              </Link>

              {/* user links */}
              <div className="flex flex-col gap-2 px-1">
                <p
                  className={`w-full flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 px-2 py-2 rounded-md transition-all duration-300`}
                  onClick={() => setOpenUserLinks(!openUserLinks)}
                >
                  <span className="flex items-center gap-2">
                    <FaRegAddressBook size={20} /> Open User Links
                  </span>
                  {openUserLinks ? (
                    <MdArrowForwardIos size={16} />
                  ) : (
                    <MdArrowForwardIos size={16} className="rotate-90" />
                  )}
                </p>
                {openUserLinks && user.isAdmin && (
                  <>
                    <Link
                      to="/user-dashboard?tab=add-user"
                      onClick={() => setOpenUserLinks(false)}
                    >
                      <Sidebar.Item
                        active={tab === "add-user"}
                        icon={MdArrowRight}
                        as="div"
                      >
                        Add User
                      </Sidebar.Item>
                    </Link>

                    <Link
                      to="/user-dashboard?tab=users"
                      onClick={() => setOpenUserLinks(false)}
                    >
                      <Sidebar.Item
                        active={tab === "users"}
                        icon={MdArrowRight}
                        as="div"
                      >
                        View Users
                      </Sidebar.Item>
                    </Link>
                  </>
                )}
              </div>

              {/* reports links */}
              <div className="flex flex-col gap-2 px-1">
                <p
                  className={`w-full flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 px-2 py-2 rounded-md transition-all duration-300`}
                  onClick={() => setOpenReportsLinks(!openReportsLinks)}
                >
                  <span className="flex items-center gap-2">
                    <MdOutlineCreateNewFolder size={20} /> Open Reports Links
                  </span>
                  {openReportsLinks ? (
                    <MdArrowForwardIos size={16} />
                  ) : (
                    <MdArrowForwardIos size={16} className="rotate-90" />
                  )}
                </p>
                {openReportsLinks && user && (
                  <>
                    {(user.role === "pharmacist" ||
                      user.role === "pharmtech") && (
                      <>
                        <Link
                          to="/user-dashboard?tab=send-report"
                          onClick={() => setOpenReportsLinks(false)}
                        >
                          <Sidebar.Item
                            active={tab === "send-report"}
                            icon={MdArrowRight}
                            as="div"
                          >
                            Send Report
                          </Sidebar.Item>
                        </Link>
                      </>
                    )}

                    <Link
                      to="/user-dashboard?tab=reports"
                      onClick={() => setOpenReportsLinks(false)}
                    >
                      <Sidebar.Item
                        active={tab === "reports"}
                        icon={MdArrowRight}
                        as="div"
                      >
                        View Reports
                      </Sidebar.Item>
                    </Link>

                    {user.isAdmin && (
                      <>
                        <Link
                          to="/user-dashboard?tab=generate-report"
                          onClick={() => setOpenReportsLinks(false)}
                        >
                          <Sidebar.Item
                            active={tab === "generate-report"}
                            icon={MdArrowRight}
                            as="div"
                          >
                            Generate Report
                          </Sidebar.Item>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* pharmaceutical care links */}
          <div className="flex flex-col gap-2 px-1">
            <p
              className={`w-full flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 px-2 py-2 rounded-md transition-all duration-300`}
              onClick={() => setOpenPharmaCareLinks(!openPharmaCareLinks)}
            >
              <span className="flex items-center gap-2">
                <RiHealthBookFill size={20} /> Pharma Care Links
              </span>
              {openPharmaCareLinks ? (
                <MdArrowForwardIos size={16} />
              ) : (
                <MdArrowForwardIos size={16} className="rotate-90" />
              )}
            </p>
            {openPharmaCareLinks && user.isAdmin && (
              <>
                <Link
                  to="/user-dashboard?tab=add-patient"
                  onClick={() => setOpenPharmaCareLinks(false)}
                >
                  <Sidebar.Item
                    active={tab === "add-patient"}
                    icon={MdArrowRight}
                    as="div"
                  >
                    Add New Patient
                  </Sidebar.Item>
                </Link>

                <Link
                  to="/user-dashboard?tab=add-encounter"
                  onClick={() => setOpenPharmaCareLinks(false)}
                >
                  <Sidebar.Item
                    active={tab === "add-encounter"}
                    icon={MdArrowRight}
                    as="div"
                  >
                    Add New Encounter
                  </Sidebar.Item>
                </Link>

                <Link
                  to="/user-dashboard?tab=review-encounter"
                  onClick={() => setOpenPharmaCareLinks(false)}
                >
                  <Sidebar.Item
                    active={tab === "review-encounter"}
                    icon={MdArrowRight}
                    as="div"
                  >
                    Review Encounter
                  </Sidebar.Item>
                </Link>
              </>
            )}
          </div>

          {(user.username === "Ameneterh" || user.role === "architect") && (
            <></>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    // </div>
  );
}
