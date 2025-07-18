import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import UserModal, { CreateUserModal } from "./UserModal";
import { useAuth } from "@/hooks/useAuth";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  role:
    | "ADMIN"
    | "MANAGER"
    | "MEMBER"
    | "TRAINER"
    | "Developer"
    | "Teaching Assistant";
  phone?: string;
  facebookUrl?: string;
  profileImage?: string;
  createdAt?: string; // <-- make sure this is optional
}

export function UserManagementTable() {
  const { user } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (user: IUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedUser: Omit<IUser, "_id">) => {
    if (!selectedUser?._id) return;
    try {
      await api.put(`/users/${selectedUser._id}`, updatedUser);
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) return <p>Loading users...</p>;
  if (users.length === 0)
    return <p className="text-center text-gray-500">No users found.</p>;

  return (
    <div className="overflow-x-auto w-full bg-white rounded-lg shadow p-8">
      {/* Create New User button, only for ADMIN */}
      {user?.role === "ADMIN" && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold shadow"
          >
            + Create New User
          </button>
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Profile
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Facebook
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border-2 shadow-sm ${
                    user.role === "ADMIN"
                      ? "bg-indigo-100 text-indigo-800 border-indigo-400"
                      : user.role === "MANAGER"
                      ? "bg-blue-100 text-blue-800 border-blue-400"
                      : user.role === "TRAINER"
                      ? "bg-green-100 text-green-800 border-green-400"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.phone || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                {user.facebookUrl ? (
                  <a
                    href={user.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline cursor-pointer"
                  >
                    Facebook
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.createdAt
                  ? format(new Date(user.createdAt), "PP")
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                <button
                  onClick={() => handleModalOpen(user)}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs rounded-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transform transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md cursor-pointer font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit User Modal */}
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleEditSave}
        user={selectedUser}
      />
      {/* Only show CreateUserModal for admin */}
      {user?.role === "ADMIN" && (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUserCreated={fetchUsers}
        />
      )}
    </div>
  );
}
