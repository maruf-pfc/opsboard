import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum([
    'ADMIN',
    'MANAGER',
    'MEMBER',
    'TRAINER',
    'Developer',
    'Teaching Assistant',
  ]),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
  role: z.enum([
    'ADMIN',
    'MANAGER',
    'MEMBER',
    'TRAINER',
    'Developer',
    'Teaching Assistant',
  ]),
});

// Payment validation schema
export const paymentSchema = z.object({
  trainer: z.string().min(1, 'Please select a trainer'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  details: z
    .object({
      courseName: z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']).optional(),
      batchNo: z.string().optional(),
      classNo: z.string().optional(),
    })
    .optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  status: z.enum(['Pending', 'Paid']),
  date: z.string().optional(),
  notes: z.string().optional(),
  processedBy: z.string().optional(),
});

// Contest validation schema
export const contestSchema = z.object({
  courseName: z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']),
  batchNo: z.number().min(1, 'Batch number must be at least 1'),
  contestName: z.string().min(2, 'Contest name must be at least 2 characters'),
  onlineJudge: z.enum(['Leetcode', 'Vjudge']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Please select an assigned user'),
  reportedTo: z.string().min(1, 'Please select a reported user'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

// Contest Video Solution validation schema
export const problemSchema = z.object({
  courseName: z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']),
  batchNo: z.string().min(1, 'Batch number is required'),
  contestName: z.string().min(2, 'Contest name must be at least 2 characters'),
  onlineJudge: z.enum(['Leetcode', 'Vjudge']),
  platform: z.enum(['Google Classroom', 'Website']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Please select an assigned user'),
  reportedTo: z.string().min(1, 'Please select a reported user'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

// Marketing task validation schema
export const marketingTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Please select an assigned user').optional(),
  reportedTo: z.string().min(1, 'Please select a reported user').optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
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

// Class validation schema
export const classSchema = z.object({
  courseName: z.enum(['CPC', 'JIPC', 'Bootcamp', 'Others']),
  batchNo: z.number().min(1, 'Batch number must be at least 1'),
  classNo: z.number().min(1, 'Class number must be at least 1'),
  classTitle: z.string().min(2, 'Class title must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']),
  assignedTo: z.string().min(1, 'Please select an assigned user'),
  reportedTo: z.string().min(1, 'Please select a reported user'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  schedule: z.string().optional(),
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
export type ClassFormData = z.infer<typeof classSchema>;
