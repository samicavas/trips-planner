import { z } from 'zod';

export const createTripNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').min(2, 'Title must be at least 2 characters'),
  content: z.string().min(1, 'Note content is required'),
  noteDate: z.string().min(1, 'Date is required'),
});

export const updateTripNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').min(2, 'Title must be at least 2 characters'),
  content: z.string().min(1, 'Note content is required'),
  noteDate: z.string().min(1, 'Date is required'),
});

export type CreateTripNoteFormValues = z.infer<typeof createTripNoteSchema>;
export type UpdateTripNoteFormValues = z.infer<typeof updateTripNoteSchema>;
