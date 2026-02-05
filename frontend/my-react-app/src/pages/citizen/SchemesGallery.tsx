import React, { useState } from 'react';
import { useSchemes } from '@/hooks/useApi';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import ApplySchemeForm from '@/components/forms/ApplySchemeForm';
import { Scheme } from '@/types';

// Mock data for demo purposes
const mockSchemes: Scheme[] = [
  {
    _id: '1',
    name: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of Rs. 6,000 per year for farmer families.',
    benefits: 'Financial assistance of Rs. 6,000 per year in three equal installments to farmer families.',
    eligibility_criteria: ['Must own cultivable land', 'Not a government employee', 'Annual income below 8 lakhs'],
    required_documents: ['Aadhar Card', 'Land Ownership Document', 'Bank Passbook', 'Passport Photo'],
    is_active: true,
    categories: ['Agriculture', 'Financial Support'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Ayushman Bharat Yojana',
    description: 'Free healthcare coverage up to Rs. 5 lakh per family per year.',
    benefits: 'Comprehensive health insurance covering secondary and tertiary hospitalization.',
    eligibility_criteria: ['BPL family', 'No existing health insurance', 'Valid Aadhar card'],
    required_documents: ['Aadhar Card', 'Ration Card', 'Income Certificate', 'Family Photo'],
    is_active: true,
    categories: ['Healthcare', 'Insurance'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'PM Awas Yojana - Gramin',
    description: 'Affordable housing for rural poor with financial assistance.',
    benefits: 'Rs. 1.2 lakh for plain areas and Rs. 1.3 lakh for hilly areas.',
    eligibility_criteria: ['Homeless or living in kutcha house', 'Annual income below 3 lakhs', 'No pucca house in family'],
    required_documents: ['Aadhar Card', 'Income Certificate', 'Current Housing Photo', 'Land Document'],
    is_active: true,
    categories: ['Housing', 'Financial Support'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Sukanya Samriddhi Yojana',
    description: 'Savings scheme for girl child with attractive interest rate.',
    benefits: 'High interest rate of 8.2% with tax benefits under 80C.',
    eligibility_criteria: ['Girl child below 10 years', 'Indian resident', 'Maximum 2 accounts per family'],
    required_documents: ['Girl Child Birth Certificate', 'Parent Aadhar Card', 'Address Proof', 'Passport Photo'],
    is_active: true,
    categories: ['Education', 'Savings'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'National Pension Scheme',
    description: 'Retirement savings with government contribution.',
    benefits: 'Monthly pension after age 60 with employer contribution.',
    eligibility_criteria: ['Age between 18-70 years', 'Valid KYC documents', 'Indian citizen'],
    required_documents: ['Aadhar Card', 'PAN Card', 'Bank Account Details', 'Passport Photo'],
    is_active: true,
    categories: ['Pension', 'Savings'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connections for BPL households.',
    benefits: 'Free LPG connection with first refill and stove.',
    eligibility_criteria: ['BPL family', 'Adult woman member', 'No existing LPG connection'],
    required_documents: ['Aadhar Card', 'BPL Ration Card', 'Bank Passbook', 'Passport Photo'],
    is_active: true,
    categories: ['Energy', 'Women Welfare'],
    createdAt: new Date().toISOString(),
  },
];

const categoryColors: Record<string, string> = {
  Agriculture: 'bg-green-100 text-green-700 border-green-200',
  Healthcare: 'bg-red-100 text-red-700 border-red-200',
  Housing: 'bg-blue-100 text-blue-700 border-blue-200',
  Education: 'bg-purple-100 text-purple-700 border-purple-200',
  'Financial Support': 'bg-amber-100 text-amber-700 border-amber-200',
  Insurance: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Savings: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pension: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Energy: 'bg-orange-100 text-orange-700 border-orange-200',
  'Women Welfare': 'bg-pink-100 text-pink-700 border-pink-200',
};

const SchemesGallery: React.FC = () => {
  const { data: apiSchemes, isLoading, error } = useSchemes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  // Use mock data if API returns empty
  const schemes = apiSchemes?.length ? apiSchemes : mockSchemes;

  // Get all unique categories
  const allCategories = [...new Set(schemes.flatMap((s) => s.categories))];

  // Filter schemes
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || scheme.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleApply = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setApplyDialogOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Failed to load schemes. Using demo data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Government Schemes</h1>
        </div>
        <p className="text-muted-foreground">
          Explore and apply for various government schemes designed for your benefit
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-1" />
            All
          </Button>
          {allCategories.slice(0, 5).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSchemes.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No schemes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme._id} className="glass-card hover-lift group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {scheme.categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className={categoryColors[cat] || 'bg-gray-100 text-gray-700'}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {scheme.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Eligibility Preview */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Eligibility:</p>
                  <ul className="space-y-1">
                    {scheme.eligibility_criteria.slice(0, 2).map((criteria, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{criteria}</span>
                      </li>
                    ))}
                    {scheme.eligibility_criteria.length > 2 && (
                      <li className="text-xs text-muted-foreground">
                        +{scheme.eligibility_criteria.length - 2} more criteria
                      </li>
                    )}
                  </ul>
                </div>

                {/* Documents Required */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Documents: {scheme.required_documents.length} required
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {scheme.categories.map((cat) => (
                            <Badge
                              key={cat}
                              variant="outline"
                              className={categoryColors[cat] || 'bg-gray-100 text-gray-700'}
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <DialogTitle className="text-2xl">{scheme.name}</DialogTitle>
                        <DialogDescription>{scheme.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div>
                          <h4 className="font-semibold mb-2">Benefits</h4>
                          <p className="text-muted-foreground">{scheme.benefits}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                          <ul className="space-y-2">
                            {scheme.eligibility_criteria.map((criteria, i) => (
                              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Required Documents</h4>
                          <div className="flex flex-wrap gap-2">
                            {scheme.required_documents.map((doc, i) => (
                              <Badge key={i} variant="secondary">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button onClick={() => handleApply(scheme)} className="w-full">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" className="flex-1" onClick={() => handleApply(scheme)}>
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedScheme?.name}</DialogTitle>
            <DialogDescription>
              Upload the required documents to submit your application
            </DialogDescription>
          </DialogHeader>
          {selectedScheme && (
            <ApplySchemeForm
              scheme={selectedScheme}
              onSuccess={() => setApplyDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemesGallery;