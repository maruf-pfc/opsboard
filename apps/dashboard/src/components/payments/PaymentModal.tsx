import { Fragment, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IPayment } from '@/app/(dashboard)/payments/page';
import { paymentSchema, type PaymentFormData } from '@/lib/validations';
import { Dialog, Transition } from '@headlessui/react';
import { formatDateForInput } from '@/lib/utils';

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
    },
  });

  const watchedTrainer = watch('trainer');

  useEffect(() => {
    if (isOpen) {
      api.get('/users').then((res) => setUsers(res.data));
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

  useEffect(() => {
    if (paymentToEdit) {
      console.log('Editing payment:', paymentToEdit); // DEBUG LOG
      console.log('Payment dates:', {
        startDate: paymentToEdit.startDate,
        dueDate: paymentToEdit.dueDate,
        startDateFormatted: formatDateForInput(paymentToEdit.startDate),
        dueDateFormatted: formatDateForInput(paymentToEdit.dueDate),
      }); // DEBUG LOG
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
        priority: paymentToEdit.priority || 'NORMAL',
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
    console.log('Submitting payment data:', data); // DEBUG LOG
    const payload = {
      amount: data.amount,
      status: data.status,
      trainer: data.trainer,
      name: data.name,
      details: {
        courseName: data.details?.courseName,
        batchNo: data.details?.batchNo,
        classNo: data.details?.classNo,
      },
      classTitle: data.classTitle,
      priority: data.priority,
      startDate: data.startDate,
      dueDate: data.dueDate,
      assignedTo: data.assignedTo,
      reportedTo: data.reportedTo,
      notes: data.notes,
    };
    console.log('Final payload:', payload); // DEBUG LOG
    try {
      if (paymentToEdit) {
        const response = await api.put(
          `/payments/${paymentToEdit._id}`,
          payload,
        );
        console.log('Update response:', response.data); // DEBUG LOG
        toast.success('Record updated!');
      } else {
        const response = await api.post('/payments', payload);
        console.log('Create response:', response.data); // DEBUG LOG
        toast.success('Record created!');
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Payment submission error:', error); // DEBUG LOG
      toast.error('An error occurred.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4 cursor-pointer">
              {paymentToEdit ? 'Edit Payment' : 'Log New Payment'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Trainer</label>
                <select
                  {...register('trainer')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.trainer ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a user</option>
                  {users.map((user: any) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {errors.trainer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.trainer.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Class Title</label>
                <input
                  type="text"
                  {...register('classTitle')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.classTitle ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter class title"
                />
                {errors.classTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.classTitle.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Details</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Course *
                    </label>
                    <select
                      {...register('details.courseName')}
                      className={`w-full border rounded px-3 py-2 bg-white ${errors.details?.courseName ? 'border-red-500' : ''}`}
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Batch No *
                    </label>
                    <input
                      type="text"
                      {...register('details.batchNo')}
                      className={`w-full border rounded px-3 py-2 ${errors.details?.batchNo ? 'border-red-500' : ''}`}
                      placeholder="e.g., 1"
                    />
                    {errors.details?.batchNo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.details.batchNo.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Class No *
                    </label>
                    <input
                      type="text"
                      {...register('details.classNo')}
                      className={`w-full border rounded px-3 py-2 ${errors.details?.classNo ? 'border-red-500' : ''}`}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    {...register('amount', { valueAsNumber: true })}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.amount ? 'border-red-500' : ''
                    }`}
                    min={0}
                    step={0.01}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    {...register('status')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.status ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Priority</label>
                  <select
                    {...register('priority')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.priority ? 'border-red-500' : ''}`}
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                  </select>
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.priority.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.startDate ? 'border-red-500' : ''}`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Due Date</label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.dueDate ? 'border-red-500' : ''}`}
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Assigned To
                  </label>
                  <select
                    {...register('assignedTo')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.assignedTo ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assignedTo.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Reported To
                  </label>
                  <select
                    {...register('reportedTo')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.reportedTo ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.reportedTo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reportedTo.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  {...register('notes')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${errors.notes ? 'border-red-500' : ''}`}
                  rows={3}
                  placeholder="Optional notes..."
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.notes.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : paymentToEdit
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
