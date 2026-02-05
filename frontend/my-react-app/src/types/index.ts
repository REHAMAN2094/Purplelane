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
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  is_active: boolean;
  createdAt: string;
}

// Employee
export interface CreateEmployeeData {
  name: string;
  username: string;
  password?: string;
  designation: string;
  department_name: string;
  role: string;
}

export interface Employee {
  _id: string;
  name: string;
  designation: string;
  department: string | Department;
  username: string;
  is_active: boolean;
  createdAt: string;
}

// Scheme
export interface CreateSchemeData {
  name: string;
  categories: string[];
  benefits: string;
  required_documents?: string[];
}

export interface Scheme {
  _id: string;
  name: string;
  description: string;
  benefits: string;
  eligibility_criteria: string[];
  required_documents: string[];
  is_active: boolean;
  categories: string[];
  icon?: string;
  createdAt: string;
}

// Service
export interface CreateServiceData {
  name: string;
  required_documents: string[];
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  required_documents: string[];
  is_active: boolean;
  createdAt: string;
}

// Applications
export type ApplicationStatus = 'Pending' | 'Verified' | 'Rejected';

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

export interface ServiceApplication {
  _id: string;
  service_id: string | Service;
  citizen_id: string;
  status: ApplicationStatus;
  application_no: string;
  documents: { file_name: string; file_path: string }[];
  remarks?: string;
  createdAt: string;
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