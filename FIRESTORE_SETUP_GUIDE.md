# Firebase Firestore Security Rules - Setup Guide

## 📋 Overview

A comprehensive `firestore.rules` file has been created with proper security rules for all collections based on user roles (employee, company, admin).

**File Location:** `e:\job\firestore.rules`

## 🔐 Security Rules Summary

The rules implement role-based access control:

### **Users Collection**
- ✅ Users can read/update their own profiles
- ✅ Admins can read all user profiles
- ❌ Cannot delete user profiles

### **Jobs Collection**
- ✅ All authenticated users can read active jobs
- ✅ Companies can create/update/delete their own jobs
- ✅ Admins can manage all jobs
- ❌ Employees cannot modify jobs

### **Applications Collection**
- ✅ Employees can read their own applications
- ✅ Companies can read/update applications for their jobs
- ✅ Employees can create applications
- ✅ Admins can manage all applications
- ❌ Cannot delete

### **SavedJobs Collection**
- ✅ Employees can read/create/delete their saved jobs
- ✅ Admins can read all
- ❌ Cannot update, cannot delete others' data

### **Conversations & Messages**
- ✅ Users can read/create messages in conversations they're part of
- ✅ Users can update their own messages
- ✅ Admins have full access
- ❌ Cannot delete

### **Notifications**
- ✅ Users can read/update/delete their own notifications
- ✅ Admins can manage all notifications
- ❌ Cannot delete others' data

### **Contacts**
- ✅ Anyone authenticated can create contact messages
- ✅ Companies and admins can read/update
- ✅ Only admins can delete
- ❌ General users cannot modify

---

## 🚀 How to Apply These Rules

### **Option 1: Firebase CLI (Recommended)**

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase in your project** (if not done):
   ```bash
   cd e:\job
   firebase init firestore
   ```

3. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### **Option 2: Firebase Console (Manual)**

1. **Login to Firebase Console**: https://console.firebase.google.com/

2. **Select your project** (JobConnect or similar)

3. **Navigate to**: Firestore Database → Rules tab

4. **Replace all existing rules** with the content from `firestore.rules` file

5. **Click "Publish"**

### **Option 3: Copy & Paste**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database → Rules
4. Copy all text from `firestore.rules`
5. Paste into the rules editor
6. Click "Publish"

---

## ✅ Testing After Deployment

These errors should **now be fixed**:
- ✅ Dashboard: Can fetch user data and statistics
- ✅ Jobs page: Can fetch and browse all active jobs
- ✅ Saved Jobs: Can fetch and save jobs
- ✅ Applied Jobs: Can fetch applications
- ✅ Notifications: Can fetch user notifications
- ✅ Messages: Can fetch conversations and messages
- ✅ Company Dashboard: Can fetch company's jobs

### **Verify Rules Are Working**

1. **Login as Employee**:
   - Should be able to browse jobs ✅
   - Should be able to apply for jobs ✅
   - Should be able to read own profile ✅
   - Should NOT be able to read other users' data ✅

2. **Login as Company**:
   - Should be able to create/manage jobs ✅
   - Should be able to see applications for their jobs ✅
   - Should NOT be able to see other companies' jobs ✅

3. **Login as Admin**:
   - Should have full read/write access to all collections ✅

---

## 📝 What These Rules Prevent

- ❌ Employees reading other employees' private data
- ❌ Companies reading other companies' data
- ❌ Unauthenticated users accessing any data
- ❌ Users modifying data they don't own
- ❌ Deletion of critical data (users, applications)
- ❌ Unauthorized batch operations

---

## 🔄 If You Need to Modify Rules Later

The rules use helper functions for easy maintenance:

```javascript
isAuthenticated()  // Is user logged in?
isUser(userId)     // Is this the user's own data?
isEmployee()       // Is user an employee?
isCompany()        // Is user a company?
isAdmin()          // Is user an admin?
```

To change access for a specific collection, modify the matching pattern:
```javascript
match /collectionName/{docId} {
  allow read: if [YOUR_CONDITION_HERE];
  allow create: if [YOUR_CONDITION_HERE];
  allow update: if [YOUR_CONDITION_HERE];
  allow delete: if [YOUR_CONDITION_HERE];
}
```

---

## 🆘 Troubleshooting

### **Still Getting Permission Errors?**

1. **Clear browser cache**: Ctrl+Shift+Delete or Cmd+Shift+Delete
2. **Re-authenticate**: Logout and login again
3. **Check user role**: Ensure users have correct `role` field set in `users` collection:
   - `role: "employee"` for job seekers
   - `role: "company"` for companies
   - `role: "admin"` for administrators
4. **Wait 1-2 minutes**: Rules can take time to propagate

### **Rules Deployment Failed?**

- Ensure you're using correct Firebase project ID
- Check Firebase CLI credentials: `firebase login`
- Verify Firestore is enabled in your Firebase project

### **Specific Collection Still Not Working?**

Check the rules file and verify the `match` path for that collection matches exactly:
- `/users/{userId}`
- `/jobs/{jobId}`
- `/applications/{applicationId}`
- `/savedJobs/{savedJobId}`
- `/conversations/{conversationId}`
- `/conversations/{conversationId}/messages/{messageId}`
- `/notifications/{notificationId}`
- `/contacts/{contactId}`

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Cloud Firestore Security Rules Examples](https://github.com/firebase/snippets-web/tree/master/firestore/rules)
- [Role-Based Access Control in Firestore](https://firebase.google.com/docs/firestore/solutions/role-based-access)

---

## ✨ Next Steps

1. **Deploy the rules** using one of the methods above
2. **Test the app** to verify permission errors are fixed
3. **Monitor Firestore usage** in Firebase Console
4. **Set appropriate quotas** if needed (Settings → Firestore → Quotas & Limits)

Your app should now work without permission errors! 🎉
