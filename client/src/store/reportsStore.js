import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server/report"
    : "/server/report";

const DOC_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "";

axios.defaults.withCredentials = true;

export const useReportsStore = create((set) => ({
  report: null,
  error: null,
  isLoading: false,
  message: null,
  summary: [],
  excelFile: null,
  // wordFile: null,

  //   send new message
  sendReport: async ({
    workStation,
    dutyType,
    timeOfDuty,
    dutyDateTime,
    dutiesDone,
    challenges,
    observations,
    interventions,
    outOfStock,
    remarks,
    reporter,
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/send-report`, {
        workStation,
        dutyType,
        timeOfDuty,
        dutyDateTime,
        dutiesDone,
        challenges,
        observations,
        interventions,
        outOfStock,
        remarks,
        reporter,
      });
      set({
        report: response.data.rating,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error sending report",
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

  // get weekly report
  generateWeeklyReports: async ({ startDate, endDate }) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await axios.get(`${API_URL}/summary`, {
        params: {
          startDate,
          endDate,
        },
      });

      const { data, files } = response.data;

      set({
        summary: data,
        // excelFile: `${process.env.SERVER_URL}/exports/${files.excel}`,
        // wordFile: `${process.env.SERVER_URL}/exports/${files.word}`,

        excelFile: `${DOC_URL}/${files.excel}`,
        wordFile: `http://localhost:5000/${files.word}`,

        loading: false,
      });
    } catch (error) {
      set({
        loading: false,

        error: error.response?.data?.message || error.message,
      });
    }
  },

  // 1. get all reports
  getAllReports: async ({ startDate, endDate }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-reports`, {
        params: {
          startDate,
          endDate,
        },
      });
      set({
        reports: response.data.reports,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error getting Reports",
        isLoading: false,
      });
      throw error;
    }
  },
}));
