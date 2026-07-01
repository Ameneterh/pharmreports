import { create } from "zustand";
import axios from "axios";

export const useAnalyticsStore = create((set) => ({
  stats: {},

  fetchAdminStats: async () => {
    const res = await axios.get("/api/analytics/admin");
    set({ stats: res.data });
  },
}));
