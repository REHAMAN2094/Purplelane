import api from "@/lib/api";
import { LoginCredentials, LoginResponse, RegisterCitizenData, ApiResponse } from "@/types";

export const authService = {
    login: async (credentials: LoginCredentials) => {
        // Using /admin/login as generic login point based on backend routes
        const response = await api.post<LoginResponse>("/admin/login", credentials);
        return response.data;
    },

    registerCitizen: async (data: RegisterCitizenData) => {
        const response = await api.post<ApiResponse>("/citizens/register", data);
        return response.data;
    },

    createAdmin: async (data: LoginCredentials) => {
        // Initial setup route
        const response = await api.post<ApiResponse>("/admin/create", data);
        return response.data;
    }
};
