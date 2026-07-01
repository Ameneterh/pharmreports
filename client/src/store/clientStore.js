import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server"
    : "/server";

axios.defaults.withCredentials = true;

export const useClientStore = create((set) => ({
  //   client: null,
  error: null,
  isLoading: false,
  message: null,

  //   add new client
  registerClient: async (
    client_name,
    client_email,
    client_phone,
    client_address,
    staff,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/client/add-client`, {
        client_name,
        client_email,
        client_phone,
        client_address,
        staff,
      });
      set({
        // business: response.data.business,
        // isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error adding a client",
        isLoading: false,
      });
      throw error;
    }
  },

  //   get one clients
  getOneClient: async (clientId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/client/get-client/${clientId}`,
      );
      set({
        client: response.data.client,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error getting clients",
        isLoading: false,
      });
      throw error;
    }
  },

  //   get all clients
  getAllClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/client/get-clients`);
      set({
        clients: response.data.clients,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error getting clients",
        isLoading: false,
      });
      throw error;
    }
  },
}));
