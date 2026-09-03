import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/update"
    : "/server/notification";

const DOC_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://pharmreports.onrender.com";

axios.defaults.withCredentials = true;

export const useUpdatesStore = create((set) => ({
  updates: [],
  unreadCount: 0,
  error: null,
  isLoading: false,
  message: null,

  //   send new message
  sendUpdate: async ({ title, content, remarks, updateBy }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/send-update`, {
        title,
        content,
        remarks,
        updateBy,
      });
      set({
        updates: response.data.updates,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error sending update",
        isLoading: false,
      });
      throw error;
    }
  },

  // read notifications
  readUpdate: async ({ id, user }) => {
    await axios.put(`${API_URL}/read/${id}`, {
      id,
      user,
    });

    set((state) => {
      const updatedUpdates = state.updates.updates.map((update) => {
        if (update._id === id) {
          return {
            ...update,
            readBy: [
              ...(update.readBy || []),
              {
                reader: user._id,
                readAt: new Date(),
              },
            ],
          };
        }
        return update;
      });

      // const unreadCount = updatedUpdates.filter(
      //   (update) => !update.readBy?.some((r) => r.reader === user._id),
      // ).length;

      const unreadCount = computeUnread(user._id, updatedUpdates);

      return {
        updates: updatedUpdates,
        unreadCount,
      };
    });
  },

  // compute unread updates
  computeUnread: (userId, updates) => {
    return updates.filter(
      (update) => !update.readBy?.some((r) => r.reader === userId),
    ).length;
  },

  // get all reports
  getAllUpdates: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/get-updates`);
      const updates = response.data.updates;

      const unreadCount = updates.updates.filter(
        (update) => !update.readBy?.some((r) => r.reader === userId),
      ).length;

      set({
        updates,
        unreadCount,
        isLoading: false,
      });

      return response.data.updates;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching updates",
        isLoading: false,
      });
      throw error;
    }
  },
}));
