import React, { useState } from 'react';
import { useComplaints, useUpdateComplaintStatus } from '@/hooks/useApi';
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
    MessageSquare,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eye,
    Calendar,
    Filter,
    ClipboardCheck,
    User,
    Tag,
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '@/types';
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

const categories = [
    'Roads & Infrastructure',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Public Safety',
    'Environment',
    'Other',
];

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
};

const EmployeeComplaints: React.FC = () => {
    const { data: complaints, isLoading } = useComplaints();
    const updateStatus = useUpdateComplaintStatus();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [statusUpdate, setStatusUpdate] = useState<ComplaintStatus>('Submitted');
    const [remarks, setRemarks] = useState('');

    // Filter complaints based on search, category, and status
    const filteredComplaints = complaints?.filter((complaint) => {
        const matchesSearch =
            complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.complaint_no.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    }) || [];

    // Calculate stats
    const stats = {
        total: complaints?.length || 0,
        submitted: complaints?.filter((c) => c.status === 'Submitted').length || 0,
        inProgress: complaints?.filter((c) => c.status === 'In Progress').length || 0,
        resolved: complaints?.filter((c) => c.status === 'Resolved').length || 0,
    };

    const handleUpdateStatus = () => {
        if (!selectedComplaint) return;

        updateStatus.mutate(
            { id: selectedComplaint._id, status: statusUpdate, remarks },
            {
                onSuccess: () => {
                    toast.success(`Complaint status updated to ${statusUpdate}`);
                    setSelectedComplaint(null);
                    setRemarks('');
                    setStatusUpdate('Submitted');
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || 'Failed to update complaint status');
                },
            }
        );
    };

    const openComplaintDetails = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setStatusUpdate(complaint.status);
        setRemarks(complaint.remarks || '');
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
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-warning/10">
                        <MessageSquare className="h-6 w-6 text-warning" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">Complaints Management</h1>
                </div>
                <p className="text-muted-foreground">
                    View and manage citizen complaints
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">Total Complaints</p>
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
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search complaints by title, description, or number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
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
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Complaints Table */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>All Complaints</CardTitle>
                    <CardDescription>
                        Manage and track citizen complaints
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredComplaints.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No complaints found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'No complaints have been submitted yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Complaint No</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Submitted On</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredComplaints.map((complaint) => {
                                        const status = statusConfig[complaint.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <TableRow key={complaint._id}>
                                                <TableCell className="font-mono text-sm">
                                                    {complaint.complaint_no}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium line-clamp-1">{complaint.title}</p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                                            {complaint.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">
                                                        <Tag className="h-3 w-3 mr-1" />
                                                        {complaint.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(complaint.createdAt), 'dd MMM yyyy')}
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
                                                        onClick={() => openComplaintDetails(complaint)}
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
                </CardContent>
            </Card>

            {/* Complaint Details & Status Update Dialog */}
            <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedComplaint?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedComplaint?.complaint_no}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedComplaint && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">Category</span>
                                    <p className="font-medium">{selectedComplaint.category}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Submitted On</span>
                                    <p className="font-medium">
                                        {format(new Date(selectedComplaint.createdAt), 'dd MMMM yyyy, hh:mm a')}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground">Description</span>
                                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                                    {selectedComplaint.description}
                                </p>
                            </div>

                            {selectedComplaint.image && (
                                <div>
                                    <span className="text-sm text-muted-foreground">Attached Image</span>
                                    <div className="mt-2 p-2 border rounded-lg">
                                        <img
                                            src={`http://localhost:5000/api/complaints/${selectedComplaint._id}/image`}
                                            alt="Complaint attachment"
                                            className="max-w-full h-auto rounded"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4 space-y-4">
                                <h3 className="font-semibold">Update Status</h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        value={statusUpdate}
                                        onValueChange={(value) => setStatusUpdate(value as ComplaintStatus)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Submitted">Submitted</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Remarks</label>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Add remarks for the citizen..."
                                        rows={3}
                                    />
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={handleUpdateStatus}
                                    disabled={updateStatus.isPending}
                                >
                                    {updateStatus.isPending ? 'Updating...' : 'Update Complaint'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeeComplaints;
