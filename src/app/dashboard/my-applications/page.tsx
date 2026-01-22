
import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListChecks, Clock, CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Award, CreditCard, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';


// Extended type to include transaction info
interface ApplicationWithTransaction extends StoredApplication {
  transactions: {
    status: string;
    amount: number;
    payment_reference: string;
  }[];
}

type StepStatus = 'completed' | 'current' | 'pending' | 'error' | 'warning';

interface TrackerStepProps {
  label: string;
  status: StepStatus;
  date?: string;
  last?: boolean;
}

const TrackerStep: React.FC<TrackerStepProps> = ({ label, status, date, last }) => {
  return (
    <div className="flex flex-col items-center relative flex-1">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors duration-300",
        status === 'completed' && "bg-green-100 border-green-500 text-green-600",
        status === 'current' && "bg-blue-100 border-blue-500 text-blue-600 animate-pulse",
        status === 'pending' && "bg-slate-50 border-slate-200 text-slate-300",
        status === 'error' && "bg-red-100 border-red-500 text-red-600",
        status === 'warning' && "bg-orange-100 border-orange-500 text-orange-600"
      )}>
        {status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
        {status === 'current' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'pending' && <Clock className="h-4 w-4" />}
        {status === 'error' && <XCircle className="h-4 w-4" />}
        {status === 'warning' && <AlertTriangle className="h-4 w-4" />}
      </div>

      {!last && (
        <div className={cn(
          "absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors duration-300",
          status === 'completed' ? "bg-green-500" : "bg-slate-200"
        )} />
      )}

      <div className="mt-2 text-center">
        <p className={cn(
          "text-[10px] sm:text-xs font-bold uppercase tracking-wider",
          status === 'completed' ? "text-green-700" :
            status === 'current' ? "text-blue-700" :
              status === 'error' ? "text-red-700" :
                status === 'warning' ? "text-orange-700" : "text-slate-400"
        )}>{label}</p>
        {date && <p className="text-[10px] text-slate-500 mt-0.5">{date}</p>}
      </div>
    </div>
  );
};

const ApplicationTracker = ({ app }: { app: ApplicationWithTransaction }) => {
  const isPaid = app.transactions?.some(t => t.status === 'Verified' || t.status === 'Successful');
  const isApproved = app.status === 'Approved';
  const isRejected = app.status === 'Rejected';
  const isQueried = app.status === 'Queried';

  // Determine steps state
  const steps: { label: string; status: StepStatus; date?: string }[] = [
    {
      label: 'Submitted',
      status: 'completed',
      date: app.created_at ? format(parseISO(app.created_at), 'dd/MM/yy') : undefined
    },
    {
      label: 'Payment',
      status: isPaid ? 'completed' : 'current'
    },
    {
      label: 'Review',
      status: isPaid ? (isApproved || isRejected || isQueried ? 'completed' : 'current') : 'pending'
    },
    {
      label: isRejected ? 'Rejected' : isQueried ? 'Action Required' : 'Decision',
      status: isApproved ? 'completed' : (isRejected ? 'error' : isQueried ? 'warning' : 'pending')
    }
  ];

  return (
    <div className="flex justify-between items-start w-full px-2 py-4">
      {steps.map((step, index) => (
        <TrackerStep
          key={step.label}
          {...step}
          last={index === steps.length - 1}
        />
      ))}
    </div>
  );
};


async function getApplications(userId: string) {
  const supabase = await createSupabaseServerClient();

  // We explicitly select transactions to determine payment status
  const { data, error } = await supabase
    .from('applications')
    .select('*, transactions(status, amount, payment_reference)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user applications from Supabase:", error);
    return [];
  }
  return data as ApplicationWithTransaction[];
}

async function MyApplicationsPageComponent() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/dashboard/my-applications');
  }

  const applications = await getApplications(user.id);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <ListChecks className="h-6 w-6" />
            </div>
            My Applications
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Track and manage your permit applications in real-time.
          </p>
        </div>
        <Button variant="outline" className="hidden sm:flex gap-2">
          <Clock className="h-4 w-4" /> History
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="bg-white p-4 rounded-full inline-flex mb-4 shadow-sm">
            <ListChecks className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No applications yet</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">Start a new application to see it tracked here.</p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/apply">Apply Now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-200 transition-all hover:shadow-xl group">
              <div className={cn(
                "h-2 w-full",
                app.status === 'Approved' ? "bg-green-500" :
                  app.status === 'Rejected' ? "bg-red-500" :
                    app.status === 'Queried' ? "bg-orange-500" :
                      "bg-blue-500"
              )} />

              <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 font-mono text-[10px]">
                        ID: {app.id}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium px-2 border-l border-slate-200">
                        {format(parseISO(app.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {app.type}
                    </CardTitle>
                  </div>

                  <Badge className={cn(
                    "px-3 py-1 text-sm font-semibold shadow-none",
                    app.status === 'Approved' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                      app.status === 'Rejected' ? "bg-red-100 text-red-700 hover:bg-red-100" :
                        app.status === 'Queried' ? "bg-orange-100 text-orange-700 hover:bg-orange-100" :
                          "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  )}>
                    {app.status === 'Queried' ? 'Action Required' : app.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-8">
                {/* Tracker Section */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <ApplicationTracker app={app} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 bg-slate-100 rounded text-slate-500">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {app.type === 'DIN Application' ? 'DIN No.' : 'File / Permit No.'}
                        </p>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {app.type === 'DIN Application' && app.status !== 'Approved'
                            ? 'Pending approval...'
                            : (app.original_permit_id || app.din || (app.type === 'Stage Approval Application' && app.data?.kbp_number) || 'Pending processing...')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 bg-slate-100 rounded text-slate-500">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {app.transactions?.some(t => t.status === 'Verified' || t.status === 'Successful') ? (
                            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Paid Verified
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-orange-600 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> Payment Pending / Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection/Query Notice */}
                {(app.status === 'Rejected' || app.status === 'Queried') && app.rejection_reason && (
                  <div className={cn(
                    "p-4 rounded-xl flex gap-4 border",
                    app.status === 'Rejected' ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
                  )}>
                    <div className="bg-white p-2 rounded-full h-fit shadow-sm">
                      <AlertTriangle className={cn("h-5 w-5", app.status === 'Rejected' ? "text-red-500" : "text-orange-500")} />
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-sm", app.status === 'Rejected' ? "text-red-900" : "text-orange-900")}>
                        {app.status === 'Rejected' ? 'Application Rejected' : 'Correction Required'}
                      </h4>
                      <p className={cn("text-sm mt-1 leading-relaxed", app.status === 'Rejected' ? "text-red-700/80" : "text-orange-700/80")}>
                        {app.rejection_reason}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-slate-50/50 p-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <Button asChild variant={app.status === 'Queried' ? 'default' : 'outline'} className={cn(
                  "w-full sm:w-auto",
                  app.status === 'Queried'
                    ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200 border-0"
                    : "border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white hover:border-slate-300"
                )}>
                  <Link href={`/dashboard/application-details/${app.id}`}>
                    {app.status === 'Queried' ? 'Resolve Query' : 'View Details'}
                  </Link>
                </Button>

                {/* Acknowledgement/Certificate Button */}
                {(app.type === 'DIN Application' ? (app.status === 'Approved' && app.din) : (app.original_permit_id || app.din)) && (
                  <Button asChild className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200">
                    <Link href={`/dashboard/acknowledgement/${app.id}`}>
                      {app.type === 'DIN Application' ? (
                        <>
                          <Award className="mr-2 h-4 w-4" />
                          Download Certificate
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          View Acknowledgement
                        </>
                      )}
                    </Link>
                  </Button>
                )}

                {app.type === 'Certificate of Fitness' && app.status === 'Approved' && (
                  <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
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
    <Suspense fallback={
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    }>
      <MyApplicationsPageComponent />
    </Suspense>
  )
}
