import React from 'react';
import { useMyApplications } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SchemeApplication, Scheme } from '@/types';
import { format } from 'date-fns';

// Mock data for demo
const mockApplications: SchemeApplication[] = [
  {
    _id: '1',
    scheme_id: {
      _id: '1',
      name: 'PM Kisan Samman Nidhi',
      description: 'Direct income support',
      benefits: '',
      eligibility_criteria: [],
      required_documents: [],
      is_active: true,
      categories: ['Agriculture'],
      createdAt: new Date().toISOString(),
    },
    citizen_id: 'user1',
    status: 'Pending',
    application_no: 'APP-2024-001234',
    documents: [
      { file_name: 'Aadhar Card', file_path: '/docs/aadhar.pdf' },
      { file_name: 'Land Document', file_path: '/docs/land.pdf' },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    scheme_id: {
      _id: '2',
      name: 'Ayushman Bharat Yojana',
      description: 'Free healthcare coverage',
      benefits: '',
      eligibility_criteria: [],
      required_documents: [],
      is_active: true,
      categories: ['Healthcare'],
      createdAt: new Date().toISOString(),
    },
    citizen_id: 'user1',
    status: 'Verified',
    application_no: 'APP-2024-001122',
    documents: [
      { file_name: 'Aadhar Card', file_path: '/docs/aadhar.pdf' },
      { file_name: 'Ration Card', file_path: '/docs/ration.pdf' },
    ],
    remarks: 'All documents verified successfully. Eligible for the scheme.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    scheme_id: {
      _id: '3',
      name: 'PM Awas Yojana',
      description: 'Affordable housing',
      benefits: '',
      eligibility_criteria: [],
      required_documents: [],
      is_active: true,
      categories: ['Housing'],
      createdAt: new Date().toISOString(),
    },
    citizen_id: 'user1',
    status: 'Rejected',
    application_no: 'APP-2024-000987',
    documents: [
      { file_name: 'Income Certificate', file_path: '/docs/income.pdf' },
    ],
    remarks: 'Income exceeds the eligibility limit. Please reapply with updated documents.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const statusConfig = {
  Pending: {
    icon: Clock,
    className: 'status-pending',
    label: 'Pending Review',
  },
  Verified: {
    icon: CheckCircle2,
    className: 'status-verified',
    label: 'Approved',
  },
  Rejected: {
    icon: XCircle,
    className: 'status-rejected',
    label: 'Rejected',
  },
};

const MyApplications: React.FC = () => {
  const { data: apiApplications, isLoading, error } = useMyApplications();

  // Use mock data if API returns empty
  const applications = apiApplications?.length ? apiApplications : mockApplications;

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'Pending').length,
    verified: applications.filter((a) => a.status === 'Verified').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">My Applications</h1>
        </div>
        <p className="text-muted-foreground">
          Track the status of your scheme applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                <p className="text-xs text-muted-foreground">Approved</p>
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

      {/* Applications Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            View all your submitted applications and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
              <p className="text-muted-foreground">
                Start by exploring schemes and submitting your first application
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application No</TableHead>
                    <TableHead>Scheme</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => {
                    const scheme = typeof app.scheme_id === 'object' ? app.scheme_id : null;
                    const status = statusConfig[app.status];
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={app._id}>
                        <TableCell className="font-mono text-sm">
                          {app.application_no}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{scheme?.name || 'Unknown Scheme'}</p>
                            <p className="text-xs text-muted-foreground">
                              {scheme?.categories?.join(', ')}
                            </p>
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
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {app.remarks || '-'}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                                <DialogDescription>
                                  {app.application_no}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Status</span>
                                  <Badge className={status.className}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {status.label}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Scheme</span>
                                  <p className="font-medium">{scheme?.name}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Applied On</span>
                                  <p className="font-medium">
                                    {format(new Date(app.createdAt), 'dd MMMM yyyy, hh:mm a')}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Documents</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {app.documents.map((doc, i) => (
                                      <Badge key={i} variant="secondary">
                                        {doc.file_name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {app.remarks && (
                                  <div className="p-3 bg-muted rounded-lg">
                                    <span className="text-sm font-medium">Remarks</span>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {app.remarks}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
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
    </div>
  );
};

export default MyApplications;