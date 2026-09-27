import React, { useState } from 'react';

function UserEditModal({ isOpen, onClose, user, onSave }) {
  const [newName, setNewName] = useState(user?.fullname || '');

  const handleSave = () => {
    onSave(user._id, newName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit User Profile</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            disabled
            className="w-full px-3 py-2 bg-gray-600 text-gray-400 rounded-md cursor-not-allowed"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserEditModal;