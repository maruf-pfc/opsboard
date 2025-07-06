import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER', 'TRAINER']),
  phone: z.string().optional(),
  facebookUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  profileImage: z.string().optional(),
});

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  facebookUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  profileImage: z.string().optional(),
});

// Payment validation schema
export const paymentSchema = z.object({
  trainer: z.string().min(1, 'Please select a trainer'),
  amount: z.number().min(0, 'Amount must be positive'),
  month: z.string().min(1, 'Please select a month'),
  status: z.enum(['Pending', 'Paid']),
  notes: z.string().optional(),
  date: z.string().optional(),
  courseName: z.string().min(1, 'Please select a course'),
  batchNo: z.string().min(1, 'Please enter batch number'),
  classNo: z.string().min(1, 'Please enter class number'),
});

// Contest validation schema
export const contestSchema = z.object({
  courseName: z.enum(['CPC', 'JIPC', 'Bootcamp']),
  batchNo: z.number().min(1, 'Batch number must be at least 1'),
  contestName: z.string().min(2, 'Contest name must be at least 2 characters'),
  platform: z.string().min(1, 'Please select a platform'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Please select an assigned user'),
  reportedTo: z.string().min(1, 'Please select a reported user'),
  estimatedTime: z
    .number()
    .min(1, 'Estimated time must be at least 1 hour')
    .optional(),
});

// Contest Video Solution validation schema
export const problemSchema = z.object({
  courseName: z.enum(['CPC', 'JIPC', 'Bootcamp']),
  batchNo: z.number().min(1, 'Batch number must be at least 1'),
  contestName: z.string().min(2, 'Contest name must be at least 2 characters'),
  onlineJudge: z.string().min(1, 'Please select an online judge'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Please select an assigned user'),
  reportedTo: z.string().min(1, 'Please select a reported user'),
  estimatedTime: z.string().min(1, 'Please enter estimated time'),
  platform: z.enum(['Google Classroom', 'Website']),
});

// Marketing task validation schema
export const marketingTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  dueDate: z.string().min(1, 'Please select a due date'),
  assignedTo: z.string().min(1, 'Please select an assigned user'),
  reportedTo: z.string().min(1, 'Please select a reported user'),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Video validation schema
export const videoSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  url: z.string().url('Invalid YouTube URL'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().optional(),
});

// Class validation schema
export const classSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  trainer: z.string().min(1, 'Please select a trainer'),
  schedule: z.string().min(1, 'Please select a schedule'),
  description: z.string().optional(),
});

// Type exports
export type UserFormData = z.infer<typeof userSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type ContestFormData = z.infer<typeof contestSchema>;
export type ProblemFormData = z.infer<typeof problemSchema>;
export type MarketingTaskFormData = z.infer<typeof marketingTaskSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VideoFormData = z.infer<typeof videoSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
