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
import GovernmentJobs from './pages/employee/GovernmentJobs';
import GovernmentJobDetails from './pages/employee/GovernmentJobDetails';
import EmployeeGovernmentApplications from './pages/employee/GovernmentApplications';

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
import PostGovernmentJob from './pages/admin/PostGovernmentJob';
import ManageGovernmentJobs from './pages/admin/ManageGovernmentJobs';
import GovernmentApplications from './pages/admin/GovernmentApplications';
import GovernmentNotifications from './pages/admin/GovernmentNotifications';
import ExpiredGovernmentJobs from './pages/admin/ExpiredGovernmentJobs';
import GovernmentJobCategories from './pages/admin/GovernmentJobCategories';
import GovernmentReports from './pages/admin/GovernmentReports';

// Footer pages
import Privacy from './pages/Privacy';
import Accessibility from './pages/Accessibility';
import TalentSolutions from './pages/TalentSolutions';
import Policies from './pages/Policies';
import Careers from './pages/Careers';
import MarketingSolutions from './pages/MarketingSolutions';
import AdChoices from './pages/AdChoices';
import Advertising from './pages/Advertising';
import SalesSolutions from './pages/SalesSolutions';
import Mobile from './pages/Mobile';
import SmallBusiness from './pages/SmallBusiness';
import SafetyCenter from './pages/SafetyCenter';
import HelpCenter from './pages/HelpCenter';
import RecommendationTransparency from './pages/RecommendationTransparency';
import ProfessionalCommunity from './pages/ProfessionalCommunity';

// New pages
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import TermsAndConditions from './pages/TermsAndConditions';
import FAQ from './pages/FAQ';
import Testimonials from './pages/Testimonials';
import Events from './pages/Events';

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
            {/* Footer pages */}
            <Route path="privacy" element={<Privacy />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="talent-solutions" element={<TalentSolutions />} />
            <Route path="policies" element={<Policies />} />
            <Route path="careers" element={<Careers />} />
            <Route path="marketing-solutions" element={<MarketingSolutions />} />
            <Route path="ad-choices" element={<AdChoices />} />
            <Route path="advertising" element={<Advertising />} />
            <Route path="sales-solutions" element={<SalesSolutions />} />
            <Route path="mobile" element={<Mobile />} />
            <Route path="small-business" element={<SmallBusiness />} />
            <Route path="safety-center" element={<SafetyCenter />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="recommendation-transparency" element={<RecommendationTransparency />} />
            <Route path="professional-community" element={<ProfessionalCommunity />} />
            {/* New pages */}
            <Route path="features" element={<Features />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="faqs" element={<FAQ />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="events" element={<Events />} />
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
            <Route
              path="government-jobs"
              element={
                <ProtectedRoute requiredRole="employee">
                  <GovernmentJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="government-jobs/:id"
              element={
                <ProtectedRoute requiredRole="employee">
                  <GovernmentJobDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="government-applications"
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeGovernmentApplications />
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
            <Route
              path="post-government-job"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <PostGovernmentJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-government-jobs"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <ManageGovernmentJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="government-applications"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <GovernmentApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="government-notifications"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <GovernmentNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="expired-government-jobs"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <ExpiredGovernmentJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="government-categories"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <GovernmentJobCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="government-reports"
              element={
                <ProtectedRoute requiredRole="admin" requireApproval={false}>
                  <GovernmentReports />
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
