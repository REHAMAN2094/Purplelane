import React, { useState, useRef } from 'react';
import { useApplyScheme } from '@/hooks/useApi';
import { Scheme } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Upload,
  X,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplySchemeFormProps {
  scheme: Scheme;
  onSuccess: () => void;
}

interface DocumentUpload {
  name: string;
  file: File | null;
}

const ApplySchemeForm: React.FC<ApplySchemeFormProps> = ({ scheme, onSuccess }) => {
  const applyMutation = useApplyScheme();
  const [documents, setDocuments] = useState<DocumentUpload[]>(
    scheme.required_documents.map((doc) => ({ name: doc, file: null }))
  );
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = (index: number, file: File | null) => {
    const newDocs = [...documents];
    newDocs[index] = { ...newDocs[index], file };
    setDocuments(newDocs);
  };

  const removeFile = (index: number) => {
    handleFileChange(index, null);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const allDocumentsUploaded = documents.every((doc) => doc.file !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allDocumentsUploaded) {
      toast.error('Please upload all required documents');
      return;
    }

    const formData = new FormData();
    formData.append('scheme_id', scheme._id);
    
    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(`documents`, doc.file);
        formData.append(`document_names`, doc.name);
      }
    });

    try {
      await applyMutation.mutateAsync(formData);
      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit application');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Scheme Info */}
      <div className="p-4 bg-muted/50 rounded-lg border">
        <div className="flex flex-wrap gap-2 mb-2">
          {scheme.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
        <h4 className="font-semibold">{scheme.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">{scheme.description}</p>
      </div>

      {/* Document Uploads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Required Documents</Label>
          <span className="text-sm text-muted-foreground">
            {documents.filter((d) => d.file).length} / {documents.length} uploaded
          </span>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={doc.name}
              className={cn(
                'p-4 rounded-lg border-2 border-dashed transition-all',
                doc.file
                  ? 'border-success bg-success/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {doc.file ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    {doc.file ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.file.name} ({(doc.file.size / 1024).toFixed(1)} KB)
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, or PNG up to 5MB
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.file ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[index]?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>

              <input
                ref={(el) => (fileInputRefs.current[index] = el)}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileChange(index, file);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          className="flex-1"
          disabled={!allDocumentsUploaded || applyMutation.isPending}
        >
          {applyMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>

      {!allDocumentsUploaded && (
        <p className="text-xs text-center text-muted-foreground">
          Please upload all required documents to submit your application
        </p>
      )}
    </form>
  );
};

export default ApplySchemeForm;