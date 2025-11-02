

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { MoreHorizontal, Search, UserPlus, Trash2 } from 'lucide-react';
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
import { supabase } from '@/lib/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


// Define a user structure based on supabase data
interface AppUser {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'Applicant' | 'Admin';
  created_at: string;
  din: string | null; // Add DIN property
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = React.useCallback(async () => {
      setLoading(true);
      try {
        const { data: fetchedUsers, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        setUsers(fetchedUsers || []);
      } catch (error) {
          console.error("Failed to fetch users from Supabase:", error);
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

  const handleRoleChange = async (uid: string, newRole: 'Admin' | 'Applicant') => {
    try {
        const { error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('uid', uid);

        if (error) throw error;

        // Update local state to reflect change immediately
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.uid === uid ? { ...user, role: newRole } : user
            )
        );

        toast({
            title: "User Role Updated",
            description: `The user's role has been changed to ${newRole}.`,
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        toast({
            title: 'Error',
            description: 'Could not update the user role in the database.',
            variant: 'destructive',
        });
    }
  };
  
  const openDeleteDialog = (user: AppUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  // NOTE: This function is a placeholder for a future secure implementation.
  // Deleting users should be handled with extreme care, ideally with a server-side
  // function that checks permissions and cascades deletions properly.
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    toast({
        title: "Delete Action Disabled",
        description: `For security reasons, deleting users (${userToDelete.email}) from the admin UI is disabled in this prototype. This would require a secure server-side function.`,
        variant: "destructive",
        duration: 8000,
    });
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  }


  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.din || '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View, search, and manage user roles from the Supabase database.</CardDescription>
            </div>
            <Button className="gap-2" disabled>
              <UserPlus className="h-4 w-4" /> Add New User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or DIN..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>DIN</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Loading users from database...
                        </TableCell>
                    </TableRow>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                    <TableRow key={user.uid}>
                        <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${(user.name || 'U').charAt(0)}`} alt={user.name || 'User'} data-ai-hint="person portrait" />
                            <AvatarFallback>{(user.name || 'U').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name || 'N/A'}</span>
                        </div>
                        </TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell className="font-mono text-xs">{user.din || 'N/A'}</TableCell>
                        <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.created_at ? format(parseISO(user.created_at), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                <span>Change Role</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'Admin')} disabled={user.role === 'Admin'}>
                                        Make Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRoleChange(user.uid, 'Applicant')} disabled={user.role === 'Applicant'}>
                                        Make Applicant
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                     <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is highly destructive and cannot be undone. This will permanently delete the user <span className="font-semibold">{userToDelete?.email}</span> and all of their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className={buttonVariants({ variant: "destructive" })}>Delete User</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
