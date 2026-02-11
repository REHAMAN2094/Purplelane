import React from 'react';
import { useAllFeedback } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MessageSquare, Star, User, Calendar, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';

const EmployeeFeedback: React.FC = () => {
    const { data: feedbacks, isLoading } = useAllFeedback();

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-10 w-64 mb-8" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">Citizen Feedback</h1>
                </div>
                <p className="text-muted-foreground">View ratings and comments from citizens regarding resolved complaints</p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        Recent Feedback
                    </CardTitle>
                    <CardDescription>
                        You have received {feedbacks?.length || 0} feedback submissions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(!feedbacks || feedbacks.length === 0) ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg">No feedback yet</h3>
                            <p className="text-muted-foreground">Feedback will appear here once citizens rate resolved complaints.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Citizen</TableHead>
                                        <TableHead>Complaint No</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Comment</TableHead>
                                        <TableHead>Submitted On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feedbacks.map((item: any) => (
                                        <TableRow key={item._id} className="hover:bg-muted/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{item.citizen_name || item.citizen_id?.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-primary font-mono text-xs">
                                                    <ClipboardList className="h-3.5 w-3.5" />
                                                    {item.complaint_id?.complaint_no || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3.5 w-3.5 ${i < item.rating
                                                                    ? 'text-yellow-500 fill-yellow-500'
                                                                    : 'text-muted stroke-muted-foreground'
                                                                }`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm font-bold">{item.rating}/5</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="text-sm line-clamp-2 italic text-muted-foreground">
                                                    "{item.description}"
                                                </p>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {format(new Date(item.createdAt), 'dd MMM yyyy')}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default EmployeeFeedback;
