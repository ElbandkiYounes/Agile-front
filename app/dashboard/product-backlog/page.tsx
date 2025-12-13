'use client';

import { useEffect, useState } from 'react';
import { productBacklogApi, epicApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Edit2, Trash2, Plus, ChevronRight, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { ProductBacklog, Epic } from '@/types';

export default function ProductBacklogPage() {
  const { user } = useAuth();
  const [backlog, setBacklog] = useState<ProductBacklog | null>(null);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadBacklog();
  }, []);

  const loadBacklog = async () => {
    setLoading(true);
    try {
      const [backlogResponse, epicsResponse] = await Promise.all([
        productBacklogApi.get(),
        epicApi.getAll(),
      ]);
      setBacklog(backlogResponse.data);
      setEpics(epicsResponse.data);
      setName(backlogResponse.data.name);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        setError('Failed to load product backlog');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await productBacklogApi.create({ name });
      await loadBacklog();
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product backlog');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await productBacklogApi.update({ name });
      await loadBacklog();
      setShowEditForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update product backlog');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product backlog?')) return;
    
    setError('');
    try {
      await productBacklogApi.delete();
      setBacklog(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product backlog');
    }
  };

  const canManage = user?.previlige === 'PRODUCT_OWNER';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  if (!backlog && !showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Product Backlog</h2>
          <p className="text-gray-600 mb-6">Create a product backlog to organize your epics and requirements.</p>
          {canManage && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Product Backlog
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Product Backlog</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Product Backlog</h1>
        {canManage && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 size={20} className="mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={20} className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showEditForm ? (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Product Backlog</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        backlog && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                  {backlog.name}
                </h2>
                <p className="text-slate-600">Product backlog overview and epic management</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={32} />
              </div>
            </div>
          </div>
        )
      )}

      {/* Statistics Cards */}
      {backlog && epics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-3xl font-bold">{epics.length}</span>
            </div>
            <p className="text-blue-100 text-sm font-medium">Total Epics</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <span className="text-3xl font-bold">
                {epics.filter(e => e.status === 'DONE').length}
              </span>
            </div>
            <p className="text-green-100 text-sm font-medium">Completed</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock size={24} />
              </div>
              <span className="text-3xl font-bold">
                {epics.filter(e => e.status === 'IN_PROGRESS').length}
              </span>
            </div>
            <p className="text-orange-100 text-sm font-medium">In Progress</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-white/20 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <span className="text-3xl font-bold">
                {epics.filter(e => e.priority === 'HIGH').length}
              </span>
            </div>
            <p className="text-purple-100 text-sm font-medium">High Priority</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Epics ({epics.length})</h3>
            <p className="text-slate-600 text-sm mt-1">Manage and organize your product epics</p>
          </div>
          <Link
            href="/dashboard/epics"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus size={20} className="mr-2" />
            Manage Epics
          </Link>
        </div>
        
        {epics.length > 0 ? (
          <div className="space-y-3">
            {epics.map((epic) => (
              <Link
                key={epic.id}
                href={`/dashboard/epics`}
                className="block p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-200 border border-slate-200 hover:border-slate-300 hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {epic.name}
                      </h4>
                      {epic.sprintBacklogId && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                          In Sprint
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{epic.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-slate-500">
                        📊 {epic.userStoryIds?.length || 0} user stories
                      </span>
                      {epic.dueDate && (
                        <span className="text-xs text-slate-500">
                          📅 Due: {new Date(epic.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${
                      epic.priority === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                      epic.priority === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                      'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    }`}>
                      {epic.priority}
                    </span>
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${
                      epic.status === 'DONE' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                      epic.status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                      'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                    }`}>
                      {epic.status ? epic.status.replace('_', ' ') : 'TO DO'}
                    </span>
                    <ChevronRight size={24} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-violet-600" size={40} />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">No epics yet</h4>
            <p className="text-slate-600 mb-6">Create your first epic to get started with organizing your work.</p>
            <Link
              href="/dashboard/epics"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus size={20} className="mr-2" />
              Create First Epic
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
