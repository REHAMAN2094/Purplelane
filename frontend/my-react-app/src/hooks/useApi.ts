import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { apiMultipart } from '@/lib/api';
import {
  Scheme,
  CreateSchemeData,
  SchemeApplication,
  Service,
  ServiceApplication,
  Complaint,
  Feedback,
  Department,
  CreateDepartmentData,
  Employee,
  CreateEmployeeData,
  AdminDashboardStats,
  EmployeeDashboardStats,
  CitizenDashboardStats,
  ApiResponse
} from '@/types';

// ============ SCHEMES ============
export const useSchemes = () => {
  return useQuery({
    queryKey: ['schemes'],
    queryFn: async () => {
      // Backend returns { count: number, schemes: Scheme[] }
      const response = await api.get<{ count: number; schemes: Scheme[] }>('/admin/scheme');
      return response.data.schemes || [];
    },
  });
};

export const useScheme = (id: string) => {
  return useQuery({
    queryKey: ['scheme', id],
    queryFn: async () => {
      // Backend returns the scheme object directly
      const response = await api.get<Scheme>(`/admin/scheme/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateScheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSchemeData) => {
      const response = await api.post<{ message: string; scheme: Scheme }>('/admin/scheme/create', data);
      return response.data.scheme;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
  });
};

export const useUpdateScheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateSchemeData> }) => {
      const response = await api.put<{ message: string; scheme: Scheme }>(`/admin/scheme/${id}`, data);
      return response.data.scheme;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    },
  });
};

// ============ SCHEME APPLICATIONS ============
export const useMyApplications = () => {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SchemeApplication[]>>('/scheme-applications/my');
      return response.data.data || [];
    },
  });
};

export const useAllApplications = () => {
  return useQuery({
    queryKey: ['all-applications'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SchemeApplication[]>>('/scheme-applications');
      return response.data.data || [];
    },
  });
};

export const useApplyScheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiMultipart.post<ApiResponse<SchemeApplication>>(
        '/scheme-applications/apply',
        formData
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, remarks }: { id: string; status: string; remarks?: string }) => {
      const response = await api.put<ApiResponse<SchemeApplication>>(
        `/scheme-applications/${id}/status`,
        { status, remarks }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
  });
};

// ============ SERVICES ============
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Service[]>>('/services');
      return response.data.data || [];
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Service>) => {
      const response = await api.post<ApiResponse<Service>>('/services', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

// ============ COMPLAINTS ============
export const useComplaints = () => {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Complaint[]>>('/complaints');
      return response.data.data || [];
    },
  });
};

export const useMyComplaints = () => {
  return useQuery({
    queryKey: ['my-complaints'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Complaint[]>>('/complaints/my');
      return response.data.data || [];
    },
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiMultipart.post<ApiResponse<Complaint>>(
        '/complaints',
        formData
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
    },
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, remarks }: { id: string; status: string; remarks?: string }) => {
      const response = await api.put<ApiResponse<Complaint>>(
        `/complaints/${id}/status`,
        { status, remarks }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] });
    },
  });
};

// ============ FEEDBACK ============
export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { complaint_id: string; rating: number; description: string }) => {
      const response = await api.post<ApiResponse<Feedback>>('/feedback', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
};

// ============ DEPARTMENTS ============
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      // Backend returns { count: number, departments: Department[] }
      const response = await api.get<{ count: number; departments: Department[] }>('/admin/departments');
      return response.data.departments || [];
    },
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: async () => {
      // Backend returns the department object directly
      const response = await api.get<Department>(`/admin/department/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDepartmentData) => {
      // Backend returns { message: string, department: Department }
      const response = await api.post<{ message: string; department: Department }>('/admin/department/create', data);
      return response.data.department;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

// ============ EMPLOYEES ============
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      // Backend returns { count: number, employees: Employee[] }
      const response = await api.get<{ count: number; employees: Employee[] }>('/admin/employees');
      return response.data.employees || [];
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      // Backend returns the employee object directly
      const response = await api.get<Employee>(`/admin/employee/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmployeeData) => {
      const response = await api.post<{ message: string; employee: Employee }>('/admin/employee/create', data);
      return response.data.employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// ============ DASHBOARD STATS ============
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminDashboardStats>>('/dashboard/admin');
      return response.data.data;
    },
  });
};

export const useEmployeeDashboard = () => {
  return useQuery({
    queryKey: ['employee-dashboard'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<EmployeeDashboardStats>>('/dashboard/employee');
      return response.data.data;
    },
  });
};

export const useCitizenDashboard = () => {
  return useQuery({
    queryKey: ['citizen-dashboard'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CitizenDashboardStats>>('/dashboard/citizen');
      return response.data.data;
    },
  });
};