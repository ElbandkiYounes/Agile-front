'use client';

import { useEffect, useState } from 'react';
import { roleApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import type { Role } from '@/types';

export default function RolesPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await roleApi.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await roleApi.create({ name, description });
      await loadRoles();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create role');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    
    setError('');
    try {
      await roleApi.update(editingRole.id, { name, description });
      await loadRoles();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      await roleApi.delete(id);
      await loadRoles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const startEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingRole(null);
    setName('');
    setDescription('');
  };

  const canManage = user?.previlige === 'PRODUCT_OWNER';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Personas</h1>
          <p className="text-gray-600 mt-1">Define user roles for your user stories</p>
        </div>
        {canManage && !showCreateForm && !editingRole && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Role
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(showCreateForm || editingRole) && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingRole ? 'Edit Role' : 'Create Role'}
          </h2>
          <form onSubmit={editingRole ? handleUpdate : handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Administrator, Customer, Guest"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Describe this role and its characteristics..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingRole ? 'Save' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.length > 0 ? (
          roles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User size={24} className="text-blue-600" />
                </div>
                {canManage && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(role)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{role.name}</h3>
              <p className="text-gray-600 text-sm">{role.description}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Roles Yet</h3>
            <p className="text-gray-600">
              Create roles to define different user personas for your user stories.
            </p>
          </div>
        )}
      </div>

      {roles.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Roles</h3>
          <p className="text-blue-800 text-sm">
            Roles represent different user personas in your system. Use them in user stories to define 
            "As a [role], I want to [goal], so that [desire]". Examples: Customer, Administrator, Guest User, etc.
          </p>
        </div>
      )}
    </div>
  );
}
