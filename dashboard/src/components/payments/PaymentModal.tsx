'use client';

import { Fragment, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Controller is not used, can be removed if not needed elsewhere
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IPayment } from '@/app/(dashboard)/payments/page'; // Assuming this path is correct for IPayment interface
import { paymentSchema, type PaymentFormData } from '@/lib/validations';
import { Dialog, Transition } from '@headlessui/react';
import { formatDateForInput } from '@/lib/utils'; // Assuming this utility formats date to YYYY-MM-DD
import {
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'; // Importing icons

interface User {
  _id: string;
  name: string;
}

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  paymentToEdit?: IPayment | null;
};

export function PaymentModal({
  isOpen,
  onClose,
  onUpdate,
  paymentToEdit,
}: PaymentModalProps) {
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      status: 'Pending',
      trainer: '',
      name: '',
      details: {
        courseName: undefined, // Use undefined for initial empty state for selects
        batchNo: '',
        classNo: '',
      },
      classTitle: '',
      priority: 'NORMAL',
      startDate: '',
      dueDate: '',
      assignedTo: '',
      reportedTo: '',
      notes: '',
    },
  });

  const watchedTrainer = watch('trainer');

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      api
        .get('/users')
        .then((res) => setUsers(res.data))
        .catch((err) => {
          console.error('Failed to fetch users:', err);
          toast.error('Failed to load users for selection.');
        });
    }
  }, [isOpen]);

  // Set name when trainer changes
  useEffect(() => {
    const selectedUser = users.find((u) => u._id === watchedTrainer);
    if (selectedUser) {
      setValue('name', selectedUser.name);
    } else {
      setValue('name', '');
    }
  }, [watchedTrainer, users, setValue]);

  // Reset form with payment data when editing or opening new modal
  useEffect(() => {
    if (paymentToEdit) {
      reset({
        amount: paymentToEdit.amount || 0,
        status: paymentToEdit.status || 'Pending',
        trainer: paymentToEdit.trainer?._id || '',
        name: paymentToEdit.name || '',
        details: {
          courseName: paymentToEdit.details?.courseName || undefined,
          batchNo: paymentToEdit.details?.batchNo || '',
          classNo: paymentToEdit.details?.classNo || '',
        },
        classTitle: paymentToEdit.classTitle || '',
        priority:
          paymentToEdit.priority === 'LOW'
            ? 'MEDIUM'
            : paymentToEdit.priority || 'NORMAL',
        startDate: formatDateForInput(paymentToEdit.startDate),
        dueDate: formatDateForInput(paymentToEdit.dueDate),
        assignedTo: paymentToEdit.assignedTo?._id || '',
        reportedTo: paymentToEdit.reportedTo?._id || '',
        notes: paymentToEdit.notes || '',
      });
    } else {
      reset({
        amount: 0,
        status: 'Pending',
        trainer: '',
        name: '',
        details: {
          courseName: undefined,
          batchNo: '',
          classNo: '',
        },
        classTitle: '',
        priority: 'NORMAL',
        startDate: '',
        dueDate: '',
        assignedTo: '',
        reportedTo: '',
        notes: '',
      });
    }
  }, [paymentToEdit, isOpen, reset]);

  const onSubmit = async (data: PaymentFormData) => {
    // Convert date strings to Date objects for the backend if needed
    const payload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    try {
      if (paymentToEdit) {
        await api.put(`/payments/${paymentToEdit._id}`, payload);
        toast.success('Payment record updated successfully!');
      } else {
        await api.post('/payments', payload);
        toast.success('Payment record created successfully!');
      }
      onUpdate(); // Trigger data refresh in parent component
      onClose(); // Close the modal
    } catch (err: any) {
      console.error('Payment submission error:', err.response?.data || err);
      toast.error(
        err?.response?.data?.message || 'Failed to save payment record.'
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 font-sans" onClose={onClose}>
        {/* Backdrop overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Modal content wrapper */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all sm:p-8">
                {' '}
                {/* Increased max-w-xl to max-w-2xl */}
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-extrabold leading-6 text-gray-900"
                  >
                    {paymentToEdit ? 'Edit Payment Record' : 'Log New Payment'}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-full border border-transparent bg-gray-100 p-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors duration-200"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Trainer & Class Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="trainer"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Trainer
                      </label>
                      <select
                        id="trainer"
                        {...register('trainer')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.trainer ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Select a Trainer</option>{' '}
                        {/* Changed text */}
                        {users.map((user: any) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      {errors.trainer && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.trainer.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="classTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Class Title
                      </label>
                      <input
                        id="classTitle"
                        type="text"
                        {...register('classTitle')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.classTitle ? 'border-red-500' : ''
                        }`}
                        placeholder="e.g., Data Structures Class 1"
                      />
                      {errors.classTitle && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.classTitle.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details (Course, Batch, Class No) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Details
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      {' '}
                      {/* Added styling for details group */}
                      <div>
                        <label
                          htmlFor="details.courseName"
                          className="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Course Name *
                        </label>
                        <select
                          id="details.courseName"
                          {...register('details.courseName')}
                          className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                            errors.details?.courseName ? 'border-red-500' : ''
                          }`}
                        >
                          <option value="">Select Course</option>
                          <option value="CPC">CPC</option>
                          <option value="JIPC">JIPC</option>
                          <option value="Bootcamp">Bootcamp</option>
                          <option value="Others">Others</option>
                        </select>
                        {errors.details?.courseName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.details.courseName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="details.batchNo"
                          className="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Batch No *
                        </label>
                        <input
                          id="details.batchNo"
                          type="text"
                          {...register('details.batchNo')}
                          className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                            errors.details?.batchNo ? 'border-red-500' : ''
                          }`}
                          placeholder="e.g., 1"
                        />
                        {errors.details?.batchNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.details.batchNo.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="details.classNo"
                          className="block text-xs font-medium text-gray-600 mb-1"
                        >
                          Class No *
                        </label>
                        <input
                          id="details.classNo"
                          type="text"
                          {...register('details.classNo')}
                          className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                            errors.details?.classNo ? 'border-red-500' : ''
                          }`}
                          placeholder="e.g., 1"
                        />
                        {errors.details?.classNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.details.classNo.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>
                      <input
                        id="amount"
                        type="number"
                        {...register('amount', { valueAsNumber: true })}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.amount ? 'border-red-500' : ''
                        }`}
                        min={0}
                        step={0.01}
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        {...register('status')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.status ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Priority, Start Date, Due Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {' '}
                    {/* Changed to 3 columns */}
                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Priority
                      </label>
                      <select
                        id="priority"
                        {...register('priority')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.priority ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                      </select>
                      {errors.priority && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.startDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Due Date
                      </label>
                      <input
                        id="dueDate"
                        type="date"
                        {...register('dueDate')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.dueDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.dueDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assigned To & Reported To */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="assignedTo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Assigned To
                      </label>
                      <select
                        id="assignedTo"
                        {...register('assignedTo')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.assignedTo ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      {errors.assignedTo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.assignedTo.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="reportedTo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Reported To
                      </label>
                      <select
                        id="reportedTo"
                        {...register('reportedTo')}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                          errors.reportedTo ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      {errors.reportedTo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.reportedTo.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      {...register('notes')}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 transition-all duration-200 ${
                        errors.notes ? 'border-red-500' : ''
                      }`}
                      rows={4}
                      placeholder="Optional notes about the payment..." // More descriptive placeholder
                    />
                    {errors.notes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-medium cursor-pointer shadow-sm"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : paymentToEdit ? (
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <PlusIcon className="h-5 w-5 mr-2" />
                      )}
                      {isSubmitting
                        ? paymentToEdit
                          ? 'Updating...'
                          : 'Creating...'
                        : paymentToEdit
                        ? 'Update Record' // Changed from 'Update' for clarity
                        : 'Create Record'}{' '}
                      {/* Changed from 'Create' for clarity */}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
