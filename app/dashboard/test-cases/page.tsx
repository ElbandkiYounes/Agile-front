'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { testCaseApi, userStoryApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { TestCase, UserStory, TestResult } from '@/types';

export default function TestCasesPage() {
  const searchParams = useSearchParams();
  const storyIdParam = searchParams.get('storyId');
  const { user } = useAuth();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTest, setEditingTest] = useState<TestCase | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<TestResult>('PASS');
  const [userStoryId, setUserStoryId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [storyIdParam]);

  const loadData = async () => {
    setLoading(true);
    try {
      const storiesResponse = await userStoryApi.getAll();
      setUserStories(storiesResponse.data);
      
      if (storyIdParam) {
        const story = storiesResponse.data.find(s => s.id === storyIdParam);
        setSelectedStory(story || null);
        setUserStoryId(storyIdParam);
        
        const testsResponse = await testCaseApi.getByUserStoryId(storyIdParam);
        setTestCases(testsResponse.data);
      } else {
        // Load all test cases from all user stories
        const allTests: TestCase[] = [];
        for (const story of storiesResponse.data) {
          allTests.push(...story.testCases);
        }
        setTestCases(allTests);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userStoryId) {
      setError('Please select a user story');
      return;
    }
    
    setError('');
    try {
      await testCaseApi.create(userStoryId, { title, description, result });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create test case');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest || !userStoryId) return;
    
    setError('');
    try {
      await testCaseApi.update(editingTest.id, userStoryId, { title, description, result });
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update test case');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test case?')) return;
    
    try {
      await testCaseApi.delete(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete test case');
    }
  };

  const startEdit = (test: TestCase, storyId: string) => {
    setEditingTest(test);
    setTitle(test.title);
    setDescription(test.description);
    setResult(test.result);
    setUserStoryId(storyId);
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingTest(null);
    setTitle('');
    setDescription('');
    setResult('PASS');
    if (!storyIdParam) {
      setUserStoryId('');
    }
  };

  const canManage = user?.previlige === 'QUALITY_ASSURANCE' || user?.previlige === 'PRODUCT_OWNER';

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  const getTestCasesByStory = () => {
    if (storyIdParam) {
      return [{ story: selectedStory!, tests: testCases }];
    }
    
    return userStories
      .filter(story => story.testCases.length > 0)
      .map(story => ({
        story,
        tests: story.testCases
      }));
  };

  const groupedTests = getTestCasesByStory();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Cases</h1>
          {selectedStory && (
            <p className="text-gray-600 mt-1">
              For: {selectedStory.title}
            </p>
          )}
        </div>
        {canManage && !showCreateForm && !editingTest && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Test Case
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {userStories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          You need to create user stories first before creating test cases. 
          <Link href="/dashboard/user-stories" className="ml-2 font-medium underline">
            Create user stories →
          </Link>
        </div>
      )}

      {(showCreateForm || editingTest) && (
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingTest ? 'Edit Test Case' : 'Create Test Case'}
          </h2>
          <form onSubmit={editingTest ? handleUpdate : handleCreate}>
            {!storyIdParam && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">User Story</label>
                <select
                  value={userStoryId}
                  onChange={(e) => setUserStoryId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a user story...</option>
                  {userStories.map((story) => (
                    <option key={story.id} value={story.id}>{story.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Verify login with valid credentials"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Describe the test steps and expected outcome..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="PASS"
                    checked={result === 'PASS'}
                    onChange={(e) => setResult(e.target.value as TestResult)}
                    className="mr-2"
                  />
                  <CheckCircle size={20} className="text-green-600 mr-1" />
                  Pass
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="IN_PROGRESS"
                    checked={result === 'IN_PROGRESS'}
                    onChange={(e) => setResult(e.target.value as TestResult)}
                    className="mr-2"
                  />
                  <span className="w-5 h-5 rounded-full bg-blue-600 mr-1 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </span>
                  In Progress
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="FAIL"
                    checked={result === 'FAIL'}
                    onChange={(e) => setResult(e.target.value as TestResult)}
                    className="mr-2"
                  />
                  <XCircle size={20} className="text-red-600 mr-1" />
                  Fail
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingTest ? 'Save' : 'Create'}
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

      <div className="space-y-6">
        {groupedTests.length > 0 ? (
          groupedTests.map(({ story, tests }) => (
            <div key={story.id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{story.title}</h3>
                <p className="text-sm text-gray-600">{story.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="text-gray-500">
                    {tests.length} test case{tests.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-green-600">
                    {tests.filter(t => t.result === 'PASS').length} passing
                  </span>
                  <span className="text-blue-600">
                    {tests.filter(t => t.result === 'IN_PROGRESS').length} in progress
                  </span>
                  <span className="text-red-600">
                    {tests.filter(t => t.result === 'FAIL').length} failing
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      test.result === 'PASS'
                        ? 'bg-green-50 border-green-500'
                        : test.result === 'IN_PROGRESS'
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {test.result === 'PASS' ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : test.result === 'IN_PROGRESS' ? (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          ) : (
                            <XCircle size={20} className="text-red-600" />
                          )}
                          <h4 className="font-semibold text-gray-900">{test.title}</h4>
                        </div>
                        <p className="text-sm text-gray-700">{test.description}</p>
                      </div>
                      {canManage && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEdit(test, story.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Test Cases Yet</h3>
            <p className="text-gray-600">
              {selectedStory
                ? 'Create test cases to verify this user story.'
                : 'Create test cases for your user stories.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
