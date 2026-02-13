import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, CheckCircle2, Clock, Building2, Briefcase, Loader2 } from 'lucide-react';
import { useAdminStats } from '@/hooks/useApi';

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading } = useAdminStats();

  const stats = [
    { icon: Users, label: 'Total Citizens', value: statsData?.totalCitizens?.toLocaleString() || '0', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: FileText, label: 'Total Schemes', value: statsData?.totalSchemes?.toLocaleString() || '0', color: 'text-accent', bg: 'bg-accent/10' },
    { icon: Clock, label: 'Pending Applications', value: statsData?.pendingApplications?.toLocaleString() || '0', color: 'text-warning', bg: 'bg-warning/10' },
    { icon: CheckCircle2, label: 'Resolved Complaints', value: statsData?.resolvedComplaints?.toLocaleString() || '0', color: 'text-success', bg: 'bg-success/10' },
    { icon: Building2, label: 'Departments', value: statsData?.totalDepartments?.toLocaleString() || '0', color: 'text-info', bg: 'bg-info/10' },
    { icon: Briefcase, label: 'Employees', value: statsData?.totalEmployees?.toLocaleString() || '0', color: 'text-primary', bg: 'bg-primary/10' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of village management system</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;