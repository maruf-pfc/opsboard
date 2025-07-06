import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Transition } from '@headlessui/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IPayment } from '@/app/(dashboard)/payments/page';
import { paymentSchema, type PaymentFormData } from '@/lib/validations';

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
      trainer: '',
      amount: 0,
      month: '',
      status: 'Pending',
      notes: '',
      date: '',
      courseName: '',
      batchNo: '',
      classNo: '',
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
        trainer: paymentToEdit.trainer._id,
        amount: paymentToEdit.amount,
        month: paymentToEdit.month || '',
        status: paymentToEdit.status,
        notes: paymentToEdit.notes || '',
        date: paymentToEdit.createdAt
          ? paymentToEdit.createdAt.substring(0, 10)
          : '',
        courseName: paymentToEdit.courseName || '',
        batchNo: paymentToEdit.batchNo || '',
        classNo: paymentToEdit.classNo || '',
      });
    } else {
      reset({
        trainer: '',
        amount: 0,
        month: '',
        status: 'Pending',
        notes: '',
        date: '',
        courseName: '',
        batchNo: '',
        classNo: '',
      });
    }
  }, [paymentToEdit, isOpen, reset]);

  useEffect(() => {
    const selectedUser = users.find((u) => u._id === watchedTrainer);
    setSelectedTrainerRole(selectedUser?.role || '');
  }, [watchedTrainer, users]);

  const onSubmit = async (data: PaymentFormData) => {
    const paymentData = {
      trainer: data.trainer,
      amount: data.amount,
      month: data.month,
      status: data.status,
      notes: data.notes,
      createdAt: data.date ? new Date(data.date) : undefined,
      courseName: data.courseName,
      batchNo: data.batchNo,
      classNo: data.classNo,
    };
    try {
      if (paymentToEdit) {
        await api.put(`/payments/${paymentToEdit._id}`, paymentData);
        toast.success('Record updated!');
      } else {
        await api.post('/payments', paymentData);
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
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onClose}
      >
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-lg mx-auto">
          <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl p-8 w-full">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <Dialog.Title
              as="h2"
              className="text-2xl font-bold mb-6 text-gray-800"
            >
              {paymentToEdit ? 'Edit Payment' : 'Log New Payment'}
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <select
                  {...register('trainer')}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white ${
                    errors.trainer ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="" disabled>
                    Select a user
                  </option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={selectedTrainerRole}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                {selectedTrainerRole === 'TRAINER' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Course *
                      </label>
                      <select
                        {...register('courseName')}
                        className={`w-full border rounded-lg px-3 py-2 bg-white ${
                          errors.courseName
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Course</option>
                        <option value="CPC">CPC</option>
                        <option value="JIPC">JIPC</option>
                        <option value="Bootcamp">Bootcamp</option>
                      </select>
                      {errors.courseName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.courseName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Batch No *
                      </label>
                      <input
                        type="text"
                        {...register('batchNo')}
                        className={`w-full border rounded-lg px-3 py-2 ${
                          errors.batchNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 1, 2, 3"
                      />
                      {errors.batchNo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.batchNo.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Class No *
                      </label>
                      <input
                        type="text"
                        {...register('classNo')}
                        className={`w-full border rounded-lg px-3 py-2 ${
                          errors.classNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 1, 2, 3"
                      />
                      {errors.classNo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.classNo.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Course, Batch, and Class details are required for trainers
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    {...register('amount', { valueAsNumber: true })}
                    className={`w-full border rounded-lg px-3 py-2 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  {...register('month')}
                  className={`w-full border rounded-lg px-3 py-2 bg-white ${
                    errors.month ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                {errors.month && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.month.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[60px]"
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.notes.message}
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
