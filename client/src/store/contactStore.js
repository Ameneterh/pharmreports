import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/contact"
    : "/server/contact";

axios.defaults.withCredentials = true;

export const useContactStore = create((set) => ({
  contact: null,
  error: null,
  isLoading: false,
  message: null,

  //   send new message
  sendMessage: async ({ sender_name, sender_email, sender_phone, text }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/send-message`, {
        sender_name,
        sender_email,
        sender_phone,
        text,
      });
      set({
        contact: response.data.contact,
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

  // 1. get all messages
  getAllMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-messages`);
      set({
        messages: response.data.messages,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error getting Messages",
        isLoading: false,
      });
      throw error;
    }
  },

  //   read a message
  readMessage: async ({ status, readBy, messageId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/read-message`, {
        status,
        readBy,
        messageId,
      });
      set({
        // contact: response.data.contact,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error reading message",
        isLoading: false,
      });
      throw error;
    }
  },
}));
