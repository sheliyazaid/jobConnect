import { Link } from 'react-router-dom';
import { Search, FileCheck, Calendar, Users, BarChart3, MessageSquare, Zap, Shield, Globe, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Job Search",
      description: "Find your perfect job with AI-powered recommendations based on skills, experience, and preferences."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Application Tracking",
      description: "Track all your applications, interviews, and offers in one centralized dashboard."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Interview Scheduling",
      description: "Schedule and manage interviews with automated reminders and calendar integration."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Companies can build teams and collaborate on recruitment with role-based access."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Detailed reports on hiring metrics, application sources, and team performance."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Direct Messaging",
      description: "Communicate directly with employers or candidates through integrated messaging."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Notifications",
      description: "Get real-time updates on applications, messages, and interview invitations."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with encrypted data and GDPR compliance."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Accessibility",
      description: "Access JobConnect from anywhere, anytime with our web and mobile platforms."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile First",
      description: "Full-featured mobile apps for iOS and Android for on-the-go access."
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">JobConnect Features</h1>
        <p className="text-lg text-secondary-700 mb-12 max-w-3xl">
          Everything you need to find jobs, manage applications, and build your career - all in one platform.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition border border-secondary-100">
              <div className="text-secondary-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">{feature.title}</h3>
              <p className="text-secondary-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* For Different Users */}
        <div className="bg-white rounded-lg p-12 mb-12 border border-secondary-100">
          <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">Built for Everyone</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Job Seekers */}
            <div className="border-l-4 border-secondary-600 pl-6">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">👨‍💼 Job Seekers</h3>
              <ul className="space-y-3 text-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Find jobs matching your skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Apply with one click</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Track applications in real-time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Message with companies directly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Build professional profile</span>
                </li>
              </ul>
            </div>

            {/* For Companies */}
            <div className="border-l-4 border-secondary-600 pl-6">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">🏢 Companies</h3>
              <ul className="space-y-3 text-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Post jobs to millions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>AI-powered candidate matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Review and manage applicants</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Schedule and track interviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Hiring analytics & reports</span>
                </li>
              </ul>
            </div>

            {/* For Admins */}
            <div className="border-l-4 border-secondary-600 pl-6">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">🛡️ Administrators</h3>
              <ul className="space-y-3 text-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Platform-wide management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>User verification & approval</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Performance analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>Community moderation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary-600 mt-1">✓</span>
                  <span>System reports & insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-900 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-secondary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and companies using JobConnect to find and hire talent.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-secondary-900 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition">
              Get Started Free
            </Link>
            <Link to="/pricing" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-800 transition">
              View Pricing
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-secondary-600 hover:text-secondary-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
