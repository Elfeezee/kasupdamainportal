'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoreHorizontal, Search, UserPlus, Trash2, ShieldCheck, UserCog, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getAllUsers, updateUserRole, deleteUserRecord } from '@/app/actions/superAdminActions';
import { cn } from '@/lib/utils';
import AddUserDialog from './AddUserDialog';

// Define a user structure based on supabase data
interface AppUser {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'Applicant' | 'Admin' | 'Finance' | 'Super Admin';
  created_at: string;
  din: string | null;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users from the database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (uid: string, newRole: string) => {
    setIsUpdating(uid);
    try {
      const result = await updateUserRole(uid, newRole);

      if (result.success) {
        // Update local state to reflect change immediately
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.uid === uid ? { ...user, role: newRole as any } : user
          )
        );

        toast({
          title: "User Role Updated",
          description: `The user's role has been changed to ${newRole}.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Could not update the user role.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const openDeleteDialog = (user: AppUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const result = await deleteUserRecord(userToDelete.uid);
      if (result.success) {
        setUsers(prev => prev.filter(u => u.uid !== userToDelete.uid));
        toast({
          title: "User Record Deleted",
          description: `The user record for ${userToDelete.email} has been removed from the public database.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete user record.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }


  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.din || '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-8">
      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">User Management</CardTitle>
                <CardDescription>Administrative control over user roles and access levels.</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <AddUserDialog onUserAdded={fetchUsers} />
              <Button className="gap-2 shadow-md hover:shadow-lg transition-all" variant="outline" onClick={fetchUsers} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh List"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or DIN..."
                className="pl-10 bg-white/80 border-slate-200 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold">User</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">DIN</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Date Joined</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading users from database...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.name || 'User'} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">{(user.name || 'U').charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{user.name || 'N/A'}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{user.uid.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{user.email || 'N/A'}</TableCell>
                      <TableCell className="font-mono text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">{user.din || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === 'Super Admin' ? 'default' :
                            user.role === 'Admin' ? 'destructive' :
                              user.role === 'Finance' ? 'secondary' :
                                'outline'
                        } className={cn(
                          "capitalize px-2 py-0.5 text-[10px] font-bold",
                          user.role === 'Super Admin' && "bg-purple-600 hover:bg-purple-700 text-white border-none",
                          user.role === 'Finance' && "bg-blue-600 hover:bg-blue-700 text-white border-none"
                        )}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{user.created_at ? format(parseISO(user.created_at), 'dd MMM, yyyy') : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full" disabled={isUpdating === user.uid}>
                              {isUpdating === user.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Change Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'Super Admin')} disabled={user.role === 'Super Admin'}>
                                    Make Super Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'Admin')} disabled={user.role === 'Admin'}>
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'Finance')} disabled={user.role === 'Finance'}>
                                    Make Finance
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'Applicant')} disabled={user.role === 'Applicant'}>
                                    Make Applicant
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-destructive focus:bg-destructive/5">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <p className="text-slate-500 font-medium">No users found matching your search.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">Delete User Record?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              This will remove the user's profile and data from the public database. Note that the authentication account will remain active unless deleted from the Supabase Auth dashboard.
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Target User</p>
                <p className="text-sm font-bold text-slate-900">{userToDelete?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-500">{userToDelete?.email}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className={cn(buttonVariants({ variant: "destructive" }), "rounded-xl shadow-md shadow-destructive/20")}>Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
