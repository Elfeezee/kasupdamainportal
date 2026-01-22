
import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Clock, CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Award } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ApplicationStatus = 'Inprogress' | 'Approved' | 'Rejected';

interface StatusBadgeProps extends VariantProps<typeof badgeVariantsForStatus> {
  status: ApplicationStatus;
  className?: string;
}

const badgeVariantsForStatus = ({ status }: { status: ApplicationStatus }) => {
  return {
    variant: (
      status === 'Approved' ? 'default' :
        status === 'Rejected' ? 'destructive' :
          status === 'Inprogress' ? 'secondary' :
            'default'
    ) as "default" | "destructive" | "secondary" | "outline" | null | undefined,
  };
};

const StatusIcon = ({ status }: { status: ApplicationStatus }) => {
  if (status === 'Approved') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (status === 'Rejected') return <XCircle className="h-4 w-4 text-red-500" />;
  if (status === 'Inprogress') return <Clock className="h-4 w-4 text-yellow-500" />;
  return null;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { variant } = badgeVariantsForStatus({ status });
  return <Badge variant={variant} className={cn("capitalize", className)}>{status}</Badge>;
};

async function getApplications(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user applications from Supabase:", error);
    return [];
  }
  return data as StoredApplication[];
}


async function MyApplicationsPageComponent() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/dashboard/my-applications');
  }

  const applications = await getApplications(user.id);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <ListChecks className="mr-3 h-7 w-7" /> My Submitted Applications
        </CardTitle>
        <CardDescription>
          Track the status of all your permit applications and complaints.
        </CardDescription>
      </CardHeader>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">You have not submitted any applications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{app.type}</CardTitle>
                  <StatusIcon status={app.status as ApplicationStatus} />
                </div>
                <CardDescription className="text-xs">Applicant: {app.applicant_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow flex flex-col">
                <div className="flex-grow space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>{app.type === 'DIN Application' ? 'DIN' : 'File NO.'}:</strong> {app.original_permit_id || app.din || (app.type === 'Stage Approval Application' && app.data?.kbp_number) || 'Pending Admin Review'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Application ID:</strong> {app.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Submitted:</strong> {app.created_at ? format(parseISO(app.created_at), 'dd/MM/yyyy') : 'N/A'}
                  </p>
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground mr-2"><strong>Status:</strong></p>
                    <StatusBadge status={app.status as ApplicationStatus} />
                  </div>
                </div>

                {app.status === 'Rejected' && app.rejection_reason && (
                  <div className="p-3 mt-4 rounded-md bg-destructive/10 border border-destructive/20">
                    <h4 className="font-semibold text-destructive text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Reason for Rejection
                    </h4>
                    <p className="text-xs text-destructive/90 mt-1">{app.rejection_reason}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2">
                {(app.original_permit_id || app.din) && (
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/dashboard/acknowledgement/${app.id}`}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      View Acknowledgement
                    </Link>
                  </Button>
                )}
                {app.type === 'Certificate of Fitness' && app.status === 'Approved' && (
                  <Button asChild variant="default" className="w-full">
                    <Link href={`/dashboard/certificate-of-fitness/${app.id}`}>
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading applications...</div>}>
      <MyApplicationsPageComponent />
    </Suspense>
  )
}
