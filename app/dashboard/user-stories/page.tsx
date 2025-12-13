'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { userStoryApi, roleApi, epicApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit2, Trash2, Link as LinkIcon, Unlink, TestTube } from 'lucide-react';
import Link from 'next/link';
import type { UserStory, Role, Epic, UserStoryPriority, UserStoryStatus } from '@/types';

export default function UserStoriesPage() {
  const searchParams = useSearchParams();
  const epicIdParam = searchParams.get('epicId');
  const { user } = useAuth();
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [linkingStory, setLinkingStory] = useState<UserStory | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roleId, setRoleId] = useState('');
  const [goal, setGoal] = useState('');
  const [desire, setDesire] = useState('');
  const [userStoryPriority, setUserStoryPriority] = useState<UserStoryPriority>('SHOULD_HAVE');
  const [userStoryStatus, setUserStoryStatus] = useState<UserStoryStatus>('NOT_STARTED');
  const [selectedEpicId, setSelectedEpicId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [epicIdParam]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesResponse, epicsResponse] = await Promise.all([
        roleApi.getAll(),
        epicApi.getAll(),
      ]);
      setRoles(rolesResponse.data);
      setEpics(epicsResponse.data);
      
      if (epicIdParam) {
        const storiesResponse = await userStoryApi.getByEpicId(epicIdParam);
        setUserStories(storiesResponse.data);
      } else {
        const storiesResponse = await userStoryApi.getAll();
        setUserStories(storiesResponse.data);
      }
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
      await userStoryApi.create({ title, description, roleId, goal, desire, userStoryPriority, userStoryStatus });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user story');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    
    setError('');
    try {
      await userStoryApi.update(editingStory.id, { title, description, roleId, goal, desire, userStoryPriority, userStoryStatus });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user story');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user story?')) return;
    
    try {
      await userStoryApi.delete(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user story');
    }
  };

  const handleLinkToEpic = async () => {
    if (!linkingStory || !selectedEpicId) return;
    
    setError('');
    try {
      await userStoryApi.linkToEpic(linkingStory.id, selectedEpicId);
      await loadData();
      setLinkingStory(null);
      setSelectedEpicId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to link user story to epic');
    }
  };

  const handleUnlink = async (storyId: string) => {
    if (!confirm('Are you sure you want to unlink this user story from its epic?')) return;
    
    try {
      await userStoryApi.unlink(storyId);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unlink user story');
    }
  };

  const startEdit = (story: UserStory) => {
    setEditingStory(story);
    setTitle(story.title);
    setDescription(story.description);
    setRoleId(story.role.id);
    setGoal(story.goal);
    setDesire(story.desire);
    setUserStoryPriority(story.priority);
    setUserStoryStatus(story.status);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingStory(null);
    setTitle('');
    setDescription('');
    setRoleId('');
    setGoal('');
    setDesire('');
    setUserStoryPriority('SHOULD_HAVE');
    setUserStoryStatus('NOT_STARTED');
  };

  const canManage = user?.previlige === 'PRODUCT_OWNER' || user?.previlige === 'DEVELOPER';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Stories</h1>
          {epicIdParam && epics.find(e => e.id === epicIdParam) && (
            <p className="text-gray-600 mt-1">
              Filtered by: {epics.find(e => e.id === epicIdParam)?.name}
            </p>
          )}
        </div>
        {canManage && !showCreateForm && !editingStory && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create User Story
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {roles.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          You need to create roles first before creating user stories. 
          <Link href="/dashboard/roles" className="ml-2 font-medium underline">
            Create roles →
          </Link>
        </div>
      )}

      {(showCreateForm || editingStory) && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingStory ? 'Edit User Story' : 'Create User Story'}
          </h2>
          <form onSubmit={editingStory ? handleUpdate : handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">As a (Role)</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={userStoryPriority}
                  onChange={(e) => setUserStoryPriority(e.target.value as UserStoryPriority)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MUST_HAVE">Must Have</option>
                  <option value="SHOULD_HAVE">Should Have</option>
                  <option value="COULD_HAVE">Could Have</option>
                  <option value="WONT_HAVE">Won't Have</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={userStoryStatus}
                  onChange={(e) => setUserStoryStatus(e.target.value as UserStoryStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="DONE">Done</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to (Goal)</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                placeholder="What does the user want to accomplish?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">So that (Desire/Benefit)</label>
              <input
                type="text"
                value={desire}
                onChange={(e) => setDesire(e.target.value)}
                required
                placeholder="Why does the user want this?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingStory ? 'Save' : 'Create'}
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

      {linkingStory && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Link User Story to Epic</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Epic</label>
            <select
              value={selectedEpicId}
              onChange={(e) => setSelectedEpicId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an epic...</option>
              {epics.map((epic) => (
                <option key={epic.id} value={epic.id}>{epic.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLinkToEpic}
              disabled={!selectedEpicId}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Link
            </button>
            <button
              onClick={() => {
                setLinkingStory(null);
                setSelectedEpicId('');
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {userStories.length > 0 ? (
          userStories.map((story) => {
            const isLinkedToEpic = story.epicId !== null && story.epicId !== undefined && story.epicId !== '';
            return (
            <div key={story.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{story.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      story.priority === 'MUST_HAVE' ? 'bg-red-100 text-red-700' :
                      story.priority === 'SHOULD_HAVE' ? 'bg-orange-100 text-orange-700' :
                      story.priority === 'COULD_HAVE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {story.priority ? story.priority.replace('_', ' ') : 'SHOULD HAVE'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      story.status === 'DONE' ? 'bg-green-100 text-green-700' :
                      story.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      story.status === 'REVIEWED' ? 'bg-purple-100 text-purple-700' :
                      story.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {story.status ? story.status.replace('_', ' ') : 'NOT STARTED'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{story.description}</p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3">
                    <p className="text-sm text-gray-700">
                      <strong>As a</strong> {story.role.name}, <strong>I want to</strong> {story.goal}, <strong>so that</strong> {story.desire}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {story.epicId && epics.find(e => e.id === story.epicId) && (
                      <span>Epic: <span className="font-medium">{epics.find(e => e.id === story.epicId)?.name}</span></span>
                    )}
                    <span className="flex items-center gap-1">
                      <TestTube size={16} />
                      {story.testCases.length} test case{story.testCases.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/test-cases?storyId=${story.id}`}
                    className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage Test Cases →
                  </Link>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    {isLinkedToEpic ? (
                      <button
                        onClick={() => handleUnlink(story.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                        title="Unlink from epic"
                      >
                        <Unlink size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setLinkingStory(story);
                          setSelectedEpicId('');
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Link to epic"
                      >
                        <LinkIcon size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(story)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No User Stories Yet</h3>
            <p className="text-gray-600">Create your first user story to define requirements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
