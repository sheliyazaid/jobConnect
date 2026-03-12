# JobConnect - Modern Job Portal Platform

JobConnect is a comprehensive web-based job portal that connects companies with job seekers. Built with React, Tailwind CSS, Firebase, and Cloudinary.

## Features

### Public Features
- **Home Page**: Overview of the platform with features, statistics, and testimonials
- **About Page**: Mission, vision, and how the platform works
- **Jobs Preview**: Browse available job opportunities (public view)
- **Companies Preview**: View verified companies on the platform

### Employee Features
- **Registration**: Sign up as an employee with resume upload
- **Dashboard**: Track job applications and view application status
- **Job Browsing**: Search and filter job listings
- **Apply for Jobs**: One-click application process
- **Profile Management**: Digital resume with skills, experience, and education

### Company Features
- **Registration**: Company registration with verification details
- **Dashboard**: Overview of job postings and applications
- **Post Jobs**: Create detailed job listings with requirements
- **View Applicants**: Review applications and candidate profiles
- **Manage Applications**: Accept or reject candidates

### Admin Features
- **Dashboard**: Platform statistics and overview
- **User Approval**: Review and approve/reject registration requests
- **Job Management**: Monitor and manage all job postings
- **Platform Oversight**: Full visibility of platform activity

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Cloudinary (for images and resumes)
- **Routing**: React Router DOM

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Update `src/config/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Cloudinary Configuration

1. Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name and create an upload preset
3. Update `src/config/cloudinary.js`:

```javascript
export const CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
export const CLOUDINARY_UPLOAD_PRESET = 'your-upload-preset';
```

### 4. Firestore Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /jobs/{jobId} {
      allow read: if true;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'company';
      allow update, delete: if request.auth != null && 
        (resource.data.companyId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (resource.data.employeeId == request.auth.uid ||
         resource.data.companyId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'employee';
      allow update: if request.auth != null && 
        (resource.data.companyId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### 5. Create Admin User

To create an admin user:

1. Register a regular account through the platform
2. Go to Firebase Console > Firestore
3. Find the user document in the `users` collection
4. Update the document:
   - Set `role: 'admin'`
   - Set `status: 'approved'`

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with navbar and footer
│   └── ProtectedRoute.jsx  # Route protection component
├── config/             # Configuration files
│   ├── firebase.js     # Firebase setup
│   └── cloudinary.js   # Cloudinary setup
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── About.jsx       # About page
│   ├── JobsPreview.jsx # Public jobs view
│   ├── CompaniesPreview.jsx  # Public companies view
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── employee/       # Employee pages
│   ├── company/        # Company pages
│   └── admin/          # Admin pages
└── App.jsx             # Main app component with routing
```

## User Roles

### Employee
- Browse and apply for jobs
- Manage profile and resume
- Track application status

### Company
- Post job listings
- Review applications
- Accept/reject candidates

### Admin
- Approve user registrations
- Manage all job postings
- Monitor platform activity

## Account Approval Process

1. User registers (Employee or Company)
2. Account status is set to `pending`
3. Admin reviews registration request
4. Admin approves or rejects the account
5. User receives access based on approval status

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## License

This project is open source and available for use.
