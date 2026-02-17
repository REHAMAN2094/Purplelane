import React, { useState } from 'react';
import { useSchemes, useAllApplications, useUpdateApplicationStatus } from '@/hooks/useApi';
import { API_BASE_URL } from '@/lib/api';


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
    DialogTrigger,
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
    FileText,
    Tag,
    Users,
    CheckCircle2,
    Search,
    Clock,
    XCircle,
    Eye,
    Calendar,
    Filter,
    ClipboardCheck,
    AlertCircle,
} from 'lucide-react';
import { Scheme, SchemeApplication, ApplicationStatus } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

const EmployeeApplications: React.FC = () => {
    const { data: schemes, isLoading: schemesLoading } = useSchemes();
    const { data: applications, isLoading: applicationsLoading } = useAllApplications();
    const updateStatus = useUpdateApplicationStatus();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<SchemeApplication | null>(null);
    const [statusUpdate, setStatusUpdate] = useState<ApplicationStatus>('Submitted');
    const [remarks, setRemarks] = useState('');

    // Filter schemes based on search and category
    const filteredSchemes = schemes?.filter((scheme) => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || scheme.categories.includes(selectedCategory);
        return matchesSearch && matchesCategory;
    }) || [];

    // Get unique categories from all schemes
    const categories = Array.from(new Set(schemes?.flatMap((s) => s.categories) || []));

    // Filter applications to only include those that belong to existing schemes
    const validApplications = applications?.filter(app => {
        const appSchemeId = typeof app.scheme_id === 'string' ? app.scheme_id : app.scheme_id?._id;
        return schemes?.some(s => s._id === appSchemeId);
    }) || [];

    // Get applications for selected scheme
    const schemeApplications = selectedScheme
        ? applications?.filter((app) => {
            const schemeId = typeof app.scheme_id === 'string' ? app.scheme_id : app.scheme_id?._id;
            return schemeId === selectedScheme._id;
        }) || []
        : [];

    // Calculate stats using valid applications only
    const stats = {
        total: validApplications.length,
        pending: validApplications.filter((a) => a.status === 'Submitted').length,
        verified: validApplications.filter((a) => a.status === 'Resolved').length,
        rejected: validApplications.filter((a) => a.status === 'Rejected').length,
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

    if (schemesLoading || applicationsLoading) {
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
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <ClipboardCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">Applications Management</h1>
                </div>
                <p className="text-muted-foreground">
                    View schemes and manage citizen applications
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Applications</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Clock className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-xs text-muted-foreground">Pending</p>
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
                                <p className="text-2xl font-bold">{stats.verified}</p>
                                <p className="text-xs text-muted-foreground">Verified</p>
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

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search schemes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by category" />
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

            {/* Schemes Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Available Schemes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.length > 0 ? (
                        filteredSchemes.map((scheme) => {
                            const applicationsCount = applications?.filter((app) => {
                                const schemeId = typeof app.scheme_id === 'string' ? app.scheme_id : app.scheme_id?._id;
                                return schemeId === scheme._id;
                            }).length || 0;

                            return (
                                <Card key={scheme._id} className="glass-card hover-lift">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold">{scheme.name}</CardTitle>
                                        <FileText className="h-5 w-5 text-primary" />
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

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                    <CheckCircle2 className={cn('mr-2 h-4 w-4', scheme.is_active ? 'text-green-500' : 'text-gray-400')} />
                                                    {scheme.is_active ? 'Active' : 'Inactive'}
                                                </div>
                                                <Badge variant="outline">
                                                    {applicationsCount} Application{applicationsCount !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full mt-2"
                                                onClick={() => setSelectedScheme(scheme)}
                                            >
                                                View Applications
                                            </Button>

                                            <div className="mt-2 text-xs text-muted-foreground">
                                                Created: {new Date(scheme.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No schemes found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Applications Dialog */}
            <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedScheme?.name} - Applications</DialogTitle>
                        <DialogDescription>
                            Manage citizen applications for this scheme
                        </DialogDescription>
                    </DialogHeader>

                    {schemeApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
                            <p className="text-muted-foreground">
                                No citizens have applied for this scheme yet.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Application No</TableHead>
                                        <TableHead>Applied On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Documents</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schemeApplications.map((app) => {
                                        const status = statusConfig[app.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <TableRow key={app._id}>
                                                <TableCell className="font-mono text-sm">
                                                    {app.application_no}
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
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {app.documents.slice(0, 2).map((doc, i) => (
                                                            <Badge key={i} variant="secondary" className="text-xs">
                                                                {doc.file_name}
                                                            </Badge>
                                                        ))}
                                                        {app.documents.length > 2 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{app.documents.length - 2} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedApplication(app);
                                                            setStatusUpdate(app.status);
                                                            setRemarks(app.remarks || '');
                                                        }}
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

            {/* Application Details & Status Update Dialog */}
            <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>
                            {selectedApplication?.application_no}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedApplication && (
                        <div className="space-y-4 py-4">
                            <div>
                                <span className="text-sm text-muted-foreground">Applied On</span>
                                <p className="font-medium">
                                    {format(new Date(selectedApplication.createdAt), 'dd MMMM yyyy, hh:mm a')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Submitted Documents ({selectedApplication.documents?.length || 0})
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    {selectedApplication.documents?.map((doc: any, index: number) => (
                                        <div key={index} className="space-y-2">
                                            <div className="p-2 border rounded-xl bg-muted/30 overflow-hidden">
                                                {doc.file_type?.startsWith('image/') ? (
                                                    <img
                                                        src={`${API_BASE_URL}/scheme-applications/${selectedApplication._id}/document/${index}`}
                                                        alt={doc.file_name}
                                                        className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                                                        onClick={() => window.open(`${API_BASE_URL}/scheme-applications/${selectedApplication._id}/document/${index}?token=${localStorage.getItem('auth_token')}`)}
                                                    />

                                                ) : (
                                                    <div
                                                        className="w-full h-32 flex flex-col items-center justify-center bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                                                        onClick={() => window.open(`${API_BASE_URL}/scheme-applications/${selectedApplication._id}/document/${index}?token=${localStorage.getItem('auth_token')}`)}
                                                    >

                                                        <FileText className="h-8 w-8 text-primary mb-2" />
                                                        <span className="text-xs font-medium px-2 text-center truncate w-full">
                                                            {doc.file_name}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {doc.file_type?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground truncate px-1">
                                                {doc.file_name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="space-y-2">
                                <label className="text-sm font-medium">Update Status</label>
                                <Select value={statusUpdate} onValueChange={(value) => setStatusUpdate(value as ApplicationStatus)}>
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
                                <label className="text-sm font-medium">Remarks</label>
                                <Textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add remarks for the applicant..."
                                    rows={3}
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
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeeApplications;
