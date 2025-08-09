# 🚀 Quick Start Guide

Get your hostel booking application running in minutes!

## 📍 Your Application Location
```
C:\Users\a\Documents\hostel-booking-app-integrated\
```

## ⚡ Quick Setup (5 minutes)

### 1. Backend Setup (Django)
```bash
# Navigate to backend
cd "C:\Users\a\Documents\hostel-booking-app-integrated\backend"

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver
```
**Backend will run on: http://localhost:8000**

### 2. Frontend Setup (React)
```bash
# Open new terminal and navigate to frontend
cd "C:\Users\a\Documents\hostel-booking-app-integrated\frontend"

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start frontend server
npm run dev
```
**Frontend will run on: http://localhost:5173**

## 🌐 Access Your Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🔑 Default Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Test the Integration
1. Open http://localhost:5173
2. Click "Register" to create an account
3. Try logging in
4. Browse available rooms
5. Make a test booking

## 📱 Features Available
- ✅ User Registration & Login
- ✅ Room Browsing & Filtering
- ✅ Date-based Booking System
- ✅ Payment Integration (Paystack)
- ✅ User Dashboard
- ✅ Provider Dashboard
- ✅ Admin Panel

## 🆘 Troubleshooting

### Backend Issues
```bash
# If migrations fail
python manage.py makemigrations
python manage.py migrate

# Create superuser for admin
python manage.py createsuperuser
```

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Ensure backend .env has: `CORS_ALLOWED_ORIGINS=http://localhost:5173`
- Restart backend server after changing .env

