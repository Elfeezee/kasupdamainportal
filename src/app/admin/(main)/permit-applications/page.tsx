'use client';

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ListFilter, Search, Building, Trash2, Eye, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import ApplicationDetails from '../applications/ApplicationDetails';
import type { StoredApplication } from '../applications/page';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { updateApplicationData } from '@/app/actions/adminActions';

type ApplicationStatus = 'Inprogress' | 'Approved' | 'Rejected';

const badgeVariantsForStatus = ({ status }: { status: ApplicationStatus }) => {
  return {
    variant: (
      status === 'Approved' ? 'default' :
        status === 'Rejected' ? 'destructive' :
          'secondary'
    ) as "default" | "destructive" | "secondary" | "outline" | null | undefined,
  };
};

interface StatusBadgeProps extends VariantProps<typeof badgeVariantsForStatus> {
  status: ApplicationStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { variant } = badgeVariantsForStatus({ status });
  return <Badge variant={variant} className={cn("capitalize", className)}>{status}</Badge>;
};

const PERMIT_TYPES = [
  "Building Permit (Individual)",
  "Building Permit (Organization)",
  "Mast Installation Permit",
  "Outdoor Advertisement Permit",
  "Outdoor Structure Permit",
  "Temporary Shop Owners Permit",
  "Street Naming Permit",
  "Certificate of Fitness",
];

export default function PermitApplicationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [applications, setApplications] = useState<StoredApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<StoredApplication | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [isKbpDialogOpen, setIsKbpDialogOpen] = useState(false);
  const [kbpApp, setKbpApp] = useState<StoredApplication | null>(null);
  const [kbpNumber, setKbpNumber] = useState('');
  const [isAssigningKbp, setIsAssigningKbp] = useState(false);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Fetch all verified transactions to get application IDs
      const { data: verifiedTransactions, error: txError } = await supabase
        .from('transactions')
        .select('application_id')
        .eq('status', 'Verified');

      if (txError) throw txError;

      // Step 2: Get unique application IDs from verified transactions
      const verifiedAppIds = [...new Set(
        verifiedTransactions
          ?.map(tx => tx.application_id)
          .filter(id => id != null) || []
      )];

      if (verifiedAppIds.length === 0) {
        setApplications([]);
        return;
      }

      // Step 3: Fetch only permit applications that have verified payments
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('type', PERMIT_TYPES)
        .in('id', verifiedAppIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as StoredApplication[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load permit applications.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const openDeleteDialog = (app: StoredApplication) => {
    setApplicationToDelete(app);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;

    try {
      const { error } = await supabase.from('applications').delete().eq('id', applicationToDelete.id);
      if (error) throw error;
      setApplications(prev => prev.filter(app => app.id !== applicationToDelete.id));
      toast({ title: "Application Deleted", description: `Application ID (${applicationToDelete.original_permit_id || applicationToDelete.id}) has been deleted.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete the application.', variant: 'destructive' });
    } finally {
      setIsDeleteDialogOpen(false);
      setApplicationToDelete(null);
    }
  };

  const handleStatusChange = async (app: StoredApplication, newStatus: ApplicationStatus) => {
    if (newStatus === 'Rejected') {
      router.push(`/admin/applications/${app.id}`);
      toast({ title: "Reason Required", description: "Please provide a reason for rejection on the details page.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from('applications').update({ status: newStatus, rejection_reason: null }).eq('id', app.id);
      if (error) throw error;
      setApplications(prevApps => prevApps.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
      toast({ title: `Application ${newStatus}`, description: `The application (${app.original_permit_id || app.id}) has been marked as ${newStatus}.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not update the application status.', variant: 'destructive' });
    }
  };

  const openKbpDialog = (app: StoredApplication) => {
    setKbpApp(app);
    setKbpNumber(app.original_permit_id || '');
    setIsKbpDialogOpen(true);
  };

  const handleKbpAssign = async () => {
    if (!kbpApp || !kbpNumber.trim()) {
      toast({ title: "Error", description: "KBP number cannot be empty.", variant: "destructive" });
      return;
    }
    setIsAssigningKbp(true);

    try {
      const result = await updateApplicationData(kbpApp.id, {
        original_permit_id: kbpNumber,
        status: 'Approved',
        rejection_reason: null
      });

      if (result.success) {
        toast({ title: "KBP Assigned & Approved", description: `KBP number ${kbpNumber} has been assigned and the application is approved.` });
        setApplications(prev => prev.map(app =>
          app.id === kbpApp.id
            ? { ...app, original_permit_id: kbpNumber, status: 'Approved' }
            : app
        ));
        setIsKbpDialogOpen(false);
        setKbpApp(null);
        setKbpNumber('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({ title: 'Error', description: `Could not assign KBP: ${error instanceof Error ? error.message : ''}`, variant: 'destructive' });
    } finally {
      setIsAssigningKbp(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const termMatch = searchTerm.trim() === '' ||
      (app.applicant_name && app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.original_permit_id && app.original_permit_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'All' || app.status === statusFilter;
    return termMatch && statusMatch;
  });

  const toggleRow = (id: string) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };


  return (
    <div className="space-y-8 w-full max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Permit Applications</CardTitle>
              <CardDescription>Manage all submitted building, temporary, and other permit applications.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by applicant name or ID..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" className="gap-2"><ListFilter className="h-4 w-4" />Filter ({statusFilter})</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel><DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('All')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Inprogress')}>Inprogress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Approved')}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('Rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <Fragment key={app.id}>
                      <TableRow className="cursor-pointer" onClick={() => toggleRow(app.id)}>
                        <TableCell className="px-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            {expandedRow === app.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-xs">{app.original_permit_id || app.id}</TableCell>
                        <TableCell>{app.applicant_name}</TableCell>
                        <TableCell className="text-sm">{app.type}</TableCell>
                        <TableCell>{app.created_at ? format(parseISO(app.created_at), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                        <TableCell><StatusBadge status={app.status as ApplicationStatus} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/applications/${app.id}`)}><Eye className="mr-2 h-4 w-4" />View / Edit Page</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(app, 'Approved')}>Approve</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openKbpDialog(app)}>Assign KBP & Approve</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(app, 'Rejected')}>Reject</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(app, 'Inprogress')}>Set to Inprogress</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openDeleteDialog(app)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Application</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedRow === app.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <div className="bg-muted/50 p-4">
                              <ApplicationDetails
                                application={app}
                                isEditing={false}
                                editedData={{}}
                                onInputChange={() => { }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center">No permit applications found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the application for <span className="font-semibold">{applicationToDelete?.applicant_name}</span> (ID: {applicationToDelete?.original_permit_id || applicationToDelete?.id}).</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isKbpDialogOpen} onOpenChange={setIsKbpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign KBP Number & Approve</DialogTitle>
            <DialogDescription>
              Enter the official KBP number for this application. This will automatically mark the application as Approved.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kbp-number" className="text-right">KBP Number</Label>
              <Input
                id="kbp-number"
                value={kbpNumber}
                onChange={(e) => setKbpNumber(e.target.value)}
                className="col-span-3"
                placeholder="e.g., KBP12345"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKbpDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleKbpAssign} disabled={isAssigningKbp || !kbpNumber.trim()}>
              {isAssigningKbp ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning...</> : "Assign & Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
