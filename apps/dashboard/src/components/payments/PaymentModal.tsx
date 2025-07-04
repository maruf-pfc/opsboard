import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IPayment } from '@/app/(dashboard)/payments/page';

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
  const [trainerId, setTrainerId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Paid'>('Pending');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [courseName, setCourseName] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [classNo, setClassNo] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/users').then((res) => setUsers(res.data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentToEdit) {
      setTrainerId(paymentToEdit.trainer._id);
      setAmount(String(paymentToEdit.amount));
      setMonth(paymentToEdit.month || '');
      setStatus(paymentToEdit.status);
      setNotes(paymentToEdit.notes || '');
      setDate(
        paymentToEdit.createdAt ? paymentToEdit.createdAt.substring(0, 10) : '',
      );
      setCourseName(paymentToEdit.courseName || '');
      setBatchNo(paymentToEdit.batchNo || '');
      setClassNo(paymentToEdit.classNo || '');
    } else {
      setTrainerId('');
      setAmount('');
      setMonth('');
      setStatus('Pending');
      setNotes('');
      setDate('');
      setCourseName('');
      setBatchNo('');
      setClassNo('');
    }
  }, [paymentToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const paymentData = {
      trainer: trainerId,
      amount: Number(amount),
      month,
      status,
      notes,
      createdAt: date ? new Date(date) : undefined,
      courseName: courseName || undefined,
      batchNo: batchNo || undefined,
      classNo: classNo || undefined,
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <select
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={users.find((u) => u._id === trainerId)?.role || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                {users.find((u) => u._id === trainerId)?.role === 'TRAINER' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Course
                      </label>
                      <select
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="">Select</option>
                        <option value="CPC">CPC</option>
                        <option value="JIPC">JIPC</option>
                        <option value="Bootcamp">Bootcamp</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Batch No
                      </label>
                      <input
                        type="text"
                        value={batchNo}
                        onChange={(e) => setBatchNo(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Class No
                      </label>
                      <input
                        type="text"
                        value={classNo}
                        onChange={(e) => setClassNo(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[60px]"
                />
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
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                >
                  Save Record
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
