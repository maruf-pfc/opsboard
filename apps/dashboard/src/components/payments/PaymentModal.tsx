import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { IPayment } from "@/app/(dashboard)/payments/page";

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
  const [trainerId, setTrainerId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [status, setStatus] = useState<"Pending" | "Paid">("Pending");
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.get("/users").then((res) => setUsers(res.data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentToEdit) {
      setTrainerId(paymentToEdit.trainer._id);
      setAmount(String(paymentToEdit.amount));
      setMonth(paymentToEdit.month);
      setStatus(paymentToEdit.status);
      setNotes(paymentToEdit.notes || "");
    } else {
      setTrainerId("");
      setAmount("");
      setMonth("");
      setStatus("Pending");
      setNotes("");
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
    };
    try {
      if (paymentToEdit) {
        await api.put(`/payments/${paymentToEdit._id}`, paymentData);
        toast.success("Record updated!");
      } else {
        await api.post("/payments", paymentData);
        toast.success("Record created!");
      }
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* ... (Backdrop from other modals) ... */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title as="h3" className="text-lg font-medium">
                {paymentToEdit ? "Edit Payment" : "Log New Payment"}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label>Trainer</label>
                  <select
                    value={trainerId}
                    onChange={(e) => setTrainerId(e.target.value)}
                    required
                    className="w-full mt-1 rounded-md border-gray-300"
                  >
                    <option value="" disabled>
                      Select a trainer
                    </option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Amount ($)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full mt-1 rounded-md border-gray-300"
                    />
                  </div>
                  <div>
                    <label>Month</label>
                    <input
                      type="text"
                      placeholder="e.g., January 2024"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      required
                      className="w-full mt-1 rounded-md border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full mt-1 rounded-md border-gray-300"
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label>Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full mt-1 rounded-md border-gray-300"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
