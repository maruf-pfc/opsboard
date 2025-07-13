import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { userSchema, type UserFormData } from '@/lib/validations';
import api from '@/lib/api';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { z } from 'zod';

interface IUser {
  _id?: string;
  name: string;
  email: string;
  role:
    | 'ADMIN'
    | 'MANAGER'
    | 'MEMBER'
    | 'TRAINER'
    | 'Developer'
    | 'Teaching Assistant';
  phone?: string;
  facebookUrl?: string;
  profileImage?: string;
  createdAt?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<IUser, '_id'>) => void;
  user: IUser | null;
}

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  user,
}: UserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'MEMBER',
      phone: '',
      facebookUrl: '',
      profileImage: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'MEMBER',
        phone: user.phone || '',
        facebookUrl: user.facebookUrl || '',
        profileImage: user.profileImage || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        role: 'MEMBER',
        phone: '',
        facebookUrl: '',
        profileImage: '',
      });
    }
  }, [user, isOpen, reset]);

  const onSubmit = (data: UserFormData) => {
    // Only include password if present (for create), omit for edit
    const submitData = { ...data };
    if (!data.password) {
      delete submitData.password;
    }
    onSave(submitData);
  };

  const roleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'TRAINER', label: 'Trainer' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Teaching Assistant', label: 'Teaching Assistant' },
  ];

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
              {user ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  {...register('role')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.role ? 'border-red-500' : ''
                  }`}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Facebook URL
                </label>
                <input
                  type="text"
                  {...register('facebookUrl')}
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors.facebookUrl ? 'border-red-500' : ''
                  }`}
                />
                {errors.facebookUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.facebookUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  {...register('profileImage')}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profileImage.message}
                  </p>
                )}
              </div>
              {/* Only show password field when creating a new user */}
              {!user && (
                <div>
                  <label className="block text-sm font-medium">
                    Default Password
                  </label>
                  <input
                    type="text"
                    {...register('password', { required: true })}
                    className={`w-full border rounded px-3 py-2 mt-1 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter default password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

// Add types for CreateUserModal props and form/errors
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role:
    | 'ADMIN'
    | 'MANAGER'
    | 'MEMBER'
    | 'TRAINER'
    | 'Developer'
    | 'Teaching Assistant';
  phone?: string;
  facebookUrl?: string;
  profileImage?: string;
}

interface CreateUserErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  phone?: string;
  facebookUrl?: string;
  profileImage?: string;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
    phone: '',
    facebookUrl: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState<CreateUserErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        phone: '',
        facebookUrl: '',
        profileImage: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    // Basic validation
    const newErrors: CreateUserErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.role) newErrors.role = 'Role is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    try {
      await api.post('/users', form);
      toast.success('User created successfully!');
      onUserCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'TRAINER', label: 'Trainer' },
    { value: 'Developer', label: 'Developer' },
    { value: 'Teaching Assistant', label: 'Teaching Assistant' },
    { value: 'MEMBER', label: 'Member' },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-bold text-xl mb-6 text-center">
              Create New User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="input input-bordered w-full"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input input-bordered w-full"
                  required
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Default Password"
                  className="input input-bordered w-full"
                  required
                  type="password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Facebook URL
                </label>
                <input
                  name="facebookUrl"
                  value={form.facebookUrl}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Image URL
                </label>
                <input
                  name="profileImage"
                  value={form.profileImage}
                  onChange={handleChange}
                  placeholder="Profile Image URL"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
