import React, { useState } from 'react';
import { useSchemes, useCreateScheme, useUpdateScheme, useDeleteScheme } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Tag, Users, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Scheme } from '@/types';

const Schemes: React.FC = () => {
    const { user } = useAuth();
    const { data: schemes, isLoading } = useSchemes();
    const createScheme = useCreateScheme();
    const updateScheme = useUpdateScheme();
    const deleteScheme = useDeleteScheme();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        state: 'Andhra Pradesh',
        categories: '',
        short_description: '',
        description: '',
        benefits: '',
        eligibility_criteria: '',
        target_group: '',
        required_documents: '',
        application_steps: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        // Convert comma-separated strings to arrays
        const schemeData = {
            name: formData.name,
            state: formData.state,
            categories: formData.categories.split(',').map(c => c.trim()).filter(c => c),
            short_description: formData.short_description,
            description: formData.description,
            benefits: formData.benefits,
            eligibility_criteria: formData.eligibility_criteria.split('\n').map(c => c.trim()).filter(c => c),
            target_group: formData.target_group,
            required_documents: formData.required_documents.split('\n').map(d => d.trim()).filter(d => d),
            application_steps: formData.application_steps
                ? formData.application_steps.split('\n')
                    .map((step, index) => ({ step_no: index + 1, step_text: step.trim() }))
                    .filter(s => s.step_text)
                : [],
        };

        if (editingScheme) {
            // Update existing scheme
            updateScheme.mutate({ id: editingScheme._id, data: schemeData }, {
                onSuccess: () => {
                    toast.success('Scheme updated successfully');
                    resetForm();
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to update scheme');
                },
            });
        } else {
            // Create new scheme
            createScheme.mutate(schemeData, {
                onSuccess: () => {
                    toast.success('Scheme created successfully');
                    resetForm();
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to create scheme');
                },
            });
        }
    };

    const resetForm = () => {
        setIsDialogOpen(false);
        setEditingScheme(null);
        setFormData({
            name: '',
            state: 'Andhra Pradesh',
            categories: '',
            short_description: '',
            description: '',
            benefits: '',
            eligibility_criteria: '',
            target_group: '',
            required_documents: '',
            application_steps: '',
        });
    };

    const handleEdit = (scheme: Scheme) => {
        setEditingScheme(scheme);
        setFormData({
            name: scheme.name,
            state: scheme.state,
            categories: scheme.categories.join(', '),
            short_description: scheme.short_description || '',
            description: scheme.description,
            benefits: scheme.benefits,
            eligibility_criteria: scheme.eligibility_criteria.join('\n'),
            target_group: scheme.target_group || '',
            required_documents: scheme.required_documents.join('\n'),
            application_steps: scheme.application_steps?.map(s => s.step_text).join('\n') || '',
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            deleteScheme.mutate(id, {
                onSuccess: () => {
                    toast.success('Scheme deleted successfully');
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to delete scheme');
                },
            });
        }
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
                    <h1 className="font-display text-3xl font-bold mb-2">Schemes</h1>
                    <p className="text-muted-foreground">Manage government welfare schemes</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Scheme
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingScheme ? 'Edit Scheme' : 'Add New Scheme'}</DialogTitle>
                            <DialogDescription>
                                {editingScheme ? 'Update the scheme details below.' : 'Create a new government welfare scheme for citizens.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Scheme Name *</label>
                                    <Input name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State</label>
                                    <Input name="state" value={formData.state} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categories (comma-separated) *</label>
                                <Input name="categories" value={formData.categories} onChange={handleChange} placeholder="Social Welfare, Education Support" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Short Description</label>
                                <Textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={2} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Description *</label>
                                <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Benefits *</label>
                                <Textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={2} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Group</label>
                                <Input name="target_group" value={formData.target_group} onChange={handleChange} placeholder="School children and mothers" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Eligibility Criteria (one per line) *</label>
                                <Textarea name="eligibility_criteria" value={formData.eligibility_criteria} onChange={handleChange} rows={3} placeholder="Resident of Andhra Pradesh&#10;School-going children" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Required Documents (one per line) *</label>
                                <Textarea name="required_documents" value={formData.required_documents} onChange={handleChange} rows={3} placeholder="Aadhaar&#10;School ID&#10;Bank Passbook" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Application Steps (one per line)</label>
                                <Textarea name="application_steps" value={formData.application_steps} onChange={handleChange} rows={4} placeholder="Login to portal&#10;Select scheme&#10;Submit details&#10;Upload documents" />
                            </div>

                            <Button type="submit" className="w-full" disabled={createScheme.isPending || updateScheme.isPending}>
                                {editingScheme
                                    ? (updateScheme.isPending ? 'Updating...' : 'Update Scheme')
                                    : (createScheme.isPending ? 'Creating...' : 'Create Scheme')
                                }
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes && schemes.length > 0 ? (
                    schemes.map((scheme) => (
                        <Card key={scheme._id} className="glass-card hover-lift">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold">{scheme.name}</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(scheme)}
                                        className="h-8 w-8"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(scheme._id, scheme.name)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {scheme.short_description || scheme.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1">
                                        {scheme.categories.map((cat, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                <Tag className="mr-1 h-3 w-3" />
                                                {cat}
                                            </Badge>
                                        ))}
                                    </div>

                                    {scheme.target_group && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Users className="mr-2 h-4 w-4" />
                                            {scheme.target_group}
                                        </div>
                                    )}

                                    <div className="flex items-center text-sm">
                                        <CheckCircle2 className={`mr-2 h-4 w-4 ${scheme.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                                        {scheme.is_active ? 'Active' : 'Inactive'}
                                    </div>

                                    <div className="mt-2 text-xs text-muted-foreground">
                                        Created: {new Date(scheme.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No schemes found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schemes;
