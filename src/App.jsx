import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import CompanyLayout from './components/CompanyLayout';
import EmployeeLayout from './components/EmployeeLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import JobsPreview from './pages/JobsPreview';
import CompaniesPreview from './pages/CompaniesPreview';
import Login from './pages/Login';
import Register from './pages/Register';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeJobs from './pages/employee/Jobs';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeApplications from './pages/employee/Applications';
import EmployeeSkills from './pages/employee/Skills';
import JobDetails from './pages/employee/JobDetails';
import AppliedJobs from './pages/employee/AppliedJobs';
import SavedJobs from './pages/employee/SavedJobs';
import Notifications from './pages/employee/Notifications';
import Messages from './pages/employee/Messages';
import AccountSettings from './pages/employee/AccountSettings';

// Company pages
import CompanyDashboard from './pages/company/Dashboard';
import PostJob from './pages/company/PostJob';
import CompanyApplicants from './pages/company/Applicants';
import ReviewApplications from './pages/company/ReviewApplications';
import CompanyProfile from './pages/company/Profile';
import CompanyManageJobs from './pages/company/ManageJobs';
import CompanyInterviews from './pages/company/Interviews';
import CompanyMessages from './pages/company/Messages';
import CompanyNotifications from './pages/company/Notifications';
import CompanyBilling from './pages/company/Billing';
import CompanySettings from './pages/company/Settings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ApproveUsers from './pages/admin/ApproveUsers';
import ManageJobs from './pages/admin/ManageJobs';
import ManageCompanies from './pages/admin/ManageCompanies';
import ManageEmployees from './pages/admin/ManageEmployees';
import Reports from './pages/admin/Reports';
import AdminContacts from './pages/admin/Contacts';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="jobs" element={<JobsPreview />} />
            <Route path="companies" element={<CompaniesPreview />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Employee routes with separate layout */}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="applications"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="skills"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeSkills />
                </ProtectedRoute>
              }
            />
            <Route
              path="job/:jobId"
              element={
                <ProtectedRoute requiredRole="employee">
                  <JobDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="applied-jobs"
              element={
                <ProtectedRoute requiredRole="employee">
                  <AppliedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="saved-jobs"
              element={
                <ProtectedRoute requiredRole="employee">
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <ProtectedRoute requiredRole="employee">
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute requiredRole="employee">
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="account-settings"
              element={
                <ProtectedRoute requiredRole="employee">
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Company routes with separate layout */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="post-job"
              element={
                <ProtectedRoute requiredRole="company">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="applicants"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="review-applications"
              element={
                <ProtectedRoute requiredRole="company">
                  <ReviewApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-jobs"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="interviews"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyInterviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="billing"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyBilling />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanySettings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin routes with separate layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="approve-users"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <ApproveUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-companies"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <ManageCompanies />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-employees"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <ManageEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-jobs"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="contacts"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
