import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/encounter"
    : "/server/encounter";

const DOC_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://pharmreports.onrender.com";

axios.defaults.withCredentials = true;

const useEncounterStore = create((set, get) => ({
  encounters: [],
  encounter: null,
  isLoading: false,
  error: null,
  message: null,

  // Save a new encounter
  addEncounter: async (encounterData) => {
    set({
      isLoading: true,
      error: null,
      message: null,
    });

    try {
      const response = await axios.post(
        `${API_URL}/add-encounter`,
        encounterData,
      );

      const savedEncounter = response.data.encounter ?? response.data;

      set((state) => ({
        encounters: [savedEncounter, ...(state.encounters || [])],
        encounter: savedEncounter,
        isLoading: false,
        message: response.data.message || "Encounter saved successfully.",
      }));

      return {
        success: true,
        encounter: savedEncounter,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to save encounter.";

      set({
        isLoading: false,
        error: message,
      });

      return {
        success: false,
        error: message,
      };
    }
  },

  // Retrieve encounters for a patient
  fetchPatientEncounters: async (patientId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.get(`${API_URL}/patient/${patientId}`, {
        withCredentials: true,
      });

      set({
        encounters: response.data.encounters || [],
        isLoading: false,
      });

      return response.data.encounters || [];
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Unable to load patient encounters.",
      });

      return [];
    }
  },

  clearEncounterFeedback: () =>
    set({
      error: null,
      message: null,
    }),
}));

export default useEncounterStore;
