// Digital Village Management System - Type Definitions

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  // Some backend responses might put token/role at top level
  token?: string;
  role?: UserRole;
  user?: User;
  id?: string; // used in admin creation
}

// User roles
export type UserRole = 'Admin' | 'Employee' | 'Citizen';

// User
export interface User {
  id: string;
  role: UserRole;
  username: string;
  name?: string;
  phone?: string;
  department?: string;
  designation?: string;
  email?: string;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCitizenData {
  name: string;
  phone: string;
  username: string;
  password: string;
  email?: string;
  gender?: string;
  dob?: string;
  address?: string;
}

export interface RegisterData extends RegisterCitizenData { }

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Department
export interface CreateDepartmentData {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  admin_id: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  contact_email?: string;
  contact_phone?: string;
  created_by?: string | { _id: string; username: string; user_type: string };
  is_active: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

// Employee
// Employee
export interface CreateEmployeeData {
  name: string;
  designation: string;
  department_name: string;
  phone: string;
  email: string;
  role: string;
  username: string;
  password?: string;
  admin_id: string;
}

export interface Employee {
  _id: string;
  name: string;
  designation: string;
  department_id: { _id: string; name: string; description: string } | string;
  login_id: { _id: string; username: string; user_type: string } | string;
  phone: string;
  email: string;
  role: string;
  is_active: boolean;
  createdAt: string;
}

// Scheme
// Scheme
export interface CreateSchemeData {
  name: string;
  state?: string;
  categories: string[];
  short_description?: string;
  description?: string;
  benefits?: string;
  eligibility_criteria: string[];
  target_group?: string;
  required_documents: string[];
  application_steps?: { step_no: number; step_text: string }[];
}

export interface Scheme {
  _id: string;
  name: string;
  state: string;
  categories: string[];
  is_active: boolean;
  short_description?: string;
  description: string;
  benefits: string;
  eligibility_criteria: string[];
  target_group?: string;
  required_documents: string[];
  application_steps?: { step_no: number; step_text: string }[];
  created_by?: string | { _id: string; username: string; user_type: string };
  createdAt: string;
  updatedAt?: string;
  icon?: string;
}

// Applications
export type ApplicationStatus = 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';

export interface SchemeApplication {
  _id: string;
  scheme_id: string | Scheme;
  citizen_id: string;
  status: ApplicationStatus;
  application_no: string;
  documents: { file_name: string; file_path: string }[];
  remarks?: string;
  createdAt: string;
}

// Service
export interface Service {
  _id: string;
  name: string;
  category: 'Certificate' | 'Identity' | 'Land' | 'Welfare' | 'Other';
  description?: string;
  required_documents: string[];
  processing_days?: number;
  is_active: boolean;
  created_by?: string | { _id: string; username: string };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServiceData {
  name: string;
  category: string;
  description?: string;
  required_documents: string[];
  processing_days?: number;
}

// Service Application
export type ServiceApplicationStatus = 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';

export interface ServiceApplication {
  _id: string;
  service_id: string | Service;
  citizen_id: string | { _id: string; name: string; phone: string };
  application_no: string;
  form_data?: any;
  status: ServiceApplicationStatus;
  remarks?: string;
  verified_by?: string | { _id: string; name: string };
  createdAt: string;
  updatedAt?: string;
}

// Complaint
export type ComplaintStatus = 'Submitted' | 'In Progress' | 'Resolved';

export interface Complaint {
  _id: string;
  complaint_no: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  category: string;
  image?: string;
  assigned_to?: string | Employee;
  citizen_id: string;
  remarks?: string;
  createdAt: string;
}

// Feedback
export interface Feedback {
  _id: string;
  complaint_id: string | Complaint;
  citizen_id: string;
  rating: number;
  description: string;
  createdAt: string;
}

// Dashboard Stats
export interface AdminDashboardStats {
  total_citizens?: number;
  total_complaints?: number;
  resolved_complaints?: number;
  // Mapping potential variations
  totalCitizens?: number;
  totalComplaints?: number;
  resolvedComplaints?: number;
}

export interface EmployeeDashboardStats {
  pendingApplications: number;
  verifiedApplications: number;
  assignedComplaints: number;
  resolvedComplaints: number;
}

export interface CitizenDashboardStats {
  myApplications: number;
  pendingApplications: number;
  myComplaints: number;
  resolvedComplaints: number;
}