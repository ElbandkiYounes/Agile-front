export enum UserPrivilege {
  PRODUCT_OWNER = 'PRODUCT_OWNER',
  SCRUM_MASTER = 'SCRUM_MASTER',
  DEVELOPER = 'DEVELOPER',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE'
}

export enum EpicPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum EpicStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum UserStoryPriority {
  MUST_HAVE = 'MUST_HAVE',
  SHOULD_HAVE = 'SHOULD_HAVE',
  COULD_HAVE = 'COULD_HAVE',
  WONT_HAVE = 'WONT_HAVE'
}

export enum UserStoryStatus {
  NOT_STARTED = 'NOT_STARTED',
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
  REVIEWED = 'REVIEWED'
}

export enum TestResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  IN_PROGRESS = 'IN_PROGRESS'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  previlige: UserPrivilege;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  users: User[];
  roles: Role[];
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface ProductBacklog {
  id: string;
  name: string;
  epics: Epic[];
}

export interface SprintBacklog {
  id: string;
  name: string;
  description: string;
  projectId: string;
  userStorieIds: string[];
  epicIds: string[];
}

export interface Epic {
  id: string;
  name: string;
  description: string;
  priority: EpicPriority;
  status: EpicStatus;
  createdAt: string;
  dueDate: string;
  sprintBacklogId?: string;
  productBacklogId: string;
  userStoryIds: string[];
  sprintBacklog?: SprintBacklog;
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  role: Role;
  goal: string;
  desire: string;
  priority: UserStoryPriority;
  status: UserStoryStatus;
  createdAt: string;
  dueDate?: string | null;
  testCases: TestCase[];
  epicId?: string;
  productBacklogId: string;
  epic?: Epic;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  result: TestResult;
}

// Request/Response types
export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface InviteUserRequest {
  fullName: string;
  email: string;
  password: string;
  previlige: UserPrivilege;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface CreateProductBacklogRequest {
  name: string;
}

export interface CreateSprintBacklogRequest {
  name: string;
  description: string;
}

export interface CreateEpicRequest {
  name: string;
  description: string;
  epicPriority: EpicPriority;
  epicStatus: EpicStatus;
  dueDate: string;
}

export interface CreateUserStoryRequest {
  title: string;
  description: string;
  roleId: string;
  goal: string;
  desire: string;
  userStoryPriority: UserStoryPriority;
  userStoryStatus: UserStoryStatus;
}

export interface CreateTestCaseRequest {
  title: string;
  description: string;
  result: TestResult;
}
