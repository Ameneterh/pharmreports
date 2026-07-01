import { create } from "zustand";
import axios from "axios";

export const useResultStore = create((set) => ({
  results: [],
  loading: false,

  fetchStudentResults: async (studentId) => {
    set({ loading: true });
    const res = await axios.get(`/api/results/student/${studentId}`);
    set({ results: res.data, loading: false });
  },

  signResult: async (id, role) => {
    await axios.post(`/api/results/${id}/sign/${role}`);
  },
}));
