import React, { useState } from 'react';
import { useMyApplications, useMyServiceApplications } from '@/hooks/useApi';
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
  Tag,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SchemeApplication, ServiceApplication } from '@/types';
import { format } from 'date-fns';

const statusConfig: any = {
  Submitted: { icon: AlertCircle, className: 'status-pending', label: 'Submitted' },
  'In Progress': { icon: Clock, className: 'status-in-progress', label: 'In Progress' },
  Resolved: { icon: CheckCircle2, className: 'status-verified', label: 'Resolved' },
  Rejected: { icon: XCircle, className: 'status-rejected', label: 'Rejected' },
};

const MyApplications: React.FC = () => {
  const { data: schemeApplications, isLoading: loadingSchemes } = useMyApplications();
  const { data: serviceApplications, isLoading: loadingServices } = useMyServiceApplications();

  const [activeTab, setActiveTab] = useState('schemes');

  if (loadingSchemes || loadingServices) {
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

  const renderSchemeTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application No</TableHead>
            <TableHead>Scheme</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schemeApplications?.map((app) => {
            const scheme: any = app.scheme_id;
            const status = statusConfig[app.status] || statusConfig.Pending;
            const StatusIcon = status.icon;

            return (
              <TableRow key={app._id}>
                <TableCell className="font-mono text-sm">{app.application_no}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{scheme?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{scheme?.categories?.join(', ')}</p>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(app.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell>
                  <Badge className={status.className}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Scheme Application Details</DialogTitle>
                        <DialogDescription>{app.application_no}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Scheme</span>
                          <p className="font-medium">{scheme?.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge className={status.className + " block w-fit mt-1"}>{status.label}</Badge>
                        </div>
                        {app.remarks && (
                          <div className="p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Remarks</span>
                            <p className="text-sm text-muted-foreground">{app.remarks}</p>
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
  );

  const renderServiceTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application No</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceApplications?.map((app) => {
            const service: any = app.service_id;
            const status = statusConfig[app.status] || statusConfig.Submitted;
            const StatusIcon = status.icon;

            return (
              <TableRow key={app._id}>
                <TableCell className="font-mono text-sm">{app.application_no}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-primary" />
                    <p className="font-medium">{service?.name || 'Unknown'}</p>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(app.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell>
                  <Badge className={status.className}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Service Application Details</DialogTitle>
                        <DialogDescription>{app.application_no}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Service</span>
                            <p className="font-medium">{service?.name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge className={status.className + " block w-fit mt-1"}>{status.label}</Badge>
                          </div>
                        </div>

                        {app.form_data && Object.keys(app.form_data).length > 0 && (
                          <div className="space-y-2">
                            <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                              <ClipboardList className="h-4 w-4" />
                              Submitted Form Details
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                              {Object.entries(app.form_data).map(([key, value]: [string, any]) => (
                                <div key={key} className="space-y-0.5">
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                  <p className="text-sm font-medium">{value?.toString() || '-'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.remarks && (
                          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <span className="text-sm font-bold text-primary flex items-center gap-2 mb-1">
                              <MessageSquare className="h-4 w-4" />
                              Employee Remarks
                            </span>
                            <p className="text-sm text-muted-foreground">{app.remarks}</p>
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
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">My Applications</h1>
        </div>
        <p className="text-muted-foreground">Track all your submitted requests in one place</p>
      </div>

      <Tabs defaultValue="schemes" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="schemes" className="px-8">Schemes</TabsTrigger>
          <TabsTrigger value="services" className="px-8">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="schemes">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Scheme Applications</CardTitle>
              <CardDescription>Applications submitted for various welfare schemes</CardDescription>
            </CardHeader>
            <CardContent>
              {(!schemeApplications || schemeApplications.length === 0) ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold">No scheme applications yet</h3>
                </div>
              ) : renderSchemeTable()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Service Applications</CardTitle>
              <CardDescription>Applications for certificates and identity documents</CardDescription>
            </CardHeader>
            <CardContent>
              {(!serviceApplications || serviceApplications.length === 0) ? (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold">No service applications yet</h3>
                </div>
              ) : renderServiceTable()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add missing icon
const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

export default MyApplications;