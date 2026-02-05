import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  MessageSquare,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Shield,
  Users,
  Building,
} from 'lucide-react';

const CitizenHome: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: FileText,
      title: 'Browse Schemes',
      description: 'Explore government schemes and benefits',
      path: '/citizen/schemes',
      color: 'bg-primary',
    },
    {
      icon: ClipboardList,
      title: 'My Applications',
      description: 'Track your application status',
      path: '/citizen/applications',
      color: 'bg-accent',
    },
    {
      icon: MessageSquare,
      title: 'File Complaint',
      description: 'Report local issues',
      path: '/citizen/complaints',
      color: 'bg-warning',
    },
  ];

  const stats = [
    { icon: ClipboardList, label: 'Total Applications', value: '3', color: 'text-primary' },
    { icon: Clock, label: 'Pending', value: '1', color: 'text-warning' },
    { icon: CheckCircle2, label: 'Approved', value: '2', color: 'text-success' },
    { icon: AlertCircle, label: 'Active Complaints', value: '1', color: 'text-destructive' },
  ];

  const featuredSchemes = [
    {
      name: 'PM Kisan Yojana',
      category: 'Agriculture',
      description: 'Financial support for farmers',
      icon: '🌾',
    },
    {
      name: 'Ayushman Bharat',
      category: 'Health',
      description: 'Free healthcare coverage',
      icon: '🏥',
    },
    {
      name: 'PM Awas Yojana',
      category: 'Housing',
      description: 'Affordable housing for all',
      icon: '🏠',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl lg:text-5xl font-bold mb-4">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-lg lg:text-xl text-white/80 mb-8">
              Access government schemes, track your applications, and participate in your village's digital governance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/citizen/schemes">
                  <FileText className="mr-2 h-5 w-5" />
                  Explore Schemes
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/citizen/applications">
                  View My Applications
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="glass-card hover-lift cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    <ArrowRight className="h-4 w-4 mt-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Schemes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">Popular Schemes</h2>
            <Button asChild variant="ghost">
              <Link to="/citizen/schemes">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{scheme.icon}</div>
                    <div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {scheme.category}
                      </span>
                      <CardTitle className="text-lg mt-2">{scheme.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{scheme.description}</CardDescription>
                  <Button asChild variant="link" className="p-0 mt-3 h-auto">
                    <Link to="/citizen/schemes">
                      Learn more <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Info Cards */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Digital Progress</h3>
              <p className="text-sm text-muted-foreground">
                Your village is 85% digitized. Join us in making governance more transparent.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your documents are encrypted and stored securely with government standards.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-warning mb-4" />
              <h3 className="font-semibold mb-2">Community First</h3>
              <p className="text-sm text-muted-foreground">
                Report local issues and help improve your village infrastructure.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CitizenHome;