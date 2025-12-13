'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { projectApi } from '@/lib/api';
import Link from 'next/link';
import { FolderKanban, ListTodo, Layers, FileText, Users } from 'lucide-react';
import type { Project } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const response = await projectApi.get();
      setProject(response.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to load project:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Project',
      description: 'Manage your project details and team',
      icon: FolderKanban,
      href: '/dashboard/project',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    {
      title: 'Product Backlog',
      description: 'View and manage product backlog items',
      icon: ListTodo,
      href: '/dashboard/product-backlog',
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-50'
    },
    {
      title: 'Sprints',
      description: 'Plan and track sprint backlogs',
      icon: Layers,
      href: '/dashboard/sprints',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'Epics',
      description: 'Organize work into large features',
      icon: FileText,
      href: '/dashboard/epics',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      title: 'User Stories',
      description: 'Define and track user requirements',
      icon: FileText,
      href: '/dashboard/user-stories',
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-50 to-blue-50'
    },
    {
      title: 'Roles',
      description: 'Manage project roles and personas',
      icon: Users,
      href: '/dashboard/roles',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.fullName}! 👋
            </h1>
            <p className="text-lg text-slate-600">
              {project ? (
                <>
                  Working on <span className="font-semibold text-blue-600">{project.name}</span>
                </>
              ) : (
                'Get started by creating your first project'
              )}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 mt-4">Loading your workspace...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-slate-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative p-6">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${card.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Go to {card.title}</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !project && (
        <div className="mt-10 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🚀 Ready to Start?
                </h3>
                <p className="text-blue-100 text-lg mb-6">
                  Create your first project to unlock the full power of Agile project management.
                </p>
                <Link
                  href="/dashboard/project"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FolderKanban className="mr-2" size={20} />
                  Create Your Project
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
