# Firestore Security Rules - Permission Matrix

## 📊 Collection Access by Role

| Collection | Employee | Company | Admin | Anonymous |
|------------|----------|---------|-------|-----------|
| **users (own)** | R/W | R/W | R/W | ✗ |
| **users (others)** | ✗ | ✗ | R | ✗ |
| **jobs (read)** | R | R | R | ✗ |
| **jobs (create)** | ✗ | C | C | ✗ |
| **jobs (update own)** | ✗ | U | U | ✗ |
| **applications (own)** | R/C | ✗ | R | ✗ |
| **applications (their jobs)** | ✗ | R/U | R/U | ✗ |
| **savedJobs (own)** | C/R/D | ✗ | R | ✗ |
| **conversations (own)** | R/C/U | R/C/U | R/U | ✗ |
| **messages (in conv)** | R/C | R/C | R | ✗ |
| **notifications (own)** | R/U/D | R/U/D | R/U | ✗ |
| **contacts** | C | R/U/C | R/U/D | ✗ |

**Legend:**
- **R** = Read
- **C** = Create
- **U** = Update
- **D** = Delete
- **✗** = Not Allowed

---

## 🎯 What Each Role Can Do

### **Employee (Job Seeker)**
```
✅ Browse all active jobs
✅ Apply for jobs (create applications)
✅ View own applications and status
✅ Save/bookmark jobs
✅ View own profile
✅ Update own profile
✅ Message companies
✅ View own notifications
❌ Create jobs
❌ See other employees' profiles
❌ Delete own applications
```

### **Company (Recruiter)**
```
✅ Create new job postings
✅ Edit own job postings
✅ Delete own job postings
✅ View applications for own jobs
✅ Update application status
✅ View own profile
✅ Update own profile
✅ Message candidates
✅ View own notifications
✅ Contact form submissions
❌ View other companies' jobs
❌ See employees' private data
❌ Delete applications (only update)
```

### **Admin**
```
✅ Access all collections
✅ Read all user data
✅ Read/update all jobs
✅ Read/update all applications
✅ Read all notifications
✅ Manage all contacts
✅ Read all conversations/messages
✅ Delete any data
❌ Nothing is restricted (full access)
```

### **Anonymous (Not Logged In)**
```
❌ Cannot access any collection
❌ Must authenticate first
```

---

## 🔐 Data Isolation Examples

### **Company A & Company B**
- Company A **CAN** see own jobs and applications
- Company A **CANNOT** see Company B's jobs or applications
- Admin **CAN** see both

### **Employee A & Employee B**
- Employee A **CAN** see all job listings
- Employee A **CANNOT** see Employee B's applications
- Employee A **CANNOT** see Employee B's saved jobs
- Admin **CAN** see all

### **Messages**
- Only participants in a conversation can read messages
- Company cannot access employee messages in other conversations
- Admin can read all messages

---

## ⚙️ Role Detection

The rules automatically detect user role from the `users` collection:

```javascript
// User document structure
{
  "uid": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee" // or "company" or "admin"
  // ... other fields
}
```

**Making sure roles are set correctly:**
1. During registration, the `role` field **must** be set
2. During admin approval, verify the `role` is correct
3. If role changes, update the `users` document

---

## 🚨 Common Permission Error Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Missing or insufficient permissions` on `users` | User trying to read other user's data | Only users can access their own documents |
| Error on `jobs` | Company trying to update another company's job | Only own jobs can be modified |
| Error on `applications` | Employee viewing other's applications | Only your own applications are readable |
| Error on `savedJobs` | No role field in user document | Add `role` field to user profile |
| Error on `notifications` | Reading other user's notifications | Only own notifications accessible |
| Error on `conversations` | Not a participant in conversation | Only participants can access |

---

## 📋 Checklist Before Deploying

- [ ] All users have a `role` field set (`employee`, `company`, or `admin`)
- [ ] Admin users have `role: "admin"` in their profile
- [ ] Company users have `role: "company"` in their profile
- [ ] Employee users have `role: "employee"` in their profile
- [ ] Firebase project is correctly selected in CLI
- [ ] Rules file syntax is valid (check for typos)
- [ ] You have Firestore owner permissions in Google Cloud Console

---

## 🧪 Testing Specific Scenarios

### **Test as Employee:**
```javascript
// Should succeed
- Login as employee
- Navigate to Browse Jobs (should load)
- Apply for a job (should succeed)
- View Saved Jobs (should load)
- Update profile (should succeed)

// Should fail
- Try to create a job (permission denied)
- Try to view another employee's profile (permission denied)
```

### **Test as Company:**
```javascript
// Should succeed
- Login as company
- Create a new job (should succeed)
- Edit own jobs (should succeed)
- View applications for own jobs (should load)
- Update application status (should succeed)

// Should fail
- Try to view another company's jobs (permission denied)
- Try to edit another company's job (permission denied)
```

### **Test as Admin:**
- All operations should succeed

---

## 📞 Support

If you encounter issues after deploying these rules:

1. **Check Firebase Console Logs**:
   - Go to Firestore → Rules
   - Check "Logs" tab for specific errors

2. **Verify Rules Deployed**:
   - Rules tab should show your rules (not default deny-all)

3. **Clear Cache & Retry**:
   - Browser cache often caches old auth tokens
   - Clear storage with DevTools
   - Logout and login again

4. **Check User Role**:
   - Open Firestore → users collection
   - Verify each user document has the `role` field

---

**Generated:** March 13, 2026
**Firestore Rules Version:** 2
**Last Updated:** After Naukri Job Search Redesign
