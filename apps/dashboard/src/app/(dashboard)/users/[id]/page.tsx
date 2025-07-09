'use client';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { userProfileSchema, type UserProfileFormData } from '@/lib/validations';

export default function UserProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      facebookUrl: '',
      password: '',
      profileImage: '',
    },
  });

  useEffect(() => {
    if (!isLoading && user && user.role === 'MEMBER') {
      router.replace('/welcome');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api
      .get(`/users/${userId}`)
      .then(({ data }) => {
        setProfile(data);
        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          facebookUrl: data.facebookUrl || '',
          password: '',
          profileImage: '',
          role: data.role || 'MEMBER',
        });
        setImagePreview(data.profileImage || null);
      })
      .catch(() => toast.error('Failed to load user profile'))
      .finally(() => setLoading(false));
  }, [userId, reset]);

  if (isLoading || loading || !user) return <div>Loading...</div>;
  if (!profile) return <div>User not found.</div>;

  // Only self or admin/manager/trainer can update
  const canEdit =
    user._id === userId || ['ADMIN', 'MANAGER', 'TRAINER'].includes(user.role);
  if (!canEdit) {
    router.replace('/dashboard');
    return null;
  }

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      const updateData: any = { ...data };
      if (!data.profileImage) delete updateData.profileImage;
      if (!data.password) delete updateData.password;
      await api.put(`/users/${userId}/profile`, updateData);
      toast.success('Profile updated!');
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    if (newPassword !== retypePassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put(`/users/${userId}/password`, {
        oldPassword: '', // Not required for self-update in this context
        newPassword,
      });
      setPasswordMessage('Password updated successfully');
      setNewPassword('');
      setRetypePassword('');
    } catch (err: any) {
      setPasswordMessage(
        err.response?.data?.error || 'Failed to update password',
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-8">
      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center mb-8">
        <div className="relative mb-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover border-4 border-indigo-500 shadow"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-white border-4 border-indigo-500 shadow">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => fileInputRef.current?.click()}
            title="Change profile image"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z"
              />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {profile.name}
        </h2>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow ${
              profile.role === 'ADMIN'
                ? 'bg-indigo-100 text-indigo-800'
                : profile.role === 'MANAGER'
                  ? 'bg-blue-100 text-blue-800'
                  : profile.role === 'TRAINER'
                    ? 'bg-green-100 text-green-800'
                    : profile.role === 'Developer'
                      ? 'bg-pink-100 text-pink-800'
                      : profile.role === 'Teaching Assistant'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
            }`}
          >
            {profile.role}
          </span>
        </div>
        <p className="text-gray-500 text-sm">{profile.email}</p>
      </div>

      {/* Editable Profile Fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow p-6 space-y-6 mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Profile Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register('name')}
              className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              {...register('phone')}
              className="input input-bordered w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Facebook URL
            </label>
            <input
              type="text"
              {...register('facebookUrl')}
              className={`input input-bordered w-full ${errors.facebookUrl ? 'border-red-500' : ''}`}
            />
            {errors.facebookUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.facebookUrl.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {/* Password update form, only for self */}
      {user._id === userId && (
        <form
          onSubmit={handlePasswordChange}
          className="bg-white rounded-2xl shadow p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Change Password
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Retype New Password
              </label>
              <input
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
          {passwordMessage && (
            <div className="text-sm text-red-500">{passwordMessage}</div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
