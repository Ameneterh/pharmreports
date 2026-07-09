import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/notification"
    : "/server/notification";

const DOC_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://pharmreports.onrender.com";

axios.defaults.withCredentials = true;

export const useNotificationStore = create((set) => ({
  notifications: null,
  error: null,
  isLoading: false,
  message: null,

  //   send new message
  sendNotification: async ({ title, content, remarks, notificationBy }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/send-notification`, {
        title,
        content,
        remarks,
        notificationBy,
      });
      set({
        notifications: response.data.rating,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error sending notification",
        isLoading: false,
      });
      throw error;
    }
  },

  // read notifications
  readNotification: async ({ id, user }) => {
    await axios.put(`${API_URL}/read/${id}`, { id, user });

    set((state) => ({
      notifications: state.notifications?.notifications?.map((notification) => {
        if (notification?._id === id) {
          return {
            ...notification,
            readBy: [
              ...notification.readBy,
              {
                reader: user._id,
                readAt: new Date(),
              },
            ],
          };
        }

        return notification;
      }),
    }));
  },

  // 1. get all reports
  getAllNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-notifications`);
      set({
        notifications: response.data.notifications,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error fetching notifications",
        isLoading: false,
      });
      throw error;
    }
  },

  //   send comment
  commentReport: async ({ comment, reportId, commentBy }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/send-comment`, {
        comment,
        reportId,
        commentBy,
      });
      set({
        comment: response.data.comment,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error sending comment",
        isLoading: false,
      });
      throw error;
    }
  },
}));
