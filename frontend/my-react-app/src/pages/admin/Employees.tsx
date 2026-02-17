import React, { useState } from 'react';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useDepartments } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Briefcase, Building2, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Employees: React.FC = () => {
    const { user } = useAuth();
    const { data: employees, isLoading } = useEmployees();
    const { data: departments } = useDepartments();
    const createEmployee = useCreateEmployee();
    const updateEmployee = useUpdateEmployee();
    const deleteEmployee = useDeleteEmployee();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        department_name: '',
        phone: '',
        email: '',
        role: 'Clerk',
        username: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        if (editingEmployee) {
            // Update existing employee
            updateEmployee.mutate({ id: editingEmployee._id, data: formData }, {
                onSuccess: () => {
                    toast.success('Employee updated successfully');
                    resetForm();
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to update employee');
                },
            });
        } else {
            // Backend expects admin_id
            createEmployee.mutate({ ...formData, admin_id: user.id }, {
                onSuccess: () => {
                    toast.success('Employee created successfully');
                    resetForm();
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to create employee');
                },
            });
        }
    };

    const resetForm = () => {
        setIsDialogOpen(false);
        setEditingEmployee(null);
        setFormData({
            name: '',
            designation: '',
            department_name: '',
            phone: '',
            email: '',
            role: 'Clerk',
            username: '',
            password: '',
        });
    };

    const handleEdit = (emp: any) => {
        setEditingEmployee(emp);
        setFormData({
            name: emp.name,
            designation: emp.designation,
            department_name: (emp.department_id && typeof emp.department_id === 'object') ? emp.department_id.name : '',
            phone: emp.phone,
            email: emp.email,
            role: emp.role,
            username: '',
            password: '',
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete employee "${name}"? This will also delete their login credentials.`)) {
            deleteEmployee.mutate(id, {
                onSuccess: () => {
                    toast.success('Employee deleted successfully');
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to delete employee');
                },
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDepartmentChange = (value: string) => {
        setFormData({ ...formData, department_name: value });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">Employees</h1>
                    <p className="text-muted-foreground">Manage authorized personnel</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                            <DialogDescription>
                                {editingEmployee ? 'Update employee details below.' : 'Create a new employee account. They will be able to log in with these credentials.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Designation</label>
                                    <Input name="designation" value={formData.designation} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department</label>
                                    <Select onValueChange={handleDepartmentChange} value={formData.department_name}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments?.map((dept) => (
                                                <SelectItem key={dept._id} value={dept.name}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select onValueChange={(value) => setFormData({ ...formData, role: value })} value={formData.role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Clerk">Clerk</SelectItem>
                                        <SelectItem value="Officer">Officer</SelectItem>
                                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Username</label>
                                <Input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required={!editingEmployee}
                                    disabled={!!editingEmployee}
                                    placeholder={editingEmployee ? 'Cannot change username' : ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password {editingEmployee && '(leave blank to keep current)'}</label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!editingEmployee}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={createEmployee.isPending || updateEmployee.isPending}>
                                {editingEmployee
                                    ? (updateEmployee.isPending ? 'Updating...' : 'Update Employee')
                                    : (createEmployee.isPending ? 'Creating...' : 'Create Employee')
                                }
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees && employees.length > 0 ? (
                    employees.map((emp) => (
                        <Card key={emp._id} className="glass-card hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold">{emp.name}</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(emp)}
                                        className="h-8 w-8"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(emp._id, emp.name)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        {emp.designation}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        {(emp.department_id && typeof emp.department_id === 'object') ? emp.department_id.name : 'Unknown Dept'}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Phone className="mr-2 h-4 w-4" />
                                        {emp.phone}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Mail className="mr-2 h-4 w-4" />
                                        {emp.email}
                                    </div>
                                    <div className="mt-2 text-xs bg-secondary/50 px-2 py-1 rounded inline-block">
                                        Login: {(emp.login_id && typeof emp.login_id === 'object') ? emp.login_id.username : 'N/A'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No employees found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employees;
