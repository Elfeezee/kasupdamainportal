
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Loader2, Save, Trash2, X, Receipt } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { updateApplicationData, updateApplicationStatus } from '@/app/actions/adminActions';
import ApplicationDetails from '../ApplicationDetails';
import type { StoredApplication } from '../page';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createBill } from '@/app/actions/billingActions';


const statusOptions: ('Inprogress' | 'Approved' | 'Rejected')[] = ['Inprogress', 'Approved', 'Rejected'];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const appId = params.id as string;

  const [application, setApplication] = useState<StoredApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);

  // State for billing dialog
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);
  const [billingAmount, setBillingAmount] = useState('');
  const [billingDescription, setBillingDescription] = useState('');
  const [isCreatingBill, setIsCreatingBill] = useState(false);


  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', appId)
        .single();
      
      if (error) throw error;

      setApplication(data as StoredApplication);
      setEditedData(data || {});
      setRejectionReason(data.rejection_reason || '');

    } catch (error) {
      console.error("Failed to fetch application:", error);
      toast({ title: "Error", description: "Could not load application details.", variant: "destructive" });
      router.back();
    } finally {
      setLoading(false);
    }
  }, [appId, toast, router]);

  useEffect(() => {
    if (appId) {
      fetchApplication();
    }
  }, [appId, fetchApplication]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedData(application || {});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setEditedData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    if (!application) return;
    setIsSaving(true);
    try {
      const result = await updateApplicationData(application.id, editedData);
      if (result.success) {
        toast({ title: "Success", description: "Application data updated successfully." });
        setIsEditing(false);
        fetchApplication();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast({ title: "Error", description: `Could not save changes: ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'Inprogress' | 'Approved' | 'Rejected') => {
      if (!application) return;
      
      if (newStatus === 'Rejected') {
          setIsRejectionDialogOpen(true);
          return;
      }
      
      setIsStatusUpdating(true);
      try {
        const result = await updateApplicationStatus(application.id, newStatus, null);
        if (result.success) {
            toast({ title: "Status Updated", description: `Application has been marked as ${newStatus}.` });
            fetchApplication();
        } else {
            throw new Error(result.error);
        }
      } catch (error) {
          toast({ title: "Error", description: `Could not update status: ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
      } finally {
          setIsStatusUpdating(false);
      }
  };

  const handleRejectionSubmit = async () => {
      if (!application || !rejectionReason.trim()) {
          toast({ title: "Error", description: "Rejection reason cannot be empty.", variant: "destructive" });
          return;
      }
      setIsStatusUpdating(true);
      setIsRejectionDialogOpen(false);
      try {
        const result = await updateApplicationStatus(application.id, 'Rejected', rejectionReason);
        if (result.success) {
            toast({ title: "Application Rejected", description: "The application has been marked as rejected." });
            fetchApplication();
        } else {
            throw new Error(result.error);
        }
      } catch (error) {
           toast({ title: "Error", description: `Could not reject application: ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
      } finally {
          setIsStatusUpdating(false);
      }
  }

  const handleDeleteApplication = async () => {
      if (!application) return;
      setIsDeleteDialogOpen(false);
      toast({ title: "Action Disabled", description: "Deleting from the detail page is disabled for safety.", variant: "destructive" });
  };
  
  const handleCreateBill = async () => {
    if (!application || !billingAmount || !billingDescription) {
        toast({ title: 'Error', description: 'Please fill in all billing details.', variant: 'destructive' });
        return;
    }
    setIsCreatingBill(true);
    try {
        const amount = parseFloat(billingAmount);
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Invalid amount entered.");
        }
        
        // NOTE: The originating_State_Code should be provided by Osoftpay upon go-live.
        // Using a placeholder for now.
        const originatingStateCode = "KDSG-KASUPDA"; 

        const result = await createBill(application, amount, billingDescription, originatingStateCode);

        if (result.success) {
            toast({ title: 'Bill Created', description: 'The payment bill has been generated and is now available to the user.' });
            setIsBillingDialogOpen(false);
            setBillingAmount('');
            setBillingDescription('');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        toast({ title: 'Billing Error', description: `Could not create bill: ${error instanceof Error ? error.message : 'Unknown error'}`, variant: 'destructive' });
    } finally {
        setIsCreatingBill(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!application) {
    return <div className="text-center text-muted-foreground">Application not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to List
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{application.type}</CardTitle>
              <CardDescription>ID: {application.original_permit_id || application.din || application.id}</CardDescription>
            </div>
             <Badge variant={
                application.status === 'Approved' ? 'default' :
                application.status === 'Rejected' ? 'destructive' :
                'secondary'
             } className="capitalize">{application.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <ApplicationDetails 
            application={application} 
            isEditing={isEditing}
            editedData={editedData}
            onInputChange={handleInputChange}
          />
          
           {application.status === 'Rejected' && application.rejection_reason && (
                <div className="p-3 mt-4 rounded-md bg-destructive/10">
                    <h4 className="font-semibold text-destructive text-sm">Reason for Rejection</h4>
                    {isEditing ? (
                         <Textarea 
                            value={rejectionReason} 
                            onChange={(e) => setRejectionReason(e.target.value)} 
                            className="mt-1"
                         />
                    ) : (
                        <p className="text-xs text-destructive/90 mt-1">{application.rejection_reason}</p>
                    )}
                </div>
            )}

        </CardContent>
         <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
            <div className="flex flex-wrap gap-2">
                {isEditing ? (
                <>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
                    </Button>
                    <Button variant="ghost" onClick={handleEditToggle}><X className="mr-2 h-4 w-4" />Cancel</Button>
                </>
                ) : (
                <Button onClick={handleEditToggle} variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" /> Edit Application
                </Button>
                )}
                <Button onClick={() => setIsBillingDialogOpen(true)} variant="default" className="gap-2">
                    <Receipt className="h-4 w-4" /> Create Bill
                </Button>
            </div>
             <div className="flex gap-2 flex-wrap justify-end">
                {statusOptions.map(status => (
                    <Button key={status} size="sm" onClick={() => handleStatusChange(status)} disabled={isStatusUpdating || application.status === status}>
                        {isStatusUpdating ? 'Updating...' : `Mark as ${status}`}
                    </Button>
                ))}
                <Button size="sm" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                </Button>
            </div>
         </CardFooter>
      </Card>
      
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteApplication} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reason for Rejection</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a clear reason why this application is being rejected. This will be shown to the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
             <Textarea 
                placeholder="e.g., Incomplete documentation, incorrect plot information..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectionSubmit} disabled={!rejectionReason.trim()}>Submit Rejection</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <Dialog open={isBillingDialogOpen} onOpenChange={setIsBillingDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Bill</DialogTitle>
                    <DialogDescription>
                        Generate a payment invoice for this application. The user will be notified and provided with a payment reference.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="billing-description">Description</Label>
                        <Input
                            id="billing-description"
                            value={billingDescription}
                            onChange={(e) => setBillingDescription(e.target.value)}
                            placeholder="e.g., Building Permit Assessment Fee"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="billing-amount">Amount (₦)</Label>
                        <Input
                            id="billing-amount"
                            type="number"
                            value={billingAmount}
                            onChange={(e) => setBillingAmount(e.target.value)}
                            placeholder="e.g., 50000"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBillingDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateBill} disabled={isCreatingBill || !billingAmount || !billingDescription}>
                        {isCreatingBill ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : "Generate Bill"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
