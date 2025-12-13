'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { epicApi, sprintBacklogApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit2, Trash2, Link as LinkIcon, Unlink } from 'lucide-react';
import Link from 'next/link';
import type { Epic, EpicPriority, EpicStatus, SprintBacklog } from '@/types';

export default function EpicsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const sprintIdFilter = searchParams.get('sprintId');
  
  const [epics, setEpics] = useState<Epic[]>([]);
  const [sprints, setSprints] = useState<SprintBacklog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [linkingEpic, setLinkingEpic] = useState<Epic | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [epicPriority, setEpicPriority] = useState<EpicPriority>('MEDIUM');
  const [epicStatus, setEpicStatus] = useState<EpicStatus>('TO_DO');
  const [dueDate, setDueDate] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [epicsResponse, sprintsResponse] = await Promise.all([
        epicApi.getAll(),
        sprintBacklogApi.getAll(),
      ]);
      setEpics(epicsResponse.data);
      setSprints(sprintsResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await epicApi.create({ name, description, epicPriority, epicStatus, dueDate });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create epic');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpic) return;
    
    setError('');
    try {
      await epicApi.update(editingEpic.id, { name, description, epicPriority, epicStatus, dueDate });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update epic');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this epic?')) return;
    
    try {
      await epicApi.delete(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete epic');
    }
  };

  const handleLinkToSprint = async () => {
    if (!linkingEpic || !selectedSprintId) return;
    
    setError('');
    try {
      await epicApi.linkToSprintBacklog(linkingEpic.id, selectedSprintId);
      await loadData();
      setLinkingEpic(null);
      setSelectedSprintId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to link epic to sprint');
    }
  };

  const handleUnlink = async (epicId: string) => {
    if (!confirm('Are you sure you want to unlink this epic from its sprint?')) return;
    
    try {
      await epicApi.unlink(epicId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unlink epic');
    }
  };

  const startEdit = (epic: Epic) => {
    setEditingEpic(epic);
    setName(epic.name);
    setDescription(epic.description);
    setEpicPriority(epic.priority);
    setEpicStatus(epic.status);
    setDueDate(epic.dueDate.split('T')[0]);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingEpic(null);
    setName('');
    setDescription('');
    setEpicPriority('MEDIUM');
    setEpicStatus('TO_DO');
    setDueDate('');
  };

  const canManage = user?.previlige === 'PRODUCT_OWNER';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Epics</h1>
        {canManage && !showCreateForm && !editingEpic && (
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Epic
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {(showCreateForm || editingEpic) && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingEpic ? 'Edit Epic' : 'Create Epic'}
          </h2>
          <form onSubmit={editingEpic ? handleUpdate : handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={epicPriority}
                  onChange={(e) => setEpicPriority(e.target.value as EpicPriority)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={epicStatus}
                  onChange={(e) => setEpicStatus(e.target.value as EpicStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingEpic ? 'Save' : 'Create'}
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

      {linkingEpic && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Link Epic to Sprint</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Sprint</label>
            <select
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a sprint...</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLinkToSprint}
              disabled={!selectedSprintId}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Link
            </button>
            <button
              onClick={() => {
                setLinkingEpic(null);
                setSelectedSprintId('');
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sprintIdFilter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              Showing epics for sprint: <strong>{sprints.find(s => s.id === sprintIdFilter)?.name || sprintIdFilter}</strong>
              {' '}
              <Link href="/dashboard/epics" className="text-blue-600 hover:underline ml-2">
                Clear filter
              </Link>
            </p>
          </div>
        )}
        {epics.filter(epic => !sprintIdFilter || epic.sprintBacklogId === sprintIdFilter).length > 0 ? (
          epics.filter(epic => !sprintIdFilter || epic.sprintBacklogId === sprintIdFilter).map((epic) => {
            const isLinkedToSprint = epic.sprintBacklogId !== null && epic.sprintBacklogId !== undefined && epic.sprintBacklogId !== '';
            const sprintInfo = sprints.find(s => s.id === epic.sprintBacklogId);
            return (
            <div key={epic.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{epic.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      epic.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      epic.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {epic.priority || 'MEDIUM'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      epic.status === 'DONE' ? 'bg-green-100 text-green-700' :
                      epic.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {epic.status ? epic.status.replace('_', ' ') : 'TO DO'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{epic.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Due: {new Date(epic.dueDate).toLocaleDateString()}</span>
                    {sprintInfo && (
                      <span className="flex items-center">
                        Sprint: <span className="ml-1 font-medium">{sprintInfo.name}</span>
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/user-stories?epicId=${epic.id}`}
                    className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View User Stories →
                  </Link>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    {isLinkedToSprint ? (
                      <button
                        onClick={() => handleUnlink(epic.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                        title="Unlink from sprint"
                      >
                        <Unlink size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setLinkingEpic(epic);
                          setSelectedSprintId('');
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Link to sprint"
                      >
                        <LinkIcon size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(epic)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(epic.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
          })
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Epics Yet</h3>
            <p className="text-gray-600">Create your first epic to organize large features.</p>
          </div>
        )}
      </div>
    </div>
  );
}
