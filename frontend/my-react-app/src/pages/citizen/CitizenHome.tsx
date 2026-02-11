import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCitizen, useUpdateCitizen } from '@/hooks/useApi';
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
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';

const CitizenHome: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: citizen, isLoading: isFetching } = useCitizen(user?.id || '');
  const updateMutation = useUpdateCitizen();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    dob: '',
    address: {
      door_no: '',
      village: '',
      mandal: '',
      district: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    if (citizen) {
      setFormData({
        name: citizen.name || '',
        phone: citizen.phone || '',
        email: citizen.email || '',
        gender: citizen.gender || '',
        dob: citizen.dob ? new Date(citizen.dob).toISOString().split('T')[0] : '',
        address: {
          door_no: citizen.address?.door_no || '',
          village: citizen.address?.village || '',
          mandal: citizen.address?.mandal || '',
          district: citizen.address?.district || '',
          state: citizen.address?.state || '',
          pincode: citizen.address?.pincode || ''
        }
      });
    }
  }, [citizen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: formData
      });
      toast({
        title: "Profile Updated",
        description: "Your profile details have been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

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

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12 outline-none">
            {/* Quick Actions */}
            <section>
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
            <section>
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
          </TabsContent>

          <TabsContent value="profile" className="outline-none">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <Card className="lg:col-span-1 glass-card h-fit">
                <CardHeader className="text-center pb-8 border-b">
                  <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    <User className="h-12 w-12" />
                  </div>
                  <CardTitle className="text-2xl">{citizen?.name || user?.username}</CardTitle>
                  <CardDescription>Citizen of Village</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{citizen?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{citizen?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{citizen?.address?.village ? `${citizen.address.village}, ${citizen.address.district}` : 'Address not set'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Form */}
              <Card className="lg:col-span-2 glass-card">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Edit Profile Details</CardTitle>
                    <CardDescription>Keep your profile information up to date for seamless service applications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={isFetching} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={isFetching} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isFetching} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleInputChange} disabled={isFetching} />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Address Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="door_no">Door / House No.</Label>
                          <Input id="door_no" name="address.door_no" value={formData.address.door_no} onChange={handleInputChange} disabled={isFetching} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="village">Village</Label>
                          <Input id="village" name="address.village" value={formData.address.village} onChange={handleInputChange} disabled={isFetching} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mandal">Mandal</Label>
                          <Input id="mandal" name="address.mandal" value={formData.address.mandal} onChange={handleInputChange} disabled={isFetching} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">District</Label>
                          <Input id="district" name="address.district" value={formData.address.district} onChange={handleInputChange} disabled={isFetching} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input id="pincode" name="address.pincode" value={formData.address.pincode} onChange={handleInputChange} disabled={isFetching} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-6 border-t">
                    <Button type="submit" disabled={updateMutation.isPending || isFetching} className="w-full md:w-auto">
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <section className="grid md:grid-cols-3 gap-6 mt-12">
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