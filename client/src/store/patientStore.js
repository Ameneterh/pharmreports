import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/patient"
    : "/server/patient";

const DOC_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://pharmreports.onrender.com";

axios.defaults.withCredentials = true;

export const usePatientStore = create((set, get) => ({
  patients: null,
  patient: null,
  error: null,
  isLoading: false,
  message: null,

  //   send new message
  addPatient: async (patientData) => {
    set({
      isLoading: true,
      error: null,
      message: null,
    });

    try {
      const response = await axios.post(`${API_URL}/add-patient`, patientData);

      const patient = response.data.patient ?? response.data;

      const message = response.data.message || "Patient added successfully";

      set((state) => ({
        patients: [patient, ...(state.patients || [])],
        patient,
        isLoading: false,
        error: null,
        message,
      }));

      // Return the result to handleSubmit
      return {
        success: true,
        patient,
        message,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error adding patient";

      set({
        error: message,
        isLoading: false,
        message: null,
      });

      // Return an error result instead of throwing
      return {
        success: false,
        message,
      };
    }
  },

  // 1. get patient by ID
  getPatientByHospitalNumber: async (hospitalNumber) => {
    set({ loading: true });

    try {
      const { data } = await axios.get(
        `${API_URL}/get-patient/${hospitalNumber}`,
      );

      set({
        patient: data.patient,
        loading: false,
      });

      return data.patient;
    } catch (error) {
      set({
        patient: null,
        loading: false,
      });

      throw error;
    }
  },

  getPatientById: async ({ startDate, endDate, patientId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-patient/${patientId}`, {
        params: {
          startDate,
          endDate,
        },
      });
      set({
        patient: response.data.patient,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error getting patient",
        isLoading: false,
      });
      throw error;
    }
  },

  // 2. get all patients
  getAllPatients: async ({ startDate, endDate }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-patients`, {
        params: {
          startDate,
          endDate,
        },
      });
      set({
        patients: response.data.patients,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error getting patients",
        isLoading: false,
      });
      throw error;
    }
  },
}));
