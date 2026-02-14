import api, { apiMultipart } from "@/lib/api";
import { ApiResponse } from "@/types";

export const citizenService = {
    // Schemes
    getAllSchemes: async () => {
        const response = await api.get("/schemes");
        return response.data;
    },

    applyForScheme: async (formData: FormData) => {
        // Requires multipart/form-data
        const response = await apiMultipart.post<ApiResponse>("/scheme-applications/apply", formData);
        return response.data;
    },

    getMySchemeApplications: async () => {
        const response = await api.get("/scheme-applications/my");
        return response.data;
    },

    // Services
    applyForService: async (data: any) => {
        const response = await api.post<ApiResponse>("/service-applications", data);
        return response.data;
    },

    // Complaints
    createComplaint: async (formData: FormData) => {
        const response = await apiMultipart.post<ApiResponse>("/complaints", formData);
        return response.data;
    },

    getAllComplaints: async () => {
        const response = await api.get("/complaints");
        return response.data;
    },

    getComplaintById: async (id: string) => {
        const response = await api.get(`/complaints/${id}`);
        return response.data;
    },

    // Feedback
    submitFeedback: async (data: { complaint_id: string; rating: number; description: string }) => {
        const response = await api.post<ApiResponse>("/feedback", data);
        return response.data;
    }
};
