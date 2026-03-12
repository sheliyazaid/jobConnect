# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Cloudinary account

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password**
4. Create a **Firestore Database** (start in test mode, then add security rules)
5. Copy your Firebase config and paste it in `src/config/firebase.js`

### 3. Configure Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Settings → Upload
3. Create an **Upload Preset** (unsigned or signed)
4. Copy your **Cloud Name** and **Upload Preset**
5. Update `src/config/cloudinary.js`

### 4. Set Firestore Security Rules

Copy the security rules from `README.md` and paste them in Firebase Console → Firestore → Rules

### 5. Create Your First Admin User

**Important**: You need at least one admin user to approve other registrations.

1. Register a regular account through the app (can be any role)
2. Go to Firebase Console → Firestore Database
3. Find the `users` collection
4. Locate your user document (by email or UID)
5. Edit the document and set:
   - `role: "admin"`
   - `status: "approved"`
6. Save the document

Now you can log in as admin and approve other users!

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Testing the Application

1. **As Admin**: Log in and go to "Review Pending Approvals" to approve new users
2. **As Employee**: Register, wait for approval, then browse and apply for jobs
3. **As Company**: Register, wait for approval, then post jobs and review applicants

## Common Issues

### "Permission denied" errors
- Check your Firestore security rules
- Ensure you're logged in with the correct account

### Images/Resumes not uploading
- Verify Cloudinary credentials are correct
- Check upload preset permissions
- Ensure CORS is enabled in Cloudinary settings

### Users can't access features after registration
- Check that admin has approved their account
- Verify `status` field in Firestore is set to `"approved"`

## Next Steps

- Customize the styling in Tailwind config
- Add more features as needed
- Deploy to production (Vercel, Netlify, etc.)

