import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IPayment } from '@/app/(dashboard)/payments/page';
import { paymentSchema, type PaymentFormData } from '@/lib/validations';
import { Dialog, Transition } from '@headlessui/react';

interface User {
  _id: string;
  name: string;
  role?: string;
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
  const [selectedTrainerRole, setSelectedTrainerRole] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      status: 'Pending',
      trainer: '',
      details: {
        courseName: undefined,
        batchNo: '',
        classNo: '',
      },
      date: '',
      notes: '',
    },
  });

  const watchedTrainer = watch('trainer');

  useEffect(() => {
    if (isOpen) {
      api.get('/users').then((res) => setUsers(res.data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentToEdit) {
      reset({
        amount: paymentToEdit.amount || 0,
        status: paymentToEdit.status || 'Pending',
        trainer: paymentToEdit.trainer?._id || '',
        details: {
          courseName: paymentToEdit.details?.courseName || undefined,
          batchNo: paymentToEdit.details?.batchNo || '',
          classNo: paymentToEdit.details?.classNo || '',
        },
        date: paymentToEdit.date
          ? new Date(paymentToEdit.date).toISOString().slice(0, 16)
          : '',
        notes: paymentToEdit.notes || '',
      });
    } else {
      reset({
        amount: 0,
        status: 'Pending',
        trainer: '',
        details: {
          courseName: undefined,
          batchNo: '',
          classNo: '',
        },
        date: '',
        notes: '',
      });
    }
  }, [paymentToEdit, isOpen, reset]);

  useEffect(() => {
    const selectedUser = users.find((u) => u._id === watchedTrainer);
    setSelectedTrainerRole(selectedUser?.role || '');
  }, [watchedTrainer, users]);

  const onSubmit = async (data: PaymentFormData) => {
    const payload = {
      amount: data.amount,
      status: data.status,
      trainer: data.trainer,
      details: {
        courseName: data.details?.courseName,
        batchNo: data.details?.batchNo,
        classNo: data.details?.classNo,
      },
      date: data.date ? new Date(data.date) : undefined,
      notes: data.notes,
    };
    try {
      if (paymentToEdit) {
        await api.put(`/payments/${paymentToEdit._id}`, payload);
        toast.success('Record updated!');
      } else {
        await api.post('/payments', payload);
        toast.success('Record created!');
      }
      onUpdate();
      onClose();
    } catch (error) {
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
                <label className="block text-sm font-medium">Name</label>
                <select
                  {...register('trainer')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.trainer ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a user</option>
                  {users.map((user: any) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role || 'N/A'})
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
                <label className="block text-sm font-medium">Role</label>
                <input
                  type="text"
                  value={selectedTrainerRole}
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 mt-1 bg-gray-100 text-gray-500"
                />
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
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    {...register('date')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.date ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium">Notes</label>
                  <textarea
                    {...register('notes')}
                    className={`w-full border rounded px-3 py-2 mt-1 ${
                      errors.notes ? 'border-red-500' : ''
                    }`}
                    rows={3}
                    placeholder="Optional notes..."
                  />
                  {errors.notes && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.notes.message}
                    </p>
                  )}
                </div>
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
