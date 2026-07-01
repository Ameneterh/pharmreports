import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/server"
    : "/server";

axios.defaults.withCredentials = true;

export const useInvoiceStore = create((set) => ({
  //   invoice: null,
  error: null,
  isLoading: false,
  message: null,

  //   add new invoice
  createInvoice: async ({
    validity,
    // invoiceNumber,
    items,
    total,
    invoiceType,
    client,
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/invoice/create-invoice`, {
        validity,
        // invoiceNumber,
        items,
        total,
        invoiceType,
        client,
      });
      set({
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error adding invoice",
        isLoading: false,
      });
      throw error;
    }
  },

  //   get all clients
  getAllInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/invoice/get-invoices`);
      set({
        invoices: response.data.invoices,
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

  //   get one invoice by id
  getInvoiceById: async (invoiceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/invoice/${invoiceId}`);
      set({
        invoice: response.data.invoice,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching invoice",
        isLoading: false,
      });
      throw error;
    }
  },

  // update invoice payment
  updateInvoicePayment: async (
    invoiceId,
    paymentAmount,
    paymentMethod,
    reference,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/invoice/${invoiceId}/update-payment`,
        {
          paymentAmount,
          paymentMethod,
          reference,
        },
      );
      set({
        invoice: response.data.invoice,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error updating invoice payment",
        isLoading: false,
      });
      throw error;
    }
  },

  // update invoices
  updateInvoice: (updatedInvoice) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice._id === updatedInvoice._id ? updatedInvoice : invoice,
      ),
    })),
}));
