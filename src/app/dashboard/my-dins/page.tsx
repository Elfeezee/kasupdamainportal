
import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fingerprint, Clock, CheckCircle2, XCircle, FileText, Award, ArrowRight, BookUser, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { applications as applicationsSchema } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

type ApplicationStatus = 'Inprogress' | 'Approved' | 'Rejected' | 'Queried';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Approved': 'bg-green-100 text-green-700 border-green-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
    'Queried': 'bg-orange-100 text-orange-700 border-orange-200',
    'Inprogress': 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const icons: Record<string, any> = {
    'Approved': <CheckCircle2 className="h-3 w-3 mr-1" />,
    'Rejected': <XCircle className="h-3 w-3 mr-1" />,
    'Queried': <Clock className="h-3 w-3 mr-1" />,
    'Inprogress': <Clock className="h-3 w-3 mr-1 animate-pulse" />
  };

  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 font-bold uppercase text-[10px] flex items-center shadow-sm", styles[status] || styles['Inprogress'])}>
      {icons[status] || icons['Inprogress']}
      {status === 'Inprogress' ? 'Processing' : status}
    </Badge>
  );
};

async function getDinApplications(userId: string) {
  try {
    const data = await db.query.applications.findMany({
      where: and(
        eq(applicationsSchema.user_id, userId),
        eq(applicationsSchema.type, 'DIN Application')
      ),
      orderBy: [desc(applicationsSchema.created_at)]
    });
    return data as unknown as StoredApplication[];
  } catch (error) {
    console.error("Error fetching user DIN applications:", error);
    return [];
  }
}

async function MyDinsPageComponent() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login?redirectTo=/dashboard/my-dins');
  }

  const applications = await getDinApplications(session.user.id as string);

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-white dark:bg-card p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Fingerprint className="h-40 w-40" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <BookUser className="h-8 w-8" />
              </div>
              My DIN Directory
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">
              Manage and view all your Development Identification Numbers. Generated DINs are official legal identifiers for your properties.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/50">
            <div className="px-5 py-2 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{applications.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div className="px-5 py-2 text-center text-green-600">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Approved</p>
              <p className="text-2xl font-black leading-none">{applications.filter(a => a.status === 'Approved').length}</p>
            </div>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center space-y-4">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No DINs found</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">
            You haven't submitted any Development Identification Number applications yet.
          </p>
          <Button asChild className="rounded-xl px-8 shadow-lg shadow-primary/20">
            <Link href="/dashboard/apply/din-application">Apply for DIN now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col hover:-translate-y-1">
              <CardHeader className="p-8 pb-4 relative">
                <div className="absolute top-0 right-0 p-4">
                  <StatusBadge status={app.status || 'Inprogress'} />
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-2xl w-fit group-hover:bg-primary/5 transition-colors">
                    <Fingerprint className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Development Identifier</h3>
                    <p className={cn(
                      "text-xl font-black tracking-tighter transition-all break-all",
                      app.status === 'Approved' ? "text-primary" : "text-slate-400 font-mono tracking-normal text-lg"
                    )}>
                      {app.status === 'Approved' && app.din ? app.din : 'Verification Pending'}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4 flex-grow space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                      <BookUser className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Applicant</p>
                      <p className="text-sm font-bold text-slate-800 truncate leading-none mt-1">{app.applicant_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Submitted On</p>
                      <p className="text-sm font-bold text-slate-800 truncate leading-none mt-1">
                        {app.created_at ? format(app.created_at instanceof Date ? app.created_at : parseISO(app.created_at as string), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                <Button asChild variant="outline" className="flex-1 rounded-xl bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm text-xs font-bold py-5">
                  <Link href={`/dashboard/application-details/${app.id}`}>
                    Details
                  </Link>
                </Button>

                {app.status === 'Approved' && (
                  <Button asChild className="flex-1 rounded-xl bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 text-xs font-bold py-5">
                    <Link href={`/dashboard/acknowledgement/${app.id}`}>
                      <Award className="mr-2 h-4 w-4" />
                      Certificate
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

export default function MyDinsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Clock className="h-10 w-10 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Fetching your DIN directory...</p>
      </div>
    }>
      <MyDinsPageComponent />
    </Suspense>
  )
}
