import { z } from 'zod';

export const addTripSchema = z.object({
  title: z.string().min(1, 'Required Title').min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(1, 'Destination is required').min(2, 'Destination must be at least 2 characters'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const editTripSchema = z.object({
  title: z.string().min(1, 'Required Title').min(3, 'Title must be at least 3 characters'),
  destination: z.string().min(1, 'Destination is required').min(2, 'Destination must be at least 2 characters'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type AddTripFormValues = z.infer<typeof addTripSchema>;
export type EditTripFormValues = z.infer<typeof editTripSchema>;
