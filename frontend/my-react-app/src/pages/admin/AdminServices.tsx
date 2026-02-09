import React, { useState } from 'react';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ClipboardList,
    Search,
    Plus,
    Edit,
    Trash2,
    FileText,
    Calendar,
    Tag,
    Clock,
} from 'lucide-react';
import { Service } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

const categories = ['Certificate', 'Identity', 'Land', 'Welfare', 'Other'];

const AdminServices: React.FC = () => {
    const { data: services, isLoading } = useServices();
    const createService = useCreateService();
    const updateService = useUpdateService();
    const deleteService = useDeleteService();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: 'Certificate',
        description: '',
        required_documents: '',
        processing_days: '',
    });

    // Filter services
    const filteredServices = services?.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    // Calculate stats
    const stats = {
        total: services?.length || 0,
        active: services?.filter((s) => s.is_active).length || 0,
        certificate: services?.filter((s) => s.category === 'Certificate').length || 0,
        identity: services?.filter((s) => s.category === 'Identity').length || 0,
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Certificate',
            description: '',
            required_documents: '',
            processing_days: '',
        });
    };

    const handleCreate = () => {
        const documentsArray = formData.required_documents
            .split(',')
            .map((doc) => doc.trim())
            .filter((doc) => doc);

        createService.mutate(
            {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                required_documents: documentsArray,
                processing_days: formData.processing_days ? parseInt(formData.processing_days) : undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Service created successfully');
                    setIsCreateDialogOpen(false);
                    resetForm();
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to create service');
                },
            }
        );
    };

    const openEditDialog = (service: Service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            category: service.category,
            description: service.description || '',
            required_documents: service.required_documents.join(', '),
            processing_days: service.processing_days?.toString() || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedService) return;

        const documentsArray = formData.required_documents
            .split(',')
            .map((doc) => doc.trim())
            .filter((doc) => doc);

        updateService.mutate(
            {
                id: selectedService._id,
                data: {
                    name: formData.name,
                    category: formData.category,
                    description: formData.description,
                    required_documents: documentsArray,
                    processing_days: formData.processing_days ? parseInt(formData.processing_days) : undefined,
                },
            },
            {
                onSuccess: () => {
                    toast.success('Service updated successfully');
                    setIsEditDialogOpen(false);
                    resetForm();
                    setSelectedService(null);
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to update service');
                },
            }
        );
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteService.mutate(id, {
                onSuccess: () => {
                    toast.success('Service deleted successfully');
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to delete service');
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="animate-fade-in space-y-8">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <ClipboardList className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="font-display text-3xl font-bold">Services Management</h1>
                    </div>
                    <p className="text-muted-foreground">Create and manage government services</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Service</DialogTitle>
                            <DialogDescription>Add a new government service</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Service Name *</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Ration Card, PAN Card"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category *</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the service..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Required Documents (comma-separated) *</label>
                                <Textarea
                                    value={formData.required_documents}
                                    onChange={(e) =>
                                        setFormData({ ...formData, required_documents: e.target.value })
                                    }
                                    placeholder="Aadhaar Card, Address Proof, Photos"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Processing Days</label>
                                <Input
                                    type="number"
                                    value={formData.processing_days}
                                    onChange={(e) =>
                                        setFormData({ ...formData, processing_days: e.target.value })
                                    }
                                    placeholder="e.g., 15"
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleCreate}
                                disabled={!formData.name || !formData.required_documents || createService.isPending}
                            >
                                {createService.isPending ? 'Creating...' : 'Create Service'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Services</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <FileText className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.active}</p>
                                <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Tag className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.certificate}</p>
                                <p className="text-xs text-muted-foreground">Certificates</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Tag className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.identity}</p>
                                <p className="text-xs text-muted-foreground">Identity</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
                <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                        <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No services found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery || selectedCategory !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Create your first service to get started'}
                        </p>
                        {!searchQuery && selectedCategory === 'all' && (
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Service
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredServices.map((service) => (
                        <Card key={service._id} className="glass-card hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {service.category}
                                            </Badge>
                                            {service.is_active && (
                                                <Badge className="status-verified text-xs">Active</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {service.description || 'No description provided'}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {service.processing_days ? `${service.processing_days} days` : 'N/A'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    <strong>Required:</strong>{' '}
                                    {service.required_documents.slice(0, 2).join(', ')}
                                    {service.required_documents.length > 2 && '...'}
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openEditDialog(service)}
                                    >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(service._id, service.name)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>Update service details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Service Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category *</label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Required Documents (comma-separated) *</label>
                            <Textarea
                                value={formData.required_documents}
                                onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Processing Days</label>
                            <Input
                                type="number"
                                value={formData.processing_days}
                                onChange={(e) => setFormData({ ...formData, processing_days: e.target.value })}
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleUpdate}
                            disabled={!formData.name || !formData.required_documents || updateService.isPending}
                        >
                            {updateService.isPending ? 'Updating...' : 'Update Service'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminServices;
