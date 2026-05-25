# 🎓 SkillTrack: Internship & Skill Management System

SkillTrack is a premium, full-stack management portal designed for students and administrators to track internships, manage technical skills, and monitor placement applications.

## ✨ Features

### 👤 User Portal
- **Role-Based Dashboards**: Customized views for Students and Administrators.
- **Skill Management**: Add skills with categories (Programming, Frameworks, etc.) and proficiency levels.
- **Internship Tracker**: Log internships with status (Ongoing, Completed), stipend, and domain details.
- **Placement Logic**: Track job application statuses and packages (LPA).
- **Profile Customization**: Manage personal bio and academic information.

### 👑 Admin Portal
- **Analytics Overview**: Visual charts for system-wide skill distribution and internship status.
- **Student Verification**: Official verification/approval for student skills and internship records.
- **Comprehensive Database**: Access and manage all registered student profiles.

## 🛠️ Tech Stack

- **Frontend**: React.js (Dark Mode UI), Recharts (Analytics), Axios, React Router.
- **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt.js.
- **Database**: MongoDB Atlas (Cloud).
- **Styling**: Vanilla CSS (Premium Custom Design System).

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas Account (or local MongoDB)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd internship-skill-management-system
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   ```

### Running the App

1. **Start Backend**:
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm start
   ```

The app will be available at `http://localhost:3000`.

## 📸 Screenshots

- **Login Page**: A sleek, dark-themed authentication portal.
- **Student Dashboard**: Stat-focused overview of skills and activity.
- **Admin Panel**: Data-driven charts and student management.

---

Built with ❤️ for Internship & Skill Management.
