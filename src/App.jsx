import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from './store/usersSlice';

function App() {
  const dispatch = useDispatch();
  const { data: users = [], status, error } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateUser({ id: editingId, userData: formData })).unwrap();
      } else {
        await dispatch(createUser(formData)).unwrap();
      }
      setFormData({ name: '', email: '', age: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, age: user.age });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const retryFetch = () => {
    dispatch(fetchUsers());
  };

  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-8 text-red-600">
        <p>⚠️ We will be right back in a minute.</p>
        <p className="text-sm mt-2">{error}</p>
        <button onClick={retryFetch} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management System</h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            {editingId ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
