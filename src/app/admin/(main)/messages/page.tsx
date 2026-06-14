
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, Mail, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getContactMessages, markMessageAsRead, deleteMessage } from '@/app/actions/contactActions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Define a structure for the contact message
interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  created_at: string;
  is_read: boolean;
}

export default function ManageContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchMessages = React.useCallback(async () => {
      setLoading(true);
      try {
        const fetchedMessages = await getContactMessages();
        // fetchedMessages already has is_read from the database
        setMessages(fetchedMessages as unknown as ContactMessage[] || []);
      } catch (error) {
           console.error("Failed to fetch messages:", error);
           toast({
            title: "Error",
            description: "Failed to load messages from the database.",
            variant: "destructive",
        });
      } finally {
          setLoading(false);
      }
  }, [toast]);


  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  const handleMarkAsRead = async (message: ContactMessage) => {
    if (message.is_read) return; // Don't re-mark if already read

    try {
        const result = await markMessageAsRead(message.id);

        if (!result.success) throw new Error(result.error);

        // Optimistically update the UI
        setMessages(prev => 
            prev.map(msg => msg.id === message.id ? { ...msg, is_read: true } : msg)
        );

    } catch (error) {
        console.error("Error marking message as read:", error);
    }
  };


  const openDeleteDialog = (e: React.MouseEvent, message: ContactMessage) => {
    e.stopPropagation(); // Prevent the row click from triggering
    setMessageToDelete(message);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    handleMarkAsRead(message); // Mark as read when opened
  };
  
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
        const result = await deleteMessage(messageToDelete.id);
        
        if (!result.success) throw new Error(result.error);

        setMessages(prev => prev.filter(msg => msg.id !== messageToDelete.id));
        toast({
            title: "Message Deleted",
            description: `The message from ${messageToDelete.name} has been deleted.`,
        });

    } catch (error) {
        console.error("Error deleting message:", error);
        toast({
            title: 'Error',
            description: 'Could not delete the message from the database.',
            variant: 'destructive',
        });
    } finally {
        setIsDeleteDialogOpen(false);
        setMessageToDelete(null);
    }
  }


  const filteredMessages = messages.filter(message =>
    (message.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View and manage messages submitted through the contact form. Click a row to view the full message.</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or subject..." 
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
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Loading messages from database...
                        </TableCell>
                    </TableRow>
                ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                    <TableRow 
                      key={message.id} 
                      onClick={() => openViewDialog(message)} 
                      className={cn("cursor-pointer", !message.is_read && "bg-primary/5 font-semibold")}
                    >
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                               {!message.is_read && <div className="h-2 w-2 rounded-full bg-accent" />}
                               <div className="flex flex-col">
                                    <span>{message.name || 'N/A'}</span>
                                    <span className="text-xs text-muted-foreground font-normal">{message.email || 'No email'}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{message.subject || 'No Subject'}</TableCell>
                        <TableCell>{message.created_at ? format(parseISO(message.created_at), 'dd MMM, yyyy') : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => openViewDialog(message)}>
                                        View Message
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => openDeleteDialog(e, message)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No messages found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>Message from {selectedMessage.name}</DialogTitle>
                <DialogDescription className="pt-2 text-left">
                  <p><strong>Email:</strong> {selectedMessage.email}</p>
                  <p><strong>Subject:</strong> {selectedMessage.subject}</p>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 whitespace-pre-wrap text-sm text-foreground bg-muted/50 p-4 rounded-md max-h-[50vh] overflow-y-auto">
                {selectedMessage.message}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message from <span className="font-semibold">{messageToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Message</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
