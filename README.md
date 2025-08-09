# Hostel Booking Application - Integrated Full Stack

A complete hostel booking application with React frontend and Django backend, fully integrated and ready to deploy.

## 🏗️ Project Structure

```
hostel-booking-app-integrated/
├── backend/                 # Django REST API
│   ├── core/               # Main Django app
│   │   ├── models/         # Database models
│   │   ├── views/          # API views
│   │   ├── serializers/    # Data serializers
│   │   └── migrations/     # Database migrations
│   ├── hostel_booking/     # Django project settings
│   ├── requirements.txt    # Python dependencies
│   └── manage.py          # Django management script
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   └── context/       # React context
│   ├── public/           # Static assets
│   └── package.json      # Node.js dependencies
└── README.md            # This file
```

## 🚀 Features

### Backend (Django REST API)
- **User Authentication**: JWT-based authentication with role-based access (Student/Provider)
- **Room Management**: CRUD operations for hostel rooms with image upload
- **Booking System**: Date-based booking with availability checking
- **Payment Integration**: Paystack payment gateway integration
- **Provider Dashboard**: Revenue tracking and booking management
- **Password Reset**: Email-based password reset functionality

### Frontend (React)
- **Modern UI**: Responsive design with modern CSS
- **Authentication**: Login/Register with JWT token management
- **Room Browsing**: Filter and search rooms by type, price, and facilities
- **Booking System**: Date picker with availability checking
- **Payment Processing**: Integrated Paystack payment flow
- **User Dashboard**: Booking history and profile management
- **Real-time Updates**: Dynamic content updates

## 🔧 Integration Features

This repository contains a **fully integrated** version where the frontend and backend work seamlessly together:

### ✅ Fixed Integration Issues
- **API Endpoint Mapping**: All frontend API calls now match backend endpoints
- **Data Structure Alignment**: Frontend and backend data models are synchronized
- **Authentication Flow**: JWT tokens properly managed across both systems
- **CORS Configuration**: Backend configured to accept frontend requests
- **Environment Variables**: Proper configuration for both development and production

### 🔄 Data Transformation
- **Bidirectional Mapping**: Automatic conversion between frontend and backend data formats
- **Room Model Sync**: Frontend room cards now display backend room data correctly
- **Booking System**: Date-based booking system replaces academic year concept
- **User Profiles**: Unified user management across both systems

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (or SQLite for development)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hostel-booking-app-integrated
```

### 2. Backend Setup (Django)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup (React)
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:8000)

# Start development server
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
EMAIL_HOST_USER=your-email
EMAIL_HOST_PASSWORD=your-email-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

## 🚀 Running the Application

### Development Mode
1. **Start Backend**: `cd backend && python manage.py runserver`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Access Application**: http://localhost:5173

### Production Deployment
1. **Backend**: Deploy Django app to your preferred platform (Heroku, DigitalOcean, etc.)
2. **Frontend**: Build and deploy React app (`npm run build`)
3. **Update Environment**: Set production API URLs and keys

## 📚 API Documentation

The backend provides a comprehensive REST API:

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh
- `POST /api/auth/password-reset/` - Password reset

### Room Endpoints
- `GET /api/rooms/` - List all rooms
- `GET /api/rooms/{id}/` - Get room details
- `POST /api/rooms/` - Create room (Provider only)
- `PUT /api/rooms/{id}/` - Update room (Provider only)
- `DELETE /api/rooms/{id}/` - Delete room (Provider only)

### Booking Endpoints
- `GET /api/bookings/` - List user bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}/` - Get booking details
- `PUT /api/bookings/{id}/` - Update booking
- `DELETE /api/bookings/{id}/` - Cancel booking

### Payment Endpoints
- `POST /api/payments/initialize/` - Initialize payment
- `POST /api/payments/verify/` - Verify payment
- `POST /api/payments/webhook/` - Payment webhook

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔍 Integration Testing Results

The integration has been tested and verified:

✅ **Authentication Flow**: Login/Register works correctly
✅ **API Communication**: Frontend successfully communicates with backend
✅ **Data Synchronization**: Room and booking data displays correctly
✅ **Error Handling**: Proper error messages and validation
✅ **CORS Configuration**: Cross-origin requests work properly

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS settings include frontend URL
   - Check `ALLOWED_HOSTS` in Django settings

2. **API Connection Issues**
   - Verify `VITE_API_URL` in frontend `.env`
   - Ensure backend server is running on correct port

3. **Authentication Problems**
   - Check JWT token expiration
   - Verify token storage in localStorage

4. **Database Issues**
   - Run migrations: `python manage.py migrate`
   - Check database connection settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Django REST Framework for the robust backend API
- React and Vite for the modern frontend experience
- Paystack for payment processing
- Cloudinary for image management

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a fully integrated application where the frontend and backend have been properly aligned and tested to work together seamlessly. All major integration issues have been resolved, and the application is ready for development and deployment.