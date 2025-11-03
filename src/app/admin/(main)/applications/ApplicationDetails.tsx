
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';

const renderFieldValue = (
    key: string,
    value: any,
    isEditing: boolean,
    editedData: Record<string, any>,
    onInputChange: (key: string, value: string | boolean) => void
) => {
    // Skip internal fields from rendering
    if (['id', 'user_id', 'created_at', 'rejection_reason'].includes(key)) {
        return null;
    }

    // If a field ends with '_url' but the value is null or empty, don't render it.
    if (key.endsWith('_url') && !value) {
        return null;
    }
    
    // Standardize 'on' to true for consistency
    if (value === 'on') value = true;

    // --- Edit Mode ---
    if (isEditing) {
        const currentEditedValue = editedData[key] ?? value;
        if (typeof value === 'boolean') {
            return (
                <Checkbox
                    className="w-6 h-6"
                    checked={!!currentEditedValue}
                    onCheckedChange={(checked) => onInputChange(key, !!checked)}
                />
            );
        }
        if (key.toLowerCase().includes('date') && typeof value === 'string' && !isNaN(Date.parse(value))) {
            return (
                 <Input
                    type="date"
                    value={currentEditedValue ? format(parseISO(currentEditedValue), 'yyyy-MM-dd') : ''}
                    onChange={(e) => onInputChange(key, e.target.value)}
                />
            );
        }
        if (key.endsWith('_url') && typeof value === 'string') {
             return <p className="text-sm text-muted-foreground">[File URL - not editable here]</p>;
        }
        return <Input value={currentEditedValue ?? ''} onChange={(e) => onInputChange(key, e.target.value)} />;
    }

    // --- Display Mode ---
    if (typeof value === 'boolean') {
        return value ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>;
    }
    
    if (key.endsWith('_url') && typeof value === 'string' && value) {
        return (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                <Download className="h-4 w-4" /> Download File
            </a>
        );
    }
    
    if (key.toLowerCase().includes('date') && typeof value === 'string' && !isNaN(Date.parse(value))) {
        return <p className="text-sm text-foreground">{format(parseISO(value), 'PPP')}</p>;
    }

    return <p className="text-sm text-foreground">{value || <span className="text-muted-foreground italic">Not provided</span>}</p>;
};

interface ApplicationDetailsProps {
    application: Record<string, any>;
    isEditing: boolean;
    editedData: Record<string, any>;
    onInputChange: (key: string, value: string | boolean) => void;
}

export default function ApplicationDetails({ application, isEditing, editedData, onInputChange }: ApplicationDetailsProps) {
    const sortedKeys = Object.keys(application).sort();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Application Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {sortedKeys.map((key) => {
                    const value = application[key];
                    // Skip null/undefined values unless in edit mode where we might want to add data
                    if (value === null && !isEditing) return null;
                    
                    const renderedField = renderFieldValue(key, value, isEditing, editedData, onInputChange);
                    if (!renderedField) return null;

                    // Don't render the plain URL field if we've already rendered it as a download link
                    if (key.endsWith('_url')) {
                        const baseKey = key.replace('_url', '');
                        if (sortedKeys.includes(baseKey)) {
                            // This logic is tricky, let's just show the link under its own name
                        }
                    }


                    return (
                        <div key={key} className="space-y-1">
                            <Label className="capitalize text-xs text-muted-foreground">{key.replace(/_/g, ' ').replace(' doc ', ' ').replace(' url', '')}</Label>
                            {renderedField}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
