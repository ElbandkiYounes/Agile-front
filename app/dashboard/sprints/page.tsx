'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sprintBacklogApi, epicApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import type { SprintBacklog, Epic } from '@/types';

export default function SprintsPage() {
  const { user } = useAuth();
  const [sprints, setSprints] = useState<SprintBacklog[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSprint, setEditingSprint] = useState<SprintBacklog | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sprintsResponse, epicsResponse] = await Promise.all([
        sprintBacklogApi.getAll(),
        epicApi.getAll()
      ]);
      setSprints(sprintsResponse.data);
      setEpics(epicsResponse.data);
    } catch (error: any) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await sprintBacklogApi.create({ name, description });
      await loadData();
      setShowCreateForm(false);
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sprint');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSprint) return;
    
    setError('');
    try {
      await sprintBacklogApi.update(editingSprint.id, { name, description });
      await loadData();
      setEditingSprint(null);
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update sprint');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sprint?')) return;
    
    setError('');
    try {
      await sprintBacklogApi.delete(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete sprint');
    }
  };

  const startEdit = (sprint: SprintBacklog) => {
    setEditingSprint(sprint);
    setName(sprint.name);
    setDescription(sprint.description);
  };

  const canManage = user?.previlige === 'PRODUCT_OWNER' || user?.previlige === 'SCRUM_MASTER';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sprint Backlogs</h1>
        {canManage && !showCreateForm && !editingSprint && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Sprint
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(showCreateForm || editingSprint) && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingSprint ? 'Edit Sprint' : 'Create Sprint'}
          </h2>
          <form onSubmit={editingSprint ? handleUpdate : handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sprint Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingSprint ? 'Save' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingSprint(null);
                  setName('');
                  setDescription('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {sprints.length > 0 ? (
          sprints.map((sprint) => {
            const sprintEpics = epics.filter(e => e.sprintBacklogId === sprint.id);
            return (
              <div key={sprint.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{sprint.name}</h3>
                    <p className="text-gray-600">{sprint.description}</p>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(sprint)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(sprint.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">
                      Epics in Sprint ({sprintEpics.length})
                    </h4>
                    <Link
                      href={`/dashboard/epics?sprintId=${sprint.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View All Epics →
                    </Link>
                  </div>
                  {sprintEpics.length > 0 ? (
                    <div className="space-y-2">
                      {sprintEpics.map((epic) => (
                        <div key={epic.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">{epic.name}</h5>
                              <p className="text-sm text-gray-600">{epic.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                epic.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                epic.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {epic.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                epic.status === 'DONE' ? 'bg-green-100 text-green-700' :
                                epic.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {epic.status ? epic.status.replace('_', ' ') : 'TO DO'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No epics assigned to this sprint yet.</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sprints Yet</h3>
            <p className="text-gray-600">Create your first sprint to start planning iterations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
