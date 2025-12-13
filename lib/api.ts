import { apiClient } from './api-client';
import type {
  User,
  Project,
  Role,
  ProductBacklog,
  SprintBacklog,
  Epic,
  UserStory,
  TestCase,
  SignupRequest,
  LoginRequest,
  LoginResponse,
  InviteUserRequest,
  CreateProjectRequest,
  CreateRoleRequest,
  CreateProductBacklogRequest,
  CreateSprintBacklogRequest,
  CreateEpicRequest,
  CreateUserStoryRequest,
  CreateTestCaseRequest,
} from '@/types';

// Auth API
export const authApi = {
  signup: (data: SignupRequest) => 
    apiClient.post<User>('/auth/signup', data),
  
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/auth/login', data),
  
  getCurrentUser: () => 
    apiClient.get<User>('/api/me'),
};

// User API
export const userApi = {
  inviteUser: (data: InviteUserRequest) => 
    apiClient.post<User>('/api/projects/invite', data),
};

// Project API
export const projectApi = {
  create: (data: CreateProjectRequest) => 
    apiClient.post<Project>('/api/projects', data),
  
  get: () => 
    apiClient.get<Project>('/api/projects'),
  
  update: (data: CreateProjectRequest) => 
    apiClient.put<Project>('/api/projects', data),
  
  delete: () => 
    apiClient.delete('/api/projects'),
};

// Role API
export const roleApi = {
  create: (data: CreateRoleRequest) => 
    apiClient.post<Role>('/api/roles', data),
  
  getAll: () => 
    apiClient.get<Role[]>('/api/roles'),
  
  getById: (id: string) => 
    apiClient.get<Role>(`/api/roles/${id}`),
  
  update: (id: string, data: CreateRoleRequest) => 
    apiClient.put<Role>(`/api/roles/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/api/roles/${id}`),
};

// Product Backlog API
export const productBacklogApi = {
  create: (data: CreateProductBacklogRequest) => 
    apiClient.post<ProductBacklog>('/api/product-backlogs', data),
  
  get: () => 
    apiClient.get<ProductBacklog>('/api/product-backlogs'),
  
  update: (data: CreateProductBacklogRequest) => 
    apiClient.put<ProductBacklog>('/api/product-backlogs', data),
  
  delete: () => 
    apiClient.delete('/api/product-backlogs'),
};

// Sprint Backlog API
export const sprintBacklogApi = {
  create: (data: CreateSprintBacklogRequest) => 
    apiClient.post<SprintBacklog>('/api/sprint-backlogs', data),
  
  getAll: () => 
    apiClient.get<SprintBacklog[]>('/api/sprint-backlogs'),
  
  getById: (id: string) => 
    apiClient.get<SprintBacklog>(`/api/sprint-backlogs/${id}`),
  
  update: (id: string, data: CreateSprintBacklogRequest) => 
    apiClient.put<SprintBacklog>(`/api/sprint-backlogs/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/api/sprint-backlogs/${id}`),
};

// Epic API
export const epicApi = {
  create: (data: CreateEpicRequest) => 
    apiClient.post<Epic>('/api/epics', data),
  
  getAll: () => 
    apiClient.get<Epic[]>('/api/epics'),
  
  getById: (id: string) => 
    apiClient.get<Epic>(`/api/epics/${id}`),
  
  update: (id: string, data: CreateEpicRequest) => 
    apiClient.put<Epic>(`/api/epics/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/api/epics/${id}`),
  
  linkToSprintBacklog: (epicId: string, sprintBacklogId: string) => 
    apiClient.post<Epic>(`/api/epics/${epicId}/link/sprint-backlog/${sprintBacklogId}`),
  
  unlink: (epicId: string) => 
    apiClient.post<Epic>(`/api/epics/${epicId}/unlink`),
};

// User Story API
export const userStoryApi = {
  create: (data: CreateUserStoryRequest) => 
    apiClient.post<UserStory>('/api/user-stories', data),
  
  getAll: () => 
    apiClient.get<UserStory[]>('/api/user-stories'),
  
  getById: (id: string) => 
    apiClient.get<UserStory>(`/api/user-stories/${id}`),
  
  update: (id: string, data: CreateUserStoryRequest) => 
    apiClient.put<UserStory>(`/api/user-stories/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/api/user-stories/${id}`),
  
  getByRoleId: (roleId: string) => 
    apiClient.get<UserStory[]>(`/api/user-stories/roles/${roleId}`),
  
  getByEpicId: (epicId: string) => 
    apiClient.get<UserStory[]>(`/api/user-stories/epics/${epicId}`),
  
  linkToEpic: (userStoryId: string, epicId: string) => 
    apiClient.post<UserStory>(`/api/user-stories/${userStoryId}/link/epic/${epicId}`),
  
  unlink: (userStoryId: string) => 
    apiClient.post<UserStory>(`/api/user-stories/${userStoryId}/unlink`),
};

// Test Case API
export const testCaseApi = {
  create: (userStoryId: string, data: CreateTestCaseRequest) => 
    apiClient.post<TestCase>(`/api/test-cases/user-stories/${userStoryId}`, data),
  
  getByUserStoryId: (userStoryId: string) => 
    apiClient.get<TestCase[]>(`/api/test-cases/user-stories/${userStoryId}`),
  
  getById: (id: string) => 
    apiClient.get<TestCase>(`/api/test-cases/${id}`),
  
  update: (id: string, userStoryId: string, data: CreateTestCaseRequest) => 
    apiClient.put<TestCase>(`/api/test-cases/${id}/user-stories/${userStoryId}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/api/test-cases/${id}`),
};
