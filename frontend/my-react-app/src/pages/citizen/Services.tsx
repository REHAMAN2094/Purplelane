import React, { useState } from 'react';
import { useServices, useApplyForService } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardList,
  Search,
  Clock,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Service } from '@/types';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const categories = ['Certificate', 'Identity', 'Land', 'Welfare', 'Other'];

// Service-specific form fields
const getServiceFormFields = (serviceName: string) => {
  switch (serviceName) {
    case 'Ration Card':
      return [
        { name: 'familyMembers', label: 'Number of Family Members', type: 'number', required: true },
        { name: 'address', label: 'Full Address', type: 'textarea', required: true },
        { name: 'incomeBracket', label: 'Income Bracket', type: 'select', options: ['Below ₹1L', '₹1L-₹3L', '₹3L-₹5L', 'Above ₹5L'], required: true },
        { name: 'phone', label: 'Contact Number', type: 'tel', required: true },
      ];
    case 'PAN Card':
      return [
        { name: 'fatherName', label: "Father's Full Name", type: 'text', required: true },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { name: 'occupation', label: 'Occupation', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Mobile Number', type: 'tel', required: true },
      ];
    case 'Caste Certificate':
      return [
        { name: 'community', label: 'Community/Caste', type: 'text', required: true },
        { name: 'fatherName', label: "Father's Name", type: 'text', required: true },
        { name: 'motherName', label: "Mother's Name", type: 'text', required: true },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { name: 'purpose', label: 'Purpose of Certificate', type: 'select', options: ['Education', 'Employment', 'Other'], required: true },
      ];
    case 'Income Certificate':
      return [
        { name: 'occupation', label: 'Occupation', type: 'text', required: true },
        { name: 'annualIncome', label: 'Annual Income (₹)', type: 'number', required: true },
        { name: 'employerName', label: 'Employer/Business Name', type: 'text', required: false },
        { name: 'purpose', label: 'Purpose', type: 'select', options: ['Scholarship', 'Loan', 'Government Scheme', 'Other'], required: true },
        { name: 'familyMembers', label: 'Number of Family Members', type: 'number', required: true },
      ];
    default:
      return [
        { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
        { name: 'phone', label: 'Contact Number', type: 'tel', required: true },
        { name: 'address', label: 'Address', type: 'textarea', required: true },
        { name: 'remarks', label: 'Additional Information', type: 'textarea', required: false },
      ];
  }
};

const Services: React.FC = () => {
  const { data: services, isLoading } = useServices();
  const applyForService = useApplyForService();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Filter services
  const filteredServices = services?.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const openApplyDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({});
    setIsApplyDialogOpen(true);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateForm = () => {
    if (!selectedService) return false;

    const fields = getServiceFormFields(selectedService.name);
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`${field.label} is required`);
        return false;
      }
    }
    return true;
  };

  const handleApply = () => {
    if (!selectedService) return;

    if (!validateForm()) return;

    applyForService.mutate(
      {
        service_id: selectedService._id,
        form_data: formData
      },
      {
        onSuccess: () => {
          toast.success('Application submitted successfully!');
          setIsApplyDialogOpen(false);
          setSelectedService(null);
          setFormData({});
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to submit application');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <ClipboardList className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="font-display text-3xl font-bold">Government Services</h1>
        </div>
        <p className="text-muted-foreground">
          Browse and apply for government services
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No services available</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back later for new services'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service._id} className="glass-card hover:shadow-lg transition-all group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {service.description || 'No description available'}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Processing: {service.processing_days ? `${service.processing_days} days` : 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Required Documents:
                    </div>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                      {service.required_documents.slice(0, 3).map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                      {service.required_documents.length > 3 && (
                        <li className="text-primary">+{service.required_documents.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => openApplyDialog(service)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Form Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedService?.name}</DialogTitle>
            <DialogDescription>
              Fill in the required information to submit your application
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6 py-4">
              {/* Service Details */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Service Details</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedService.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Processing Time: {selectedService.processing_days} days
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Required Documents:
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  {selectedService.required_documents.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Form Fields */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Application Form
                </h4>

                {getServiceFormFields(selectedService.name).map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </Label>

                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <Select
                        value={formData[field.name] || ''}
                        onValueChange={(value) => handleInputChange(field.name, value)}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Important:</strong> Make sure all information is accurate. You'll need to submit the required documents for verification.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsApplyDialogOpen(false);
                    setFormData({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleApply}
                  disabled={applyForService.isPending}
                >
                  {applyForService.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;