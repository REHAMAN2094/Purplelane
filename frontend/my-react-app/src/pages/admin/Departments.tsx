import React, { useState } from 'react';
import { useDepartments, useCreateDepartment } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Building2, Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';

const Departments: React.FC = () => {
    const { user } = useAuth();
    const { data: departments, isLoading } = useDepartments();
    const createDepartment = useCreateDepartment();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contact_email: '',
        contact_phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        createDepartment.mutate({ ...formData, admin_id: user.id }, {
            onSuccess: () => {
                toast.success('Department created successfully');
                setIsDialogOpen(false);
                setFormData({
                    name: '',
                    description: '',
                    contact_email: '',
                    contact_phone: '',
                });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to create department');
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">Departments</h1>
                    <p className="text-muted-foreground">Manage village departments</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Department</DialogTitle>
                            <DialogDescription>
                                Create a new department for the village administration.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Health Department"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the department's responsibilities"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact Email</label>
                                    <Input
                                        name="contact_email"
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={handleChange}
                                        placeholder="dept@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact Phone</label>
                                    <Input
                                        name="contact_phone"
                                        value={formData.contact_phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 890"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={createDepartment.isPending}>
                                {createDepartment.isPending ? 'Creating...' : 'Create Department'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments && departments.length > 0 ? (
                    departments.map((dept) => (
                        <Card key={dept._id} className="glass-card hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold">{dept.name}</CardTitle>
                                <Building2 className="h-5 w-5 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {dept.description}
                                </p>
                                <div className="space-y-2">
                                    {dept.contact_email && (
                                        <div className="flex items-center text-sm">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {dept.contact_email}
                                        </div>
                                    )}
                                    {dept.contact_phone && (
                                        <div className="flex items-center text-sm">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {dept.contact_phone}
                                        </div>
                                    )}
                                    {dept.created_by && (
                                        <div className="flex items-center text-sm">
                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                            Created by: {typeof dept.created_by === 'object' ? dept.created_by.username : dept.created_by}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No departments found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Departments;
