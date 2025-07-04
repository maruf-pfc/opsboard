import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'TRAINER';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<IUser['role']>('MEMBER');
  const [phone, setPhone] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setRole(user?.role || 'MEMBER');
    setPhone(user?.phone || '');
    setFacebookUrl(user?.facebookUrl || '');
    setProfileImage(user?.profileImage || '');
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) {
      toast.error('Please fill all required fields.');
      return;
    }
    onSave({ name, email, role, phone, facebookUrl, profileImage });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'default' }}
      >
        <h2 className="text-xl font-bold mb-4 cursor-pointer">
          {user ? 'Edit User' : 'Add User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as IUser['role'])}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
              <option value="TRAINER">Trainer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Facebook URL</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Profile Image URL
            </label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
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
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-medium cursor-pointer"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
