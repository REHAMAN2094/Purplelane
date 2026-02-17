import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck, MessageSquare, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useEmployeeStats } from '@/hooks/useApi';

const EmployeeDashboard: React.FC = () => {
  const { data: statsData, isLoading } = useEmployeeStats();

  const sections = [
    {
      title: 'Scheme Applications',
      stats: [
        { icon: Clock, label: 'Pending', value: statsData?.schemes?.pending?.toString() || '0', color: 'text-warning', bg: 'bg-warning/10' },
        { icon: Loader2, label: 'In Progress', value: statsData?.schemes?.inProgress?.toString() || '0', color: 'text-info', bg: 'bg-info/10' },
        { icon: FileCheck, label: 'Verified Today', value: statsData?.schemes?.verifiedToday?.toString() || '0', color: 'text-success', bg: 'bg-success/10' },
        { icon: CheckCircle2, label: 'Successfully Resolved', value: statsData?.schemes?.resolved?.toString() || '0', color: 'text-accent', bg: 'bg-accent/10' },
      ]
    },
    {
      title: 'Service Applications',
      stats: [
        { icon: Clock, label: 'Pending', value: statsData?.services?.pending?.toString() || '0', color: 'text-warning', bg: 'bg-warning/10' },
        { icon: Loader2, label: 'In Progress', value: statsData?.services?.inProgress?.toString() || '0', color: 'text-info', bg: 'bg-info/10' },
        { icon: FileCheck, label: 'Verified Today', value: statsData?.services?.verifiedToday?.toString() || '0', color: 'text-success', bg: 'bg-success/10' },
        { icon: CheckCircle2, label: 'Successfully Resolved', value: statsData?.services?.resolved?.toString() || '0', color: 'text-accent', bg: 'bg-accent/10' },
      ]
    },
    {
      title: 'Complaints',
      stats: [
        { icon: MessageSquare, label: 'Assigned / In Progress', value: statsData?.complaints?.assigned?.toString() || '0', color: 'text-info', bg: 'bg-info/10' },
        { icon: CheckCircle2, label: 'Resolved Complaints', value: statsData?.complaints?.resolved?.toString() || '0', color: 'text-accent', bg: 'bg-accent/10' },
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Employee Dashboard</h1>
        <p className="text-muted-foreground">Manage applications and complaints across all categories</p>
      </div>

      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-semibold px-1">{section.title}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {section.stats.map((stat, i) => (
                <Card key={i} className="glass-card hover-lift">
                  <CardContent className="p-6">
                    <div className={`p-3 rounded-xl ${stat.bg} w-fit mb-3`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;