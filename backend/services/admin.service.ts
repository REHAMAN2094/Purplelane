import api from "@/lib/api";
import { CreateDepartmentData, CreateEmployeeData, CreateSchemeData, CreateServiceData, ApiResponse } from "@/types";

export const adminService = {
    // Dashboard
    getDashboardStats: async () => {
        const response = await api.get("/dashboard/admin");
        return response.data;
    },

    // Departments
    createDepartment: async (data: CreateDepartmentData) => {
        const response = await api.post<ApiResponse>("/departments", data);
        return response.data;
    },

    getAllDepartments: async () => {
        const response = await api.get("/departments");
        return response.data;
    },

    // Employees
    createEmployee: async (data: CreateEmployeeData) => {
        const response = await api.post<ApiResponse>("/employees", data);
        return response.data;
    },

    // Schemes
    createScheme: async (data: CreateSchemeData) => {
        const response = await api.post<ApiResponse>("/schemes", data);
        return response.data;
    },

    // Services
    createService: async (data: CreateServiceData) => {
        const response = await api.post<ApiResponse>("/services", data);
        return response.data;
    }
};
