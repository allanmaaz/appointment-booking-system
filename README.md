# 🏥 Appointment Booking System

A full-stack medical appointment booking system with location-based doctor search, Google OAuth authentication, and real-time availability.

## ✨ Features

- **Location-Based Doctor Search** - Find doctors near you with interactive maps
- **Google OAuth Integration** - Secure login with Google accounts
- **Real-Time Booking** - Book appointments with instant availability check
- **Responsive Design** - Works on all devices
- **Admin Dashboard** - Manage appointments and users
- **Time Slot Management** - Customizable appointment scheduling

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Leaflet Maps** for location services
- **Axios** for API calls

### Backend
- **Spring Boot 3.2** with Java 17
- **PostgreSQL** database
- **JWT Authentication**
- **Spring Security** with Google OAuth2
- **JPA/Hibernate** for data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL
- Maven

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/appointment-booking-system.git
cd appointment-booking-system
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Setup Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5173` to authorized origins
   - Copy Client ID to your `.env` file

4. **Start PostgreSQL Database**
```bash
# Using Docker
docker run --name postgres-appointment -e POSTGRES_PASSWORD=password -e POSTGRES_DB=appointment_db -p 5432:5432 -d postgres:15

# Or use your local PostgreSQL installation
```

5. **Run Backend**
```bash
cd backend
mvn spring-boot:run
```

6. **Run Frontend**
```bash
cd frontend
npm install
npm run dev
```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-secret-key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# API URLs
VITE_API_BASE_URL=http://localhost:8080
VITE_API_URL=http://localhost:8080/api
```

### Demo Credentials

For testing purposes:
- **Email**: john.doe@email.com
- **Password**: test123
- **Role**: Admin

## 🌐 Deployment

### Option 1: Railway (Recommended)
1. Push code to GitHub
2. Connect repository at [railway.app](https://railway.app)
3. Deploy automatically with built-in PostgreSQL

### Option 2: Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Manual Cloud Deployment
See `DEPLOYMENT.md` for detailed instructions.

## 📁 Project Structure

```
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   └── api/        # API configuration
├── backend/            # Spring Boot application
│   └── src/main/java/com/appointment/
│       ├── controller/ # REST controllers
│       ├── service/    # Business logic
│       ├── entity/     # JPA entities
│       └── security/   # Security configuration
├── docker-compose.prod.yml # Production deployment
└── DEPLOYMENT.md       # Detailed deployment guide
```

## 🔐 Security Features

- JWT token authentication
- Google OAuth 2.0 integration
- Password hashing with BCrypt
- CORS protection
- Input validation and sanitization
- Secure HTTP headers

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/nearby` - Get nearby doctors

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}/cancel` - Cancel appointment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🛟 Support

For deployment help or issues:
1. Check the `DEPLOYMENT.md` guide
2. Verify your environment variables
3. Check application logs
4. Open an issue on GitHub

---

**🚀 Ready to deploy? Use Railway.app for the fastest deployment!**