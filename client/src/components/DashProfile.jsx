import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Input } from "./Input";
import {
  AtSign,
  Loader,
  LockKeyhole,
  User,
  CalendarClock,
  PhoneOutgoing,
  EyeOff,
  Eye,
  KeySquare,
  Squirrel,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DashUpdatePassword from "./DashUpdatePassword.jsx";

export default function DashProfile() {
  const { user, updateUser, logout, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (file must be less than 500kB)",
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
          setImageFileUploading(false);
        });
      },
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made!");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      const changedFields = {};

      if (formData.fullname !== user.fullname)
        changedFields.fullname = formData.fullname;

      if (formData.email !== user.email) changedFields.email = formData.email;

      if (formData.phoneNumber !== user.phoneNumber)
        changedFields.phoneNumber = formData.phoneNumber;

      if (imageFileUrl) changedFields.avatar = imageFileUrl;

      // if (signatureUrl !== user.staff_signature)
      //   changedFields.staff_signature = signatureUrl;

      await updateUser(user._id, changedFields);
      toast.success("User details updated successfully!");
      // navigate("/user-dashboard?tab=dash");
    } catch (error) {
      toast.error(error.message);
      // setUpdateUserError(data.message);
    }
  };

  const handleDeleteUser = async (e) => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        // dispatch(deleteUserFailure(data.message));
      } else {
        // dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      // dispatch(deleteUserFailure(error.message));
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative mx-auto p-3 md:px-10 w-full bg-white">
      <h1 className="sm:my-7 text-center font-semibold text-3xl text-green-950">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || user.avatar}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <div className="flex items-center flex-col sm:flex-row justify-between gap-3">
          <Input
            icon={User}
            type="text"
            id="fullname"
            label="Full Name"
            placeholder="fullname"
            defaultValue={user?.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
          />
          <Input
            icon={User}
            type="text"
            id="role"
            label="* User Role"
            color="red"
            placeholder="role"
            defaultValue={user?.role}
            disabled
          />
          <Input
            icon={AtSign}
            type="email"
            id="email"
            label="User Email"
            placeholder="user@company.com"
            className="flex-1 w-full"
            defaultValue={user.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="flex items-center flex-col sm:flex-row justify-between gap-3">
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex items-center w-full">
              <Input
                icon={LockKeyhole}
                type={showPassword ? "text" : "password"}
                id="password"
                label="User Password"
                placeholder="Your Password"
                className="flex-1 w-full bg-transparent"
                disabled
                // defaultValue={user.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <div
                className="absolute right-2 inset-y-0 cursor-pointer flex items-center mt-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-green-500" />
                ) : (
                  <Eye className="size-5 text-green-500" />
                )}
              </div>
            </div>
            <div
              className="flex items-center gap-2 text-xs font-bold px-2 py-2 bg-blue-600 rounded text-white hover:opacity-75 cursor-pointer hover:scale-110 transition-all duration-300"
              onClick={() => setShowUpdatePassword(true)}
            >
              <Squirrel size={20} /> Update
            </div>
          </div>

          <Input
            icon={PhoneOutgoing}
            type="text"
            id="phoneNumber"
            label="User Phone Number"
            placeholder="Your Phone Number"
            className="flex-1 w-full"
            defaultValue={user.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>

        <div className="flex items-center flex-col sm:flex-row justify-between gap-3">
          <Input
            icon={CalendarClock}
            type="text"
            id="createdAt"
            label="* User Creation Date"
            color="red"
            placeholder="User Creation Date"
            className="flex-1 w-full"
            defaultValue={new Date(user.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
            disabled
          />
          <Input
            icon={CalendarClock}
            type="text"
            id="lastLogin"
            label="* User Last Login"
            color="red"
            placeholder="User Last Login"
            className="flex-1 w-full"
            defaultValue={new Date(user.lastLogin).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
            disabled
          />
          {/* <Input
            icon={CalendarClock}
            type="text"
            id="updatedAt"
            label="* User Last Update"
            color="red"
            placeholder="User Last Update"
            className="flex-1 w-full"
            defaultValue={new Date(user.updatedAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
            disabled
          /> */}
        </div>

        <p className="text-red-600 text-sm">
          * Represents fields users cannot edit
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <motion.button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-700 to-emerald-700 rounded-lg hover:border-white hover:from-green-600 hover:to-emerald-700 border border-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-900 transition duration-200 cursor-pointer flex items-center justify-center text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || imageFileUploading}
          >
            {isLoading ? (
              <div className="flex gap-3 items-center text-white">
                <Loader className="w-6 h-6 animate-spin mx-auto font-bold" />
                <p>Updating ...</p>
              </div>
            ) : (
              "Update User Details"
            )}
          </motion.button>

          {user.role === "handler" ||
          user.role === "architect" ||
          user.role === "businessAdmin" ? (
            <Link
              to="/user-dashboard?tab=create-invoice"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-emerald-700 rounded-lg hover:border-white hover:from-green-600 hover:to-blue-700 border border-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-900 transition duration-200 cursor-pointer flex items-center justify-center text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Invoice
            </Link>
          ) : (
            <></>
          )}
        </div>
      </form>

      {user.role !== "architect" && (
        <div className="text-red-500 flex justify-between mt-5">
          <span
            onClick={() => setShowModal(true)}
            className="cursor-pointer px-4 py-2 bg-red-200 rounded-md hover:scale-110 transition-all duration-300"
          >
            Delete Account
          </span>
        </div>
      )}

      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I am Sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {showUpdatePassword && (
        <DashUpdatePassword setShowUpdatePassword={setShowUpdatePassword} />
      )}
    </div>
  );
}
