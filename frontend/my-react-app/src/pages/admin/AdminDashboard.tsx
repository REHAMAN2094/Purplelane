import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle2, Clock, Building2, Briefcase } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Total Citizens', value: '1,234', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: FileText, label: 'Total Schemes', value: '24', color: 'text-accent', bg: 'bg-accent/10' },
    { icon: Clock, label: 'Pending Applications', value: '89', color: 'text-warning', bg: 'bg-warning/10' },
    { icon: CheckCircle2, label: 'Resolved Complaints', value: '156', color: 'text-success', bg: 'bg-success/10' },
    { icon: Building2, label: 'Departments', value: '8', color: 'text-info', bg: 'bg-info/10' },
    { icon: Briefcase, label: 'Employees', value: '45', color: 'text-primary', bg: 'bg-primary/10' },
  ];

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