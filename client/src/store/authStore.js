import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/auth"
    : "/server/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  users: [],
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  justLoggedOut: false,

  //   add new new user account
  addUser: async ({ fullname, email, phoneNumber, password, role }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/add-user`, {
        fullname,
        email,
        phoneNumber,
        password,
        role,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  //   admin add new new user account
  addNewUser: async ({ fullname, email, phoneNumber, role }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/add-new-user`, {
        fullname,
        email,
        phoneNumber,
        role,
      });
      set({
        // user: response.data.user,
        // isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error adding new user",
        isLoading: false,
      });
      throw error;
    }
  },

  //   add new new business account
  addBusiness: async ({
    business_name,
    business_email,
    business_password,
    business_phone,
    business_address,
    banker,
    account_name,
    account_number,
    business_logo,
  }) => {
    set({ isBizLoading: true, bizError: null });
    try {
      const response = await axios.post(`${API_URL}/add-new-business`, {
        business_name,
        business_email,
        business_password,
        business_phone,
        business_address,
        banker,
        account_name,
        account_number,
        business_logo,
      });
      set({
        business: response.data.business,
        isBizAuthenticated: true,
        isBizLoading: false,
      });
    } catch (error) {
      set({
        bizError:
          error.response?.data?.message ||
          error.message ||
          "Error registering business",
        isBizLoading: false,
      });
      throw error;
    }
  },

  // verify email
  verifyUser: async (code) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error verifying email",
        isLoading: false,
      });

      throw error;
    }
  },

  //   user login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/user-login`, {
        email,
        password,
      });

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  // user log out
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        justLoggedOut: true,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // check user authentication
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        token,
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false });
    }
  },

  // password reset
  resetPassword: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        email,
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  // general users actions: get all users, get one user, update user, delete user
  // 1. get all users
  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-users`);
      set({
        users: response.data.users,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error getting Users",
        isLoading: false,
      });
      throw error;
    }
  },

  // 2. update a user
  updateUser: async (userId, formData) => {
    try {
      set({ isLoading: true });

      const response = await axios.put(
        `${API_URL}/update-user/${userId}`,
        formData,
      );

      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? response.data.user : user,
        ),
        user: state.user?._id === userId ? response.data.user : state.user,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      console.log("ERROR", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      set({ isLoading: false });

      throw (
        error.response?.data ?? {
          message: "Failed to update user",
        }
      );
    }
  },

  // 3. update user password
  updatePassword: async ({ userId, oldPassword, password }) => {
    try {
      set({ isLoading: true });

      const response = await axios.put(`${API_URL}/update-password/${userId}`, {
        oldPassword,
        password,
      });

      set((state) => ({
        user: state.user?._id === userId ? response.data.user : state.user,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({ isLoading: false });

      throw error;
    }
  },
}));
