import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdOutlineDeleteSweep, MdFilterList } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { useClientStore } from "../store/clientStore";
import { Search, Trash2, BadgeCheck, X, Check } from "lucide-react";
import { Input } from "./Input";
import { UserFiltersComponent } from "./DashFilterComponent";

export default function DashUsers() {
  const { user, updateUser, getAllUsers } = useAuthStore();

  // sorting and filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(false);

  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const [selectedUser, setSelectedUser] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const [formData, setFormData] = useState({});

  const getUsers = async () => {
    try {
      const { users } = await getAllUsers();

      if (user.role === "architect" || user.isAdmin) {
        setUsers(users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (user.role === "architect" || user.isAdmin) {
      getUsers();
    }
  }, [user]);

  useEffect(() => {
    if (userIdToDelete) {
      handleDeleteUser();
    }
  }, [userIdToDelete]);

  const handleOpenModal = (userToUpdate) => {
    setSelectedUser(userToUpdate);
    setShowModal(true);
  };

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await updateUser(userIdToDelete._id, {
        isDeleted: true,
      });

      getUsers();

      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const selectedUsers = users
    .filter((user) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        user?.email?.toLowerCase().includes(search) ||
        user?.role?.toLowerCase().includes(search) ||
        user?.fullname?.toLowerCase().includes(search) ||
        user?.status?.toLowerCase().includes(search) ||
        new Date(user?.createdAt)
          .toLocaleDateString("en-GB")
          .toLowerCase()
          .includes(search);

      return matchesSearch;
    })
    .sort((a, b) => {
      let result = 0;

      switch (sortBy) {
        case "date":
          result = new Date(a.createdAt) - new Date(b.createdAt);
          break;

        case "user":
          result = a.fullname.localeCompare(b.fullname);
          break;

        case "status":
          result = a.status.localeCompare(b.status);
          break;

        case "role":
          result = a.role?.localeCompare(b.role);
          break;

        default:
          break;
      }

      return sortOrder === "asc" ? result : -result;
    });

  const handleUpdateUserStatus = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made!");
      return;
    }

    try {
      const changedFields = {};

      if (formData.status !== selectedUser.status)
        changedFields.status = formData.status;

      if (formData.isDeleted !== selectedUser.isDeleted)
        changedFields.isDeleted = formData.isDeleted;

      await updateUser(selectedUser._id, changedFields);
      setShowModal(false);
      getUsers();
      toast.success("User status updated successfully!");
    } catch (error) {
      toast.error(error.message);
      // setUpdateUserError(data.message);
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mt-4 md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 flex gap-5 mt-8 sm:mt-0">
      {showFilters && (
        <UserFiltersComponent
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          user={user}
        />
      )}
      <div className="flex flex-col gap-5 w-full">
        <h1 className="text-xl font-extrabold">List of Users:</h1>
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <p className="text-primary">Filters</p>
              <MdFilterList className="w-5 h-5" />
            </div>
          )}

          {/* search bar */}
          <div className="w-full max-w-96">
            <Input
              icon={Search}
              type="text"
              placeholder="Search User, Affiliation, Phone, Email, Status, Role ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {selectedUsers.length > 0 ? (
          <table className="border-collapse border-none leading-tight w-full">
            <thead className="bg-gray-400">
              <tr className="border-b-black border-b-2 text-sm">
                <th className="px-4 py-1 text-left">Name of User</th>
                <th className="px-4 py-1 text-left">User Email</th>
                <th className="px-4 py-1 text-left">User Phone</th>
                <th className="px-4 py-1 text-left">User Role</th>
                <th className="px-4 py-1 text-left">isAdmin</th>
                <th className="px-4 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="">
              {selectedUsers.map((pickedUser, index) => (
                <tr
                  key={index}
                  className={`${pickedUser.isDeleted ? "bg-red-200 text-red-700 font-semibold" : ""}`}
                >
                  <td className="flex items-center px-4 py-1 text-sm text-nowrap">
                    {pickedUser?.fullname}
                    {pickedUser?.isDeleted && (
                      <MdOutlineDeleteSweep
                        size={16}
                        className="text-red-800 ml-1"
                        title="User Deleted!"
                      />
                    )}
                    {pickedUser.isVerified && !pickedUser.isDeleted && (
                      <BadgeCheck
                        size={16}
                        className="text-blue-800 ml-1 font-extrabold"
                        title="User Deleted!"
                      />
                    )}
                  </td>
                  <td className="px-4 py-1 text-sm text-nowrap">
                    {pickedUser.email}
                  </td>
                  <td className="px-4 py-1 text-sm text-nowrap">
                    {pickedUser.phoneNumber}
                  </td>
                  <td className="px-4 py-1 text-sm text-nowrap capitalize">
                    {pickedUser.role}
                  </td>
                  <td className="px-4 py-1 text-sm text-nowrap capitalize">
                    {pickedUser.isAdmin === true ? (
                      <Check size={16} className="font-bold text-green-800" />
                    ) : (
                      <X size={16} className="font-bold text-red-800" />
                    )}
                  </td>
                  <td className="flex items-center gap-2 px-4 py-1 text-sm text-nowrap">
                    <span
                      className={`capitalize cursor-pointer ${pickedUser.status === "active" ? "text-green-800" : pickedUser.status === "suspended" ? "text-orange-600" : "text-red-600"}`}
                      onClick={() => handleOpenModal(pickedUser)}
                    >
                      {pickedUser.status}
                    </span>

                    {!pickedUser.isDeleted && (
                      <button
                        onClick={() => {
                          setUserIdToDelete(pickedUser);
                        }}
                      >
                        <Trash2
                          className={`text-red-600 size-4 transition-all duration-300 hover:scale-125"}`}
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* modal to update user status */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex flex-col p-2 rounded border text-sm">
              <div className="flex flex-col pb-2 border-b-2">
                <p className="capitalize font-bold text-lg text-center text-red-500">
                  Update User Status
                </p>
              </div>

              {/*  */}
              <div className="flex mt-3 rounded">
                <form
                  onSubmit={handleUpdateUserStatus}
                  className="w-full flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative px-2 py-1 h-[34px] border border-gray-950 rounded w-full mt-2">
                      <p className="bg-white text-xs font-semibold absolute left-2 -top-2 px-1 text-nowrap">
                        Current User Status:
                      </p>
                      <p className="capitalize mt-1 w-full text-center text-green-900">
                        {selectedUser.status}
                      </p>
                    </div>

                    <div className="flex flex-col w-full relative mt-2">
                      <label
                        htmlFor="validity"
                        className="text-xs font-semibold absolute -top-2 left-2 bg-white px-1"
                      >
                        Choose New Status
                      </label>
                      <select
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        // onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-3 pr-3 py-[6px] bg-white rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-green-800 placeholder-green-800 transition duration-200"
                      >
                        <option value="">Choose ...</option>
                        <option
                          value="active"
                          disabled={selectedUser.status === "active"}
                        >
                          Activate User
                        </option>
                        <option
                          value="suspended"
                          disabled={selectedUser.status === "suspended"}
                        >
                          Suspend User
                        </option>
                        <option
                          value="banned"
                          disabled={selectedUser.status === "banned"}
                        >
                          Blacklist User
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4">
                    <button
                      className="bg-red-700 text-white px-4 rounded py-1 text-xs hover:scale-105 transition-all duration-300 hover:bg-red-800"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-700 text-white px-4 rounded py-1 text-xs hover:scale-105 transition-all duration-300 hover:bg-blue-800"
                    >
                      Okay
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
