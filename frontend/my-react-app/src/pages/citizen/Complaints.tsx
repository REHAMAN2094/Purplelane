import React, { useState } from 'react';
import { useMyComplaints, useCreateComplaint, useCreateFeedback } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Plus,
  Loader2,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Calendar,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Complaint } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { VoiceInput } from '@/components/ui/VoiceInput';

const categories = [
  'Roads & Infrastructure',
  'Water Supply',
  'Electricity',
  'Sanitation',
  'Public Safety',
  'Environment',
  'Other',
];

const statusConfig = {
  Submitted: {
    icon: AlertCircle,
    className: 'status-pending',
    label: 'Submitted',
  },
  'In Progress': {
    icon: Clock,
    className: 'status-in-progress',
    label: 'In Progress',
  },
  Resolved: {
    icon: CheckCircle2,
    className: 'status-verified',
    label: 'Resolved',
  },
};

const Complaints: React.FC = () => {
  const { data: apiComplaints, isLoading } = useMyComplaints();
  const createComplaintMutation = useCreateComplaint();
  const createFeedbackMutation = useCreateFeedback();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    description: '',
  });

  // Use API data directly
  const complaints: Complaint[] = apiComplaints || [];

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    if (imageFile) {
      fd.append('attachments', imageFile);
    }

    try {
      await createComplaintMutation.mutateAsync(fd);
      toast.success('Complaint submitted successfully!');
      setCreateDialogOpen(false);
      setFormData({ title: '', description: '', category: '' });
      setImageFile(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit complaint');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      await createFeedbackMutation.mutateAsync({
        complaint_id: selectedComplaint._id,
        rating: feedbackData.rating,
        description: feedbackData.description,
      });
      toast.success('Thank you for your feedback!');
      setFeedbackDialogOpen(false);
      setFeedbackData({ rating: 5, description: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback');
    }
  };

  const openFeedbackDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setFeedbackDialogOpen(true);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <MessageSquare className="h-6 w-6 text-warning" />
            </div>
            <h1 className="font-display text-3xl font-bold">Complaints</h1>
          </div>
          <p className="text-muted-foreground">
            Report local issues and track their resolution
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>File a New Complaint</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll work to resolve it
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitComplaint} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <VoiceInput
                    onTranscript={(text) => setFormData({ ...formData, description: formData.description + " " + text })}
                  />
                </div>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Attach Image (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {imageFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{imageFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload an image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createComplaintMutation.isPending}
              >
                {createComplaintMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No complaints yet</h3>
            <p className="text-muted-foreground mb-4">
              Have an issue to report? File a complaint and we'll help resolve it.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              File Your First Complaint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => {
            const status = statusConfig[complaint.status];
            const StatusIcon = status.icon;

            return (
              <Card key={complaint._id} className="glass-card hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={status.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {complaint.complaint_no}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 mt-2">
                    {complaint.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {complaint.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(complaint.createdAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="line-clamp-3">
                    {complaint.description}
                  </CardDescription>

                  {complaint.remarks && (
                    <div className="p-2 bg-muted rounded text-xs">
                      <p className="font-medium mb-1">Latest Update:</p>
                      <p className="text-muted-foreground line-clamp-2">
                        {complaint.remarks}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{complaint.title}</DialogTitle>
                          <DialogDescription>
                            {complaint.complaint_no}
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
                            <span className="text-sm text-muted-foreground">Category</span>
                            <p className="font-medium">{complaint.category}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Description</span>
                            <p className="text-sm mt-1">{complaint.description}</p>
                          </div>
                          {complaint.remarks && (
                            <div className="p-3 bg-muted rounded-lg">
                              <span className="text-sm font-medium">Official Remarks</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {complaint.remarks}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {complaint.status === 'Resolved' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => openFeedbackDialog(complaint)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Feedback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Rate the resolution of your complaint
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitFeedback} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8 transition-colors',
                        star <= feedbackData.rating
                          ? 'text-warning fill-warning'
                          : 'text-muted-foreground'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-description">Comments (Optional)</Label>
              <Textarea
                id="feedback-description"
                placeholder="Share your experience..."
                rows={3}
                value={feedbackData.description}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, description: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createFeedbackMutation.isPending}
            >
              {createFeedbackMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complaints;