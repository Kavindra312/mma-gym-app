# 🥋 MMA Gym App

> A modern gym membership and class scheduling platform built for martial arts gyms and their students

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg)](CODE_OF_CONDUCT.md)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Key Features Breakdown](#key-features-breakdown)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Overview

**MMA Gym App** is a comprehensive gym management platform designed specifically for martial arts gyms. It streamlines membership management, class scheduling, and attendance tracking through an intuitive interface inspired by Canvas LMS.

### The Problem

Traditional gym management systems are either:
- Too complex and expensive for small-to-medium gyms
- Not designed for the unique needs of martial arts schools
- Lack modern features like QR code check-in and mobile-first design

### Our Solution

A lightweight, affordable, and purpose-built platform that:
- ✅ Manages multiple disciplines (BJJ, Boxing, Kickboxing, Muay Thai, Wrestling, MMA)
- ✅ Tracks voucher-based memberships
- ✅ Enables instant QR code check-ins
- ✅ Allows coaches to share class concepts/topics
- ✅ Provides real-time attendance tracking
- ✅ Works seamlessly on mobile and desktop

---

## ✨ Features

### For Students
- 📱 **Mobile-First Dashboard** - View all your gyms and voucher balances at a glance
- 📅 **Interactive Timetables** - Browse classes by discipline with real-time availability
- 🎟️ **Voucher Tracking** - Monitor your remaining class credits and usage history
- 📲 **QR Code Check-In** - Scan and check in to classes in seconds
- 📚 **Class Concepts** - See what techniques/topics will be covered before class
- 🔔 **Notifications** - Get updates on schedule changes and low voucher warnings

### For Coaches
- 🗓️ **Class Management** - View your assigned classes and upcoming schedule
- 📝 **Concept Sharing** - Post daily class topics and training focus areas
- 📊 **Attendance Tracking** - See who checked in and export attendance lists
- 🔐 **QR Code Generation** - Display secure, time-limited QR codes for check-ins
- 👥 **Student Insights** - View student attendance patterns and engagement

### For Gym Owners (Head Coaches)
- 🏢 **Gym Profile Management** - Create and customize your gym's presence
- 👥 **Staff Management** - Invite coaches and assign them to classes
- 🥋 **Multi-Discipline Support** - Create separate timetables for each martial art
- ⏰ **Flexible Scheduling** - Set up recurring classes with custom time slots
- 💳 **Voucher Management** - Issue and track voucher packages for students
- 📈 **Analytics Dashboard** - Monitor gym performance, attendance, and revenue
- 🎨 **Customization** - Brand your gym with logos and color schemes

---

## 🎬 Demo

> Coming soon! We're currently in active development.

**Planned Demo Features:**
- Live demo environment
- Sample gym with test data
- Interactive walkthrough videos
- Screenshots of key features

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) 18+
- **Framework**: [Express.js](https://expressjs.com/) 4.x
- **Database**: [PostgreSQL](https://www.postgresql.org/) 14+
- **Authentication**: JSON Web Tokens (JWT)
- **QR Codes**: [qrcode](https://www.npmjs.com/package/qrcode) library
- **Testing**: [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest)

### Frontend
- **Framework**: [React](https://react.dev/) 18+
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **QR Scanner**: [html5-qrcode](https://www.npmjs.com/package/html5-qrcode)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Testing**: [React Testing Library](https://testing-library.com/react)

### Mobile (Future)
- **Framework**: [React Native](https://reactnative.dev/) or [Flutter](https://flutter.dev/)

### DevOps
- **Containerization**: [Docker](https://www.docker.com/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)
- **Hosting**: [TBD] (AWS, DigitalOcean, or Vercel)
- **Monitoring**: [Sentry](https://sentry.io/)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **npm** or **yarn** (comes with Node.js)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/mma-gym-app.git
cd mma-gym-app
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `backend` directory:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/mma_gym_app
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mma_gym_app
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email (for invitations - optional for MVP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password

# File Upload (optional)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

Create a `.env` file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=MMA Gym App
```

5. **Set up the database**

```bash
# Create the database
createdb mma_gym_app

# Run migrations
cd backend
npm run migrate

# Seed sample data (optional)
npm run seed
```

### Running Locally

**Start the backend server:**

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3000`

**Start the frontend development server:**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

**Access the application:**

Open your browser and navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
mma-gym-app/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── validations/       # Input validation schemas
│   │   └── app.js             # Express app setup
│   ├── migrations/            # Database migrations
│   ├── seeds/                 # Database seeds
│   ├── tests/                 # Backend tests
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/                   # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Generic UI components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── gym/           # Gym-related components
│   │   │   ├── timetable/     # Timetable components
│   │   │   └── qr/            # QR code components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── store/             # State management
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── .env.example           # Environment variables template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/                       # Documentation
│   ├── API.md                 # API documentation
│   ├── DATABASE.md            # Database schema
│   ├── SETUP.md               # Setup guide
│   └── DEPLOYMENT.md          # Deployment guide
│
├── .github/                    # GitHub specific files
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   ├── workflows/             # GitHub Actions
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── README.md                   # This file
```

---

## 👥 User Roles

### 🎓 Student (Member)
Students are gym members who attend classes.

**Permissions:**
- View subscribed gym(s)
- View timetables and class concepts
- Check in to classes via QR code
- View voucher balance and history
- Update personal profile

### 🥋 Coach (Staff)
Coaches are instructors who teach classes.

**Permissions:**
- View assigned classes and timetables
- Add/edit class concepts for their sessions
- Generate QR codes for check-ins
- View attendance for their classes
- Everything a Student can do

### 👔 Head Coach (Gym Owner/Admin)
Head coaches own and manage the gym.

**Permissions:**
- Create and manage gym profile
- Invite and manage coaches
- Create disciplines and timetables
- Create and assign class time slots
- Manage student memberships
- Issue and manage voucher packages
- View all analytics and reports
- Everything a Coach can do

---

## 🔑 Key Features Breakdown

### 1. Multi-Discipline Timetables

Each gym can offer multiple martial arts, each with its own timetable:

- Brazilian Jiu-Jitsu (BJJ)
- Boxing
- Kickboxing
- Muay Thai
- Wrestling
- Mixed Martial Arts (MMA)

**How it works:**
1. Head coach creates disciplines
2. Creates a timetable for each discipline
3. Adds weekly recurring time slots
4. Assigns coaches to each time slot
5. Students view all disciplines in one unified view

### 2. Voucher-Based Membership

Flexible credit system instead of unlimited access:

**Benefits:**
- Pay only for classes attended
- No pressure to attend daily
- Flexible packages (10, 20, 30 class packs)
- Clear tracking of remaining credits
- Optional expiration dates

**How it works:**
1. Student purchases a voucher package
2. Each check-in deducts 1 voucher
3. Student can view balance anytime
4. Low balance triggers notifications
5. Head coach can add bonus vouchers

### 3. QR Code Check-In

Secure, contactless attendance tracking:

**Security Features:**
- Time-limited QR codes (expire after class)
- Date-specific (only valid for that day's class)
- Hashed codes to prevent forgery
- Location verification (optional)
- Automatic voucher deduction

**How it works:**
1. Coach generates QR code before class
2. Displays on phone/tablet at entrance
3. Students scan with app camera
4. Instant check-in confirmation
5. Voucher automatically deducted
6. Attendance recorded in database

### 4. Class Concepts

Coaches can share what will be covered in class:

**Examples:**
- "Guard Passing Fundamentals - Knee Slice & Torreando"
- "Boxing Combinations - Jab, Cross, Hook"
- "Clinch Entries from Striking Range"

**Benefits:**
- Students know what to expect
- Helps with preparation
- Increases engagement
- Shows progression over time

---

## 📚 API Documentation

API documentation is available in the `docs/API.md` file.

### Quick Reference

**Base URL:** `http://localhost:3001/api`

**Authentication:** Bearer token in `Authorization` header

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user account |
| POST | `/auth/login` | No | Login and receive JWT tokens |
| POST | `/auth/refresh` | No | Refresh expired access token |
| GET | `/auth/me` | Yes | Get current user profile |
| POST | `/auth/logout` | No | Invalidate refresh token |

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"  // student, coach, or head_coach
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response includes accessToken (15min) and refreshToken (7 days)
```

#### Get Current User (Protected)
```bash
GET /api/auth/me
Authorization: Bearer <accessToken>
```

#### Refresh Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<your-refresh-token>"
}
```

### Other Endpoints (Coming Soon)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gyms` | List all gyms |
| POST | `/gyms` | Create new gym |
| GET | `/gyms/:id/timetables` | Get gym timetables |
| POST | `/check-in/qr` | Check in with QR code |
| GET | `/memberships/:id/vouchers` | Get voucher balance |

**Full documentation:** [API.md](docs/API.md)

---

## 🤝 Contributing

We love contributions! Whether it's bug fixes, new features, or documentation improvements, your help is welcome.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines
- Follow the code style and conventions
- Write tests for new features
- Update documentation as needed
- Be respectful and collaborative

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/yourusername/mma-gym-app/labels/good%20first%20issue) - these are great for newcomers!

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Weeks 1-8)
- [x] Project setup and infrastructure
- [x] Authentication system
- [x] Gym and user management
- [x] Timetable creation
- [x] Voucher system
- [x] QR code check-in
- [x] Class concepts
- [ ] Testing and launch

### 🔄 Phase 2: Enhancements (Months 2-3)
- [ ] Push notifications
- [ ] Payment integration (Stripe)
- [ ] In-app voucher purchases
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Waitlist system
- [ ] Mobile app (React Native)

### 🚀 Phase 3: Advanced Features (Months 4-6)
- [ ] Student progress tracking
- [ ] Belt/rank system
- [ ] Technique video library
- [ ] Private lessons booking
- [ ] Competition registration
- [ ] Multi-gym chain support
- [ ] White-label solution
- [ ] Merchandise shop

### 💡 Future Ideas
- AI-powered class recommendations
- Technique assessment tools
- Social features (student connections)
- Integration with wearables
- Virtual classes support
- Gamification and achievements

---

## 📊 Current Status

🚧 **In Active Development** 🚧

We're currently building the MVP. Check our [project board](https://github.com/yourusername/mma-gym-app/projects) for progress.

**Latest Milestone:** Phase 1 - MVP Development  
**Progress:** 45% Complete  
**Target Launch:** [Target Date]

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

### Run Frontend Tests

```bash
cd frontend
npm test                   # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

### Run E2E Tests

```bash
npm run test:e2e          # Run end-to-end tests
```

---

## 🚀 Deployment

Detailed deployment instructions are available in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Quick Deploy

**Prerequisites:**
- Domain name
- SSL certificate
- Server with Node.js and PostgreSQL

**Steps:**
1. Clone repository on server
2. Install dependencies
3. Set production environment variables
4. Run database migrations
5. Build frontend: `npm run build`
6. Start backend with PM2: `pm2 start server.js`
7. Configure Nginx as reverse proxy
8. Set up SSL with Let's Encrypt

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**What this means:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ Liability and warranty not provided

---

## 📞 Contact

**Project Maintainers:**
- Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com
- Zezo - [@zezotwitter](https://twitter.com/zezotwitter) - zezo.email@example.com

**Project Link:** [https://github.com/yourusername/mma-gym-app](https://github.com/yourusername/mma-gym-app)

**Website:** [Coming Soon]

---

## 🙏 Acknowledgments

### Inspiration
- [Canvas LMS](https://www.instructure.com/canvas) - For the dashboard design concept
- [Mindbody](https://www.mindbodyonline.com/) - For gym management inspiration
- Martial arts community for feedback and ideas

### Technologies
- All the amazing open-source libraries we use
- The Node.js and React communities
- PostgreSQL documentation and community

### Special Thanks
- Our beta testers
- Contributing developers
- Martial arts gyms who provided feedback
- Everyone who starred this repo ⭐

---

## 📸 Screenshots

> Coming soon! We're currently in development.

---

## 🎓 Learning Resources

Building this project? Here are helpful resources:

**Backend:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [REST API Design](https://restfulapi.net/)

**Frontend:**
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

**DevOps:**
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

## ❓ FAQ

### Q: Is this free to use?
**A:** Yes! This is an open-source project under the MIT license. Use it for free, even commercially.

### Q: Can I customize it for my gym?
**A:** Absolutely! Fork the repo and customize it to your needs.

### Q: Do you offer hosted solutions?
**A:** Not yet, but it's on our roadmap. For now, you'll need to self-host.

### Q: Can I contribute even if I'm a beginner?
**A:** Yes! Check out issues labeled `good first issue` to get started.

### Q: What's the difference between this and [Competitor]?
**A:** We're built specifically for martial arts gyms with features like voucher systems and multi-discipline support. We're also open-source and free.

### Q: Can I use this for non-martial arts gyms?
**A:** Sure! The concepts apply to any class-based fitness facility.

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/mma-gym-app&type=Date)](https://star-history.com/#yourusername/mma-gym-app&Date)

---

## 🔥 Show Your Support

If you find this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs
- 💡 **Suggesting** new features
- 🔀 **Contributing** code
- 📣 **Sharing** with others

Every bit helps make this project better!

---

<div align="center">

**Built with ❤️ by martial artists, for martial artists**

[Report Bug](https://github.com/yourusername/mma-gym-app/issues) • [Request Feature](https://github.com/yourusername/mma-gym-app/issues) • [Documentation](docs/)

Made with 🥋 by [Your Name](https://github.com/yourusername) and [Zezo](https://github.com/zezo)

</div>
