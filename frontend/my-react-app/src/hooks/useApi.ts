import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { apiMultipart } from '@/lib/api';
import { 
  Scheme, 
  SchemeApplication, 
  Service, 
  ServiceApplication,
  Complaint, 
  Feedback,
  Department,
  Employee,
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
      const response = await api.get<ApiResponse<Scheme[]>>('/schemes');
      return response.data.data || [];
    },
  });
};

export const useScheme = (id: string) => {
  return useQuery({
    queryKey: ['scheme', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Scheme>>(`/schemes/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateScheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Scheme>) => {
      const response = await api.post<ApiResponse<Scheme>>('/schemes', data);
      return response.data.data;
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
      const response = await api.get<ApiResponse<Department[]>>('/departments');
      return response.data.data || [];
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await api.post<ApiResponse<Department>>('/departments', data);
      return response.data.data;
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
      const response = await api.get<ApiResponse<Employee[]>>('/employees');
      return response.data.data || [];
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      designation: string; 
      department: string; 
      username: string; 
      password: string;
    }) => {
      const response = await api.post<ApiResponse<Employee>>('/employees', data);
      return response.data.data;
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