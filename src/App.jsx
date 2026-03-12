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

// Company pages
import CompanyDashboard from './pages/company/Dashboard';
import PostJob from './pages/company/PostJob';
import CompanyApplicants from './pages/company/Applicants';
import CompanyProfile from './pages/company/Profile';

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
