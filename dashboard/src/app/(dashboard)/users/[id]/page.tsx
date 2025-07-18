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
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Stores the actual File object
  const [loading, setLoading] = useState(true); // Initial data loading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false); // State for the main profile update button

  const {
    register,
    handleSubmit, // This is react-hook-form's handleSubmit
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      facebookUrl: '',
      // Password and profileImage are handled separately/conditionally,
      // so they don't need to be in defaultValues for the main form.
      // If your schema requires them, ensure they are optional or handled appropriately.
      // password: '', // Removed from defaultValues for main form
      // profileImage: '', // Removed from defaultValues for main form
      role: 'MEMBER',
    },
  });

  // Debugging: Log form state changes
  useEffect(() => {
    console.log('Form State - Errors:', errors);
    console.log('Form State - isSubmitting:', isSubmitting);
    console.log('Component State - updateLoading:', updateLoading);
  }, [errors, isSubmitting, updateLoading]);

  // Redirect non-member users
  useEffect(() => {
    if (!isLoading && user && user.role === 'MEMBER' && user._id !== userId) {
      router.replace('/welcome');
    }
  }, [user, isLoading, router, userId]);

  // Fetch user profile data
  useEffect(() => {
    if (!userId) {
      console.log('No userId available for fetching profile.');
      return;
    }
    setLoading(true);
    console.log(`Fetching user profile for ID: ${userId}`);
    api
      .get(`/users/${userId}`)
      .then(({ data }) => {
        setProfile(data);
        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          facebookUrl: data.facebookUrl || '',
          role: data.role || 'MEMBER',
        });
        if (data.profileImage) {
          setImagePreview(data.profileImage);
        } else {
          setImagePreview(null);
        }
        setSelectedFile(null); // Clear any previously selected file when new profile is loaded
        console.log('User profile fetched successfully:', data);
      })
      .catch((err) => {
        console.error('Failed to load user profile:', err);
        toast.error('Failed to load user profile');
      })
      .finally(() => setLoading(false));
  }, [userId, reset]);

  // Always set role in form state after reset
  useEffect(() => {
    if (profile && profile.role) {
      setValue('role', profile.role);
      console.log('Set form role to:', profile.role);
    }
  }, [profile, setValue]);

  // Loading states and access control
  if (isLoading || loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading Profile...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="text-center py-10 text-red-500">User not found.</div>
    );
  }

  // Only self or admin can update
  const canEdit = user._id === userId || user.role === 'ADMIN'; // Simplified, assuming MANAGER/TRAINER can't edit others for this route
  if (!canEdit) {
    router.replace('/dashboard');
    return null;
  }

  // Handle image file selection and preview generation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image change detected.');
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the actual file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set base64 for preview
        console.log('Image preview updated (base64 string generated).');
      };
      reader.readAsDataURL(file); // Read file as base64
    } else {
      setSelectedFile(null);
      setImagePreview(profile.profileImage || null); // Revert to original or null if no file selected
      console.log('No file selected, image preview reset.');
    }
  };

  // Main profile update submission logic
  const onSubmit = async (data: UserProfileFormData) => {
    // This is the function called by handleSubmit
    console.log('--- onSubmit function (from react-hook-form) triggered! ---');
    console.log('Form data received by onSubmit:', data);
    setUpdateLoading(true);
    try {
      const updateData: any = { ...data };

      // IMPORTANT: Convert selectedFile to base64 if a new file was chosen
      if (selectedFile) {
        console.log('New file detected, converting to base64...');
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            updateData.profileImage = reader.result as string; // Add base64 string to payload
            console.log(
              'File converted to base64. Payload size for image:',
              updateData.profileImage.length
            );
            resolve();
          };
          reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(error);
          };
        });
      } else if (profile.profileImage && !imagePreview) {
        // If there was an image but it's now cleared (imagePreview is null), send null to backend
        updateData.profileImage = null;
        console.log(
          'Existing profile image explicitly cleared (sending null).'
        );
      } else if (
        profile.profileImage &&
        imagePreview &&
        imagePreview === profile.profileImage
      ) {
        // If image hasn't changed, and it's the original, don't send it to avoid unnecessary upload
        delete updateData.profileImage;
        console.log('Profile image unchanged, not sending to backend.');
      } else if (imagePreview && imagePreview !== profile.profileImage) {
        // This case handles if imagePreview was manually set to a new base64 string (less common)
        updateData.profileImage = imagePreview;
        console.log(
          'Image preview changed, sending its current base64 string.'
        );
      } else {
        // No new image, no existing image, or image was explicitly removed (e.g., cleared input)
        delete updateData.profileImage;
        console.log('No new or changed profile image to send.');
      }

      // Ensure password is NOT sent with this general profile update
      delete updateData.password; // Explicitly remove password field
      console.log('Final updateData payload before API call:', updateData);

      // Determine the correct API endpoint based on user role and target user
      let apiEndpoint = '';
      if (user._id !== userId && user.role === 'ADMIN') {
        // Admin updating another user: use /api/v1/users/:id
        // Ensure role is correctly set for admin updates if not already in data
        if (!updateData.role) updateData.role = profile.role || 'MEMBER';
        apiEndpoint = `/users/${userId}`;
        console.log('Admin updating another user. API Endpoint:', apiEndpoint);
      } else {
        // Self-update: use /api/v1/users/:id/profile
        apiEndpoint = `/users/${userId}/profile`;
        console.log('Self-updating profile. API Endpoint:', apiEndpoint);
      }

      console.log(
        'Attempting PUT request to:',
        apiEndpoint,
        'with data:',
        updateData
      );
      await api.put(apiEndpoint, updateData);

      toast.success('Profile updated successfully!');
      console.log('Profile update successful. Refreshing router...');
      router.refresh(); // Refresh data on the page
    } catch (err: any) {
      console.error(
        'Profile update error caught in onSubmit:',
        err,
        err?.response
      );
      let msg = 'Profile update failed.';
      if (err?.response?.data?.error) msg = err.response.data.error;
      else if (err?.message) msg = err.message;
      toast.error(msg);
    } finally {
      setUpdateLoading(false);
      console.log('--- onSubmit function finished ---');
    }
  };

  // Password change submission
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    if (newPassword !== retypePassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      // Basic client-side validation
      setPasswordMessage('Password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    try {
      // Note: Your backend's changePassword route expects oldPassword,
      // but your frontend is sending an empty string if it's a self-update
      // for a non-admin. Ensure your backend handles this gracefully
      // (e.g., by skipping oldPassword check for admin or if oldPassword is empty).
      await api.put(`/users/${userId}/password`, {
        oldPassword: '', // As per your frontend's current logic
        newPassword,
      });
      setPasswordMessage('Password updated successfully!');
      setNewPassword('');
      setRetypePassword('');
    } catch (err: any) {
      console.error('Password update error:', err, err?.response);
      setPasswordMessage(
        err.response?.data?.error || 'Failed to update password'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-8 font-sans">
      {/* Debugging Info Overlay */}
      {(Object.keys(errors).length > 0 || isSubmitting || updateLoading) && (
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-md z-50 max-w-xs">
          <p className="font-bold">Form Debug Info:</p>
          <p>
            Errors:{' '}
            <pre className="text-xs break-all">
              {JSON.stringify(errors, null, 2)}
            </pre>
          </p>
          <p>isSubmitting: {isSubmitting ? 'true' : 'false'}</p>
          <p>updateLoading: {updateLoading ? 'true' : 'false'}</p>
        </div>
      )}

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
            className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
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
        // FIX: Added onSubmit handler to trigger react-hook-form's validation and submission
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow p-6 space-y-6 mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Profile Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
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
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone')}
              className="input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="facebookUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook URL
            </label>
            <input
              id="facebookUrl"
              type="text"
              {...register('facebookUrl')}
              className={`input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                errors.facebookUrl ? 'border-red-500' : ''
              }`}
            />
            {errors.facebookUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.facebookUrl.message}
              </p>
            )}
          </div>
          {/* Always include role in form state, even if not shown */}
          <input type="hidden" {...register('role')} />
          {/* Only show role field if admin and not editing self */}
          {user._id !== userId &&
            user.role === 'ADMIN' && ( // Simplified canEdit check for role field display
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  {...register('role')}
                  className={`input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="TRAINER">Trainer</option>
                  <option value="Developer">Developer</option>
                  <option value="Teaching Assistant">Teaching Assistant</option>
                  <option value="MEMBER">Member</option>
                </select>
              </div>
            )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || updateLoading}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md"
        >
          {isSubmitting || updateLoading ? 'Updating...' : 'Update Profile'}
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
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label
                htmlFor="retypePassword"
                className="block text-sm font-medium text-gray-700"
              >
                Retype New Password
              </label>
              <input
                id="retypePassword"
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="input input-bordered w-full mt-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>
          {passwordMessage && (
            <div
              className={`text-sm mt-2 ${
                passwordMessage.includes('successfully')
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {passwordMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-md"
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
