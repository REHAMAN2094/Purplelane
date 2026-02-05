import React from 'react';
import { useServices } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Settings,
  FileText,
  ArrowRight,
  CreditCard,
  Home,
  Car,
  Landmark,
  Baby,
  Users,
} from 'lucide-react';
import { Service } from '@/types';

// Mock data for demo
const mockServices: Service[] = [
  {
    _id: '1',
    name: 'Aadhaar Card Application',
    description: 'Apply for new Aadhaar card or update existing details',
    required_documents: ['Proof of Identity', 'Proof of Address', 'Passport Photo'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'PAN Card Application',
    description: 'Apply for Permanent Account Number (PAN) card',
    required_documents: ['Aadhaar Card', 'Passport Photo', 'Address Proof'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Birth Certificate',
    description: 'Register birth and get birth certificate',
    required_documents: ['Hospital Birth Record', 'Parent ID Proof', 'Address Proof'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Death Certificate',
    description: 'Register death and get death certificate',
    required_documents: ['Hospital Death Record', 'Deceased ID Proof', 'Applicant ID Proof'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Driving License',
    description: 'Apply for new driving license or renewal',
    required_documents: ['Aadhaar Card', 'Address Proof', 'Passport Photo', 'Medical Certificate'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Caste Certificate',
    description: 'Apply for caste certificate for reservation benefits',
    required_documents: ['Aadhaar Card', 'Parent Caste Certificate', 'Address Proof'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '7',
    name: 'Income Certificate',
    description: 'Get official income certificate for various applications',
    required_documents: ['Aadhaar Card', 'Salary Slip/Income Proof', 'Bank Statement'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '8',
    name: 'Domicile Certificate',
    description: 'Certificate of residence in the state',
    required_documents: ['Aadhaar Card', 'Address Proof', 'Birth Certificate'],
    is_active: true,
    createdAt: new Date().toISOString(),
  },
];

const serviceIcons: Record<string, React.ElementType> = {
  'Aadhaar Card Application': CreditCard,
  'PAN Card Application': CreditCard,
  'Birth Certificate': Baby,
  'Death Certificate': Users,
  'Driving License': Car,
  'Caste Certificate': Landmark,
  'Income Certificate': FileText,
  'Domicile Certificate': Home,
};

const Services: React.FC = () => {
  const { data: apiServices, isLoading } = useServices();

  // Use mock data if API returns empty
  const services = apiServices?.length ? apiServices : mockServices;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <Settings className="h-6 w-6 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold">Government Services</h1>
        </div>
        <p className="text-muted-foreground">
          Apply for essential documents and certificates online
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => {
          const IconComponent = serviceIcons[service.name] || FileText;

          return (
            <Card key={service._id} className="glass-card hover-lift group">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {service.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Required Documents:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {service.required_documents.slice(0, 2).map((doc, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                    {service.required_documents.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.required_documents.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl font-semibold mb-2">
                Need Help with Applications?
              </h3>
              <p className="text-muted-foreground">
                Visit your nearest village office or contact the helpline for assistance with document collection and application submission.
              </p>
            </div>
            <Button className="flex-shrink-0">
              Get Help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;