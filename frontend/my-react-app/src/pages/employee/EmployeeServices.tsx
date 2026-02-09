import React, { useState } from 'react';
import { useServices, useServiceApplications, useUpdateServiceApplicationStatus } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
    Eye,
    Calendar,
    User,
    Tag,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    MessageSquare,
    Users,
    Filter,
} from 'lucide-react';
import { Service, ServiceApplication, ServiceApplicationStatus } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const statusConfig = {
    Submitted: {
        icon: AlertCircle,
        className: 'status-pending',
        label: 'Submitted',
    },
    'In Progress': {
        icon: Clock,
        className: 'status-in-progress',
        label: 'In Progress',
    },
    Resolved: {
        icon: CheckCircle2,
        className: 'status-verified',
        label: 'Resolved',
    },
    Rejected: {
        icon: XCircle,
        className: 'status-rejected',
        label: 'Rejected',
    },
};

const EmployeeServices: React.FC = () => {
    const { data: services, isLoading: servicesLoading } = useServices();
    const { data: applications, isLoading: applicationsLoading } = useServiceApplications();
    const updateStatus = useUpdateServiceApplicationStatus();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<ServiceApplication | null>(null);
    const [statusUpdate, setStatusUpdate] = useState<ServiceApplicationStatus>('Submitted');
    const [remarks, setRemarks] = useState('');

    // Filter services based on search and category
    const filteredServices = services?.filter((service) => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    // Get unique categories from all services
    const categories = Array.from(new Set(services?.map((s) => s.category) || []));

    // Get applications for selected service
    const serviceApplications = selectedService
        ? applications?.filter((app) => {
            const serviceId = typeof app.service_id === 'string' ? app.service_id : app.service_id?._id;
            return serviceId === selectedService._id;
        }) || []
        : [];

    // Calculate stats
    const stats = {
        total: applications?.length || 0,
        submitted: applications?.filter((a) => a.status === 'Submitted').length || 0,
        inProgress: applications?.filter((a) => a.status === 'In Progress').length || 0,
        resolved: applications?.filter((a) => a.status === 'Resolved').length || 0,
        rejected: applications?.filter((a) => a.status === 'Rejected').length || 0,
    };

    const handleUpdateStatus = () => {
        if (!selectedApplication) return;

        updateStatus.mutate(
            { id: selectedApplication._id, status: statusUpdate, remarks },
            {
                onSuccess: () => {
                    toast.success(`Application status updated to ${statusUpdate}`);
                    setSelectedApplication(null);
                    setRemarks('');
                    setStatusUpdate('Submitted');
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to update application status');
                },
            }
        );
    };

    const openApplicationDetails = (app: ServiceApplication) => {
        setSelectedApplication(app);
        setStatusUpdate(app.status as ServiceApplicationStatus);
        setRemarks(app.remarks || '');
    };

    if (servicesLoading || applicationsLoading) {
        return (
            <div className="animate-fade-in space-y-8">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {[...Array(5)].map((_, i) => (
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
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <ClipboardList className="h-6 w-6 text-blue-500" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">Service Management</h1>
                </div>
                <p className="text-muted-foreground">
                    View services and manage citizen applications
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <AlertCircle className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.submitted}</p>
                                <p className="text-xs text-muted-foreground">Submitted</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Clock className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.inProgress}</p>
                                <p className="text-xs text-muted-foreground">In Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.resolved}</p>
                                <p className="text-xs text-muted-foreground">Resolved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-destructive/10">
                                <XCircle className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.rejected}</p>
                                <p className="text-xs text-muted-foreground">Rejected</p>
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
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Categories" />
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
            </div>

            {/* Services Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Available Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => {
                            const applicationsCount = applications?.filter((app) => {
                                const serviceId = typeof app.service_id === 'string' ? app.service_id : app.service_id?._id;
                                return serviceId === service._id;
                            }).length || 0;

                            return (
                                <Card key={service._id} className="glass-card hover-lift">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                                        <Tag className="h-5 w-5 text-primary" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {service.description || 'No description available'}
                                            </p>

                                            <div className="flex flex-wrap gap-1">
                                                <Badge variant="secondary" className="text-xs text-blue-600 bg-blue-50">
                                                    <Tag className="mr-1 h-3 w-3" />
                                                    {service.category}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <Clock className="mr-2 h-4 w-4" />
                                                    {service.processing_days || 'N/A'} days
                                                </div>
                                                <Badge variant="outline" className="bg-primary/5">
                                                    {applicationsCount} Application{applicationsCount !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full mt-2"
                                                onClick={() => setSelectedService(service)}
                                            >
                                                View Applications
                                                <Eye className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg">No services found</h3>
                            <p className="text-muted-foreground">Adjust your search or category filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Applications List Dialog */}
            <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedService?.name} - Applications</DialogTitle>
                        <DialogDescription>
                            Review and process citizen applications for this service
                        </DialogDescription>
                    </DialogHeader>

                    {serviceApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
                            <p className="text-muted-foreground">
                                No citizens have applied for this service yet.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Application No</TableHead>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Applied On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {serviceApplications.map((app) => {
                                        const status = statusConfig[app.status];
                                        const StatusIcon = status.icon;
                                        const citizen = typeof app.citizen_id === 'object' ? app.citizen_id : null;
                                        const citizenName = (citizen as any)?.name || 'Unknown';

                                        return (
                                            <TableRow key={app._id}>
                                                <TableCell className="font-mono text-sm">
                                                    {app.application_no}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {citizenName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(app.createdAt), 'dd MMM yyyy')}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={status.className}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openApplicationDetails(app)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Application Detail & Status Update Dialog (Sibling) */}
            <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>
                            {selectedApplication?.application_no}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedApplication && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</span>
                                    <p className="font-medium">
                                        {typeof selectedApplication.service_id === 'object'
                                            ? (selectedApplication.service_id as any).name
                                            : selectedService?.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applicant</span>
                                    <p className="font-medium">
                                        {typeof selectedApplication.citizen_id === 'object'
                                            ? (selectedApplication.citizen_id as any).name
                                            : 'Unknown Citizen'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applied On</span>
                                    <p className="font-medium">
                                        {format(new Date(selectedApplication.createdAt), 'dd MMMM yyyy, hh:mm a')}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Status</span>
                                    <Badge className={statusConfig[selectedApplication.status].className + " block w-fit"}>
                                        {statusConfig[selectedApplication.status].label}
                                    </Badge>
                                </div>
                            </div>

                            {/* Form Data */}
                            {selectedApplication.form_data && Object.keys(selectedApplication.form_data).length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4" />
                                        Application Form Details
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                                        {Object.entries(selectedApplication.form_data).map(([key, value]: [string, any]) => (
                                            <div key={key} className="space-y-0.5">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                <p className="text-sm font-medium">{value?.toString() || '-'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status Update Form */}
                            <div className="border-t pt-6 space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    Update Application Status
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Status</label>
                                    <Select
                                        value={statusUpdate}
                                        onValueChange={(value) => setStatusUpdate(value as ServiceApplicationStatus)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Submitted">Submitted</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Admin Remarks</label>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Add remarks for the applicant..."
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={handleUpdateStatus}
                                    disabled={updateStatus.isPending}
                                >
                                    {updateStatus.isPending ? 'Updating...' : 'Update Application'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeeServices;
