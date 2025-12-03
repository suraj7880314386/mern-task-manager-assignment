# ProTask Manager - Enterprise Grade Dashboard

A high-performance, scalable Task Management application built with the MERN stack. This project demonstrates advanced frontend engineering capabilities, featuring real-time analytics, data visualization, and a modern dark-themed UI.

##  Key Highlights (New Features)
- **  Analytics Dashboard:** Real-time data visualization using **Recharts** (Donut Charts) to track task efficiency.
- ** Data Export:** One-click **CSV/Excel Export** functionality for data portability.
- ** Modern UI/UX:** Professional **Dark Mode** interface with Glassmorphism effects and **Framer Motion** animations.
- ** Optimistic UI:** Instant feedback interactions with Skeleton Loading states and Toast notifications.
- ** Secure Auth:** Complete JWT-based authentication system with protected routes.

## Tech Stack
- **Frontend:** React.js (Vite), TailwindCSS
- **Libraries:** Axios, Framer Motion, Recharts, React Hot Toast, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Security:** BCrypt (Hashing), JWT (Auth Tokens)

## Features Breakdown
1.  **Authentication:** Secure Register/Login flow with error handling.
2.  **Dashboard:**
    - Visual breakdown of Pending vs. Completed tasks.
    - Search and Filter functionality.
    - CRUD Operations (Create, Read, Update, Delete).
3.  **Performance:** Optimized rendering and responsive design for all devices.

## API Documentation

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user & get Token | No |
| GET | `/api/tasks` | Get all tasks for logged-in user | Yes (Token) |
| POST | `/api/tasks` | Create a new task | Yes (Token) |
| PUT | `/api/tasks/:id` | Update task status | Yes (Token) |
| DELETE | `/api/tasks/:id` | Delete a task | Yes (Token) |

## Scalability Strategy (Production)
To scale this application for high-traffic production environments:

1.  **Frontend Optimization:**
    - Implement **Lazy Loading** for routes to reduce the initial bundle size.
    - Use **React Query** for server-state caching to minimize API requests.
    - CDN integration for static assets.

2.  **Backend Architecture:**
    - Use **Node.js Cluster Module** to utilize multi-core CPUs.
    - Implement **Redis Caching** for frequently accessed data (e.g., User Analytics).
    - Rate Limiting to prevent DDoS attacks.

3.  **Database & Infrastructure:**
    - Database **Indexing** on `userId` and `status` fields for faster queries.
    - **Dockerization** for consistent deployment environments.
    - CI/CD pipelines (GitHub Actions) for automated testing.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd <folder-name>
2. Backend Setup
code
Bash
cd server
npm install
# Create a .env file with PORT, MONGO_URI, and JWT_SECRET
npm run dev
3. Frontend Setup
code
Bash
cd client
npm install
npm run dev