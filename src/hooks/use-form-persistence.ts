import { useEffect } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

/**
 * A hook to persist form data to localStorage.
 * 
 * @param form The react-hook-form instance.
 * @param storageKey The key to use in localStorage.
 * @param excludeFields Fields that should not be persisted (e.g., FileList, passwords).
 */
export function useFormPersistence<TFieldValues extends FieldValues>(
    form: UseFormReturn<TFieldValues>,
    storageKey: string,
    excludeFields: any[] = []
) {
    const { watch, reset, getValues } = form;

    // Load data on mount
    useEffect(() => {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);

                // Convert date strings back to Date objects if they look like ISO dates
                const reviveDates = (obj: any) => {
                    for (const key in obj) {
                        if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj[key])) {
                            obj[key] = new Date(obj[key]);
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            reviveDates(obj[key]);
                        }
                    }
                };
                reviveDates(parsedData);

                // Merge with current values to preserve defaults for fields not in storage
                reset({ ...getValues(), ...parsedData });
            } catch (e) {
                console.error('Failed to parse form persistence data', e);
            }
        }
    }, [reset, storageKey]);

    // Save data on change
    useEffect(() => {
        const subscription = watch((value) => {
            const dataToSave = { ...value };

            // Remove excluded fields
            excludeFields.forEach((field) => {
                delete dataToSave[field];
            });

            // Automatically remove FileList and File objects
            const cleanData = (obj: any) => {
                for (const key in obj) {
                    if (obj[key] instanceof FileList || (typeof File !== 'undefined' && obj[key] instanceof File)) {
                        delete obj[key];
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        cleanData(obj[key]);
                    }
                }
            };
            cleanData(dataToSave);

            localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        });
        return () => subscription.unsubscribe();
    }, [watch, storageKey, excludeFields]);

    // Function to clear the storage (e.g., after successful submission)
    const clearStorage = () => {
        localStorage.removeItem(storageKey);
    };

    return { clearStorage };
}
