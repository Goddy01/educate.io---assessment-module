# Quick Setup Guide

Follow these steps to get the quiz module up and running:

## 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Configure Environment Variables

### Backend (create `backend/.env`)
```env
PORT=3001
JWT_SECRET=change-this-to-a-secure-random-string-in-production
FRONTEND_URL=http://localhost:3000
```

### Frontend (create `frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 3. Start Development Servers

### Option 1: Run Both Together (Recommended)
From the root directory:
```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 5. Create Your First Account

1. Go to http://localhost:3000/login
2. Click "Create Account"
3. Fill in your details (choose "Instructor" role to create quizzes)
4. You'll be redirected to the Quiz Dashboard

## 6. Create Your First Quiz

1. Click "Create New Quiz" on the dashboard
2. Fill in the quiz title and description
3. Configure settings (scoring, feedback, etc.)
4. Click "Save as Draft" or "Save & Publish"
5. You'll be redirected to the quiz editor to add questions

## Testing the API

You can test the API endpoints using tools like:
- **Postman**
- **curl**
- **Insomnia**

Example API call:
```bash
# Register a user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "instructor"
  }'
```

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` accordingly

### Database Issues
The app uses SQLite by default. The database file (`quiz-module.db`) will be created automatically in the backend directory.

### CORS Errors
Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Authentication Issues
- Clear localStorage in your browser
- Check that JWT_SECRET is set in backend `.env`
- Verify token is being sent in API requests (check browser DevTools Network tab)

## Next Steps

- Review the [README.md](./README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI components
- Add more features as needed

## Production Deployment

Before deploying to production:

1. **Change JWT Secret** - Use a secure random string
2. **Switch Database** - Use PostgreSQL or MySQL instead of SQLite
3. **Disable Synchronize** - Set `synchronize: false` in TypeORM config
4. **Set Environment Variables** - Properly configure all env vars
5. **Enable CORS** - Update CORS settings for production domain
6. **Build Applications**:
   ```bash
   # Build backend
   cd backend
   npm run build
   
   # Build frontend
   cd ../frontend
   npm run build
   ```

