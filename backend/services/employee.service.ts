import api from "@/lib/api";
import { ApiResponse } from "@/types";

export const employeeService = {
    // Scheme Applications
    getAllSchemeApplications: async () => {
        const response = await api.get("/scheme-applications");
        return response.data;
    },

    verifySchemeApplication: async (id: string, data: { status: string; remarks: string }) => {
        const response = await api.put<ApiResponse>(`/scheme-applications/${id}/status`, data);
        return response.data;
    },

    // Service Applications (If applicable endpoint exists for general service verification)
    // Based on routes: router.put("/applicationn/verify", updateServiceStatus)
    verifyServiceApplication: async (data: { applicationId: string; status: string }) => {
        const response = await api.put<ApiResponse>("/employees/applicationn/verify", data);
        return response.data;
    }
};
