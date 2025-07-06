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

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow cursor-pointer hover:bg-indigo-700"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            {...register('name')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
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
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Facebook URL
          </label>
          <input
            type="text"
            {...register('facebookUrl')}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.facebookUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.facebookUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.facebookUrl.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
