# Educate.io - Quiz & Assessment Module

A comprehensive fullstack quiz and assessment module built with **Next.js** (frontend) and **NestJS** (backend) for Educate.io - revolutionizing entrepreneurship education, one student at a time.

## 🎯 Our Mission

**To Revolutionize The Education System**

We strive towards a simple but ambitious mission: to reform the education system by offering world-class learning rooted in experience and real-life application at a fraction of the cost of traditional academic institutions.

Every program we produce must adhere to our exacting standards and our commitment to entrepreneurs is unparalleled with direct contact to coaches and a thriving community.

## 🚀 Features

### Quiz Management
- **Quiz Dashboard** - View all quizzes with filtering and search
- **Quiz Editor** - Create and edit quizzes with multiple question types
- **Question Types** - Multiple Choice, True/False, Matching, Drag & Drop
- **Quiz Settings** - Configure scoring, timing, access control, and publishing options

### Assignment & Distribution
- **Assign Quizzes** - Assign to programs, cohorts, or individual entrepreneurs
- **Schedule Management** - Set start and end dates for assignments
- **Attempt Controls** - Configure multiple attempts and question shuffling

### Assessment Taking Experience
- **Interactive Assessment Interface** - Clean, modern UI for taking assessments
- **Real-time Progress Tracking** - Progress bar and question counter
- **Timer Support** - Optional time limits with countdown
- **Instant Feedback** - Immediate feedback on answers to enhance learning (optional)

### Results & Analytics
- **Individual Results** - Detailed score breakdowns and skill profiles
- **Cohort Performance Dashboard** - KPIs, score distribution, and topic performance
- **Leaderboard** - Gamified rankings with streaks and achievements
- **Performance Analytics** - Comprehensive statistics and insights for entrepreneurial growth

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Recharts** - Chart library for analytics

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - SQLite database ORM
- **JWT** - Authentication with Passport.js
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

## 📁 Project Structure

```
educate-io-quiz-module/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── quiz/           # Quiz CRUD operations
│   │   ├── question/       # Question management
│   │   ├── assignment/     # Assignment management
│   │   ├── result/         # Results and scoring
│   │   └── performance/    # Analytics and leaderboards
│   └── package.json
├── frontend/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # API clients and utilities
│   └── package.json
└── package.json            # Root workspace config
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd educate-io-quiz-module
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` files in both `backend/` and `frontend/` directories:

**backend/.env**
```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Run the development servers**

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run separately:
```bash
# Backend (Terminal 1)
npm run dev:backend

# Frontend (Terminal 2)
npm run dev:frontend
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔐 Demo Credentials

The application uses **static demo credentials** for demonstration purposes (no database required for authentication):

### Entrepreneur Account
- **Email:** student@demo.com
- **Password:** demo123
- **Role:** Entrepreneur/Student

### Coach/Instructor Account
- **Email:** teacher@demo.com
- **Password:** demo123
- **Role:** Instructor/Coach

**Note:** Registration is disabled in demo mode. Please use the provided demo accounts above to log in and explore our entrepreneurship education platform.

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### Quizzes
- `GET /quizzes` - Get all quizzes (with filters)
- `GET /quizzes/:id` - Get quiz by ID
- `POST /quizzes` - Create new quiz
- `PATCH /quizzes/:id` - Update quiz
- `DELETE /quizzes/:id` - Delete quiz
- `POST /quizzes/:id/publish` - Publish quiz
- `POST /quizzes/:id/archive` - Archive quiz

### Questions
- `GET /questions/quiz/:quizId` - Get all questions for a quiz
- `GET /questions/:id` - Get question by ID
- `POST /questions` - Create new question
- `PATCH /questions/:id` - Update question
- `DELETE /questions/:id` - Delete question
- `PUT /questions/reorder` - Reorder questions

### Assignments
- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get assignment by ID
- `POST /assignments` - Create new assignment
- `DELETE /assignments/:id` - Delete assignment

### Results
- `POST /results/submit` - Submit quiz answers
- `POST /results/complete` - Complete quiz and calculate score
- `GET /results` - Get all results (with filters)
- `GET /results/:id` - Get result by ID
- `GET /results/quiz/:quizId/statistics` - Get class statistics

### Performance
- `GET /performance/class/:quizId` - Get class performance metrics
- `GET /performance/score-distribution/:quizId` - Get score distribution
- `GET /performance/topics/:quizId` - Get performance by topic
- `GET /performance/leaderboard/:quizId` - Get leaderboard

## 🎨 Design System

### Typography
- **Headings**: Orbitron font (for h1-h5 elements)
- **Body**: Default system font

### Colors
- **Primary**: Blue (#3b82f6)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red
- **Neutral**: Gray scale

### Components
- Consistent use of Tailwind CSS utility classes
- Reusable UI components (Button, Card, Toggle, etc.)
- Responsive design principles

## 🔒 Authentication

The application uses JWT-based authentication:
1. Users register/login to get an access token
2. Token is stored in localStorage
3. Token is automatically included in API requests via axios interceptors
4. Protected routes check authentication status

## 🗄️ Database

The application uses SQLite for development (easily switchable to PostgreSQL/MySQL in production):

**Entities:**
- `User` - User accounts (instructors and students)
- `Quiz` - Quiz definitions
- `Question` - Individual quiz questions
- `Assignment` - Quiz assignments to courses/classes/students
- `Result` - Student quiz results and scores

## 📝 Development Notes

### Adding New Features
1. Create backend module with entity, DTOs, service, and controller
2. Register module in `app.module.ts`
3. Create frontend page/component
4. Add API service functions in `lib/` directory
5. Update types in `lib/` if needed

### Styling Guidelines
- Use Tailwind CSS classes
- Orbitron font only for headings (h1-h5)
- Body text uses default font
- Maintain consistent spacing and colors

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Production Considerations
- Change JWT secret to a secure random string
- Use PostgreSQL or MySQL instead of SQLite
- Set `synchronize: false` in TypeORM config
- Enable CORS for production domain
- Set up environment variables properly

## 📄 License

MIT License

## 👤 Author

Built as a portfolio project for educate.io fullstack developer position.

