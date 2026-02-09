import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Layouts
import AdminLayout from "@/components/layouts/AdminLayout";
import EmployeeLayout from "@/components/layouts/EmployeeLayout";
import CitizenLayout from "@/components/layouts/CitizenLayout";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Departments from "@/pages/admin/Departments";
import Employees from "@/pages/admin/Employees";
import Schemes from "@/pages/admin/Schemes";
import AdminServices from "@/pages/admin/AdminServices";

// Employee Pages
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import EmployeeApplications from "@/pages/employee/EmployeeApplications";
import EmployeeComplaints from "@/pages/employee/EmployeeComplaints";
import EmployeeServices from "@/pages/employee/EmployeeServices";

// Citizen Pages
import CitizenHome from "@/pages/citizen/CitizenHome";
import SchemesGallery from "@/pages/citizen/SchemesGallery";
import MyApplications from "@/pages/citizen/MyApplications";
import Complaints from "@/pages/citizen/Complaints";
import Services from "@/pages/citizen/Services";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="departments" element={<Departments />} />
              <Route path="employees" element={<Employees />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="services" element={<AdminServices />} />
            </Route>

            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['Employee']}>
                <EmployeeLayout />
              </ProtectedRoute>
            }>
              <Route index element={<EmployeeDashboard />} />
              <Route path="applications" element={<EmployeeApplications />} />
              <Route path="complaints" element={<EmployeeComplaints />} />
              <Route path="services" element={<EmployeeServices />} />
            </Route>

            {/* Citizen Routes */}
            <Route path="/citizen" element={
              <ProtectedRoute allowedRoles={['Citizen']}>
                <CitizenLayout />
              </ProtectedRoute>
            }>
              <Route index element={<CitizenHome />} />
              <Route path="schemes" element={<SchemesGallery />} />
              <Route path="services" element={<Services />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="complaints" element={<Complaints />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
