const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About JobConnect</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to revolutionize the hiring process and make job searching simpler, faster, and more transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            JobConnect was founded with a simple goal: to bridge the gap between talented job seekers and forward-thinking companies. We believe that finding the right job or the right candidate shouldn't be complicated.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our platform provides a streamlined, secure, and user-friendly environment where companies can post opportunities and job seekers can discover and apply for positions that match their skills and aspirations.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary-600">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We envision a future where the hiring process is transparent, efficient, and accessible to everyone. By leveraging modern technology and best practices, we're creating a platform that benefits both employers and job seekers.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our commitment is to maintain the highest standards of security, verification, and user experience, ensuring that JobConnect remains the trusted platform for career opportunities.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Create Your Account</h3>
            <p className="text-gray-600 text-sm">
              Sign up as either a job seeker or a company. Our admin team will verify your account to ensure platform security.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">Connect & Discover</h3>
            <p className="text-gray-600 text-sm">
              Companies post job opportunities, and job seekers browse and discover positions that match their skills and interests.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Apply & Hire</h3>
            <p className="text-gray-600 text-sm">
              Job seekers apply directly through the platform, and companies review applications, manage candidates, and make hiring decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-2">Transparency</h3>
            <p className="text-sm text-gray-600">Clear communication and honest processes</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-gray-600">Protecting your data and privacy</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Efficiency</h3>
            <p className="text-sm text-gray-600">Streamlined processes that save time</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-gray-600">Open to everyone, everywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

