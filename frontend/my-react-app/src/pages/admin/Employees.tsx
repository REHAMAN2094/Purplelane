import React, { useState } from 'react';
import { useEmployees, useCreateEmployee, useDepartments } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Briefcase, Building2, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Employees: React.FC = () => {
    const { user } = useAuth();
    const { data: employees, isLoading } = useEmployees();
    const { data: departments } = useDepartments();
    const createEmployee = useCreateEmployee();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

        // Backend expects admin_id
        createEmployee.mutate({ ...formData, admin_id: user.id }, {
            onSuccess: () => {
                toast.success('Employee created successfully');
                setIsDialogOpen(false);
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
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to create employee');
            },
        });
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
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>
                                Create a new employee account. They will be able to log in with these credentials.
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
                                <Input name="username" value={formData.username} onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
                            </div>

                            <Button type="submit" className="w-full" disabled={createEmployee.isPending}>
                                {createEmployee.isPending ? 'Creating...' : 'Create Employee'}
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
                                <User className="h-5 w-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        {emp.designation}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        {typeof emp.department_id === 'object' ? emp.department_id.name : 'Unknown Dept'}
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
                                        Login: {typeof emp.login_id === 'object' ? emp.login_id.username : 'N/A'}
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
