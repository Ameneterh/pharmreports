import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/business"
    : "/server/business";

axios.defaults.withCredentials = true;

export const useBusinessStore = create((set) => ({
  business: null,
  error: null,
  isLoading: false,
  message: null,

  //   get all businesses
  getAllBusinesses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-businesses`);
      set({
        businesses: response.data.businesses,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error getting Invoices",
        isLoading: false,
      });
      throw error;
    }
  },

  // verify email
  updateBusiness: async (businessId, formData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.put(
        `${API_URL}/update-business/${businessId}`,
        formData,
      );

      set((state) => ({
        businesses: state.businesses.map((business) =>
          business._id === businessId ? response.data.business : business,
        ),
        business:
          state.business?._id === businessId
            ? response.data.business
            : state.business,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      set({ isLoading: false });

      throw (
        error.response?.data || {
          message: "Failed to update business",
        }
      );
    }
  },
}));
