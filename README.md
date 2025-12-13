# Agile Project Management Frontend

A comprehensive Next.js frontend application for the Agile Project Management System. This application provides a modern, user-friendly interface for managing Scrum projects, product backlogs, sprints, epics, user stories, and test cases.

## Features

- **User Authentication**: Secure JWT-based authentication with login and signup
- **Project Management**: Create and manage projects with team members
- **Product Backlog**: Organize and prioritize requirements
- **Sprint Planning**: Create and manage sprint backlogs
- **Epic Management**: Group related user stories into large features
- **User Story Tracking**: Define requirements with roles, goals, and desires
- **Test Case Management**: Create and track test cases for user stories
- **Role Management**: Define custom roles/personas for user stories
- **Role-Based Access Control**: Different permissions for Product Owners, Scrum Masters, Developers, and QA Engineers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and npm/yarn
- Running backend API (Spring Boot application on http://localhost:8080)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The application is configured to connect to the backend at `http://localhost:8080` by default. If your backend runs on a different URL, update the `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
agile-front/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Protected dashboard pages
│   │   ├── project/            # Project management
│   │   ├── product-backlog/    # Product backlog view
│   │   ├── sprints/            # Sprint management
│   │   ├── epics/              # Epic management
│   │   ├── user-stories/       # User story management
│   │   ├── test-cases/         # Test case management
│   │   └── roles/              # Role management
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # Reusable components
│   ├── DashboardLayout.tsx     # Dashboard layout with sidebar
│   └── ProtectedRoute.tsx      # Route protection wrapper
├── contexts/                    # React contexts
│   └── AuthContext.tsx         # Authentication context
├── lib/                         # Utility libraries
│   ├── api.ts                  # API service layer
│   └── api-client.ts           # HTTP client configuration
├── types/                       # TypeScript type definitions
│   └── index.ts                # All type definitions
└── public/                      # Static assets
```

## API Integration

The application integrates with the Spring Boot backend API. All API calls are managed through the service layer in `lib/api.ts`:

- **Authentication**: `/auth/signup`, `/auth/login`
- **Projects**: `/api/projects`
- **Product Backlogs**: `/api/product-backlogs`
- **Sprint Backlogs**: `/api/sprint-backlogs`
- **Epics**: `/api/epics`
- **User Stories**: `/api/user-stories`
- **Test Cases**: `/api/test-cases`
- **Roles**: `/api/roles`

## User Roles & Permissions

- **Product Owner**: Full access to all resources
- **Scrum Master**: Can invite users, manage sprints and backlogs
- **Developer**: Can update user stories and view most resources
- **Quality Assurance**: Can create and manage test cases

## Features by Page

### Dashboard
- Overview of project and quick access to all modules
- Project statistics and recent activity

### Project Management
- Create, update, and delete project
- Invite team members with specific roles
- View team members and their privileges

### Product Backlog
- Create and manage product backlog
- View all epics in the backlog
- Priority and status tracking

### Sprint Management
- Create and manage sprint backlogs
- View epics assigned to each sprint
- Sprint planning and tracking

### Epic Management
- Create, update, and delete epics
- Set priority and status
- Link epics to sprint backlogs
- Track due dates

### User Stories
- Create user stories with role, goal, and desire
- Set priority (Must Have, Should Have, Could Have, Won't Have)
- Track status (Not Started, To Do, In Progress, Reviewed, Done, Rejected)
- Link stories to epics
- View associated test cases

### Test Cases
- Create test cases for user stories
- Mark tests as Pass or Fail
- Filter by user story
- View test coverage

### Roles
- Create custom roles/personas
- Define role characteristics
- Use in user stories

## Authentication Flow

1. User signs up or logs in
2. JWT token is received and stored in localStorage
3. Token is automatically added to all API requests
4. Protected routes verify authentication
5. On token expiration, user is redirected to login

## Development

### Adding New Features

1. Define types in `types/index.ts`
2. Add API methods in `lib/api.ts`
3. Create page component in appropriate `app/dashboard/` directory
4. Add navigation link in `components/DashboardLayout.tsx`

### Styling

The application uses Tailwind CSS for styling. Custom theme colors are defined in `tailwind.config.ts`.

## Troubleshooting

### Connection Issues
- Ensure the backend API is running on http://localhost:8080
- Check CORS configuration in the backend
- Verify network connectivity

### Authentication Issues
- Clear localStorage and try logging in again
- Check that JWT tokens are being sent in request headers
- Verify backend authentication endpoints are working

### Build Issues
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check for TypeScript errors with `npm run lint`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Agile Project Management System.
