
import React, { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookUser, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { StoredApplication } from '@/app/admin/(main)/applications/page';

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
      'secondary'
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

async function getDinApplications(userId: string) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'DIN Application')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching user DIN applications from Supabase:", error);
        return [];
    }
    return data as StoredApplication[];
}

async function MyDinsPageComponent() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
      redirect('/login?redirectTo=/dashboard/my-dins');
  }

  const applications = await getDinApplications(user.id);
  
  return (
    <div className="space-y-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center">
          <BookUser className="mr-3 h-7 w-7" /> My DINs
        </CardTitle>
        <CardDescription>
          A list of all your Development Identification Numbers.
        </CardDescription>
      </CardHeader>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">You have not applied for any DINs yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-mono text-primary">{app.din || 'Inprogress'}</CardTitle>
                    <StatusIcon status={app.status as ApplicationStatus} />
                </div>
                <CardDescription className="text-xs">Applicant: {app.applicant_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow flex flex-col">
                <div className="flex-grow space-y-2">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyDinsPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading DINs...</div>}>
            <MyDinsPageComponent />
        </Suspense>
    )
}
