import { Link } from 'react-router-dom';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Accessibility</h1>
        <p className="text-lg text-secondary-700 mb-10 max-w-3xl">
          We’re committed to making JobConnect usable and inclusive for everyone, including people with disabilities.
        </p>

        <div className="bg-white rounded-xl shadow-md p-10 space-y-8 border border-secondary-100">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Our Commitment to Accessibility</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">WCAG Compliance</h3>
            <p className="text-secondary-600 mb-4">
              Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards published by the World Wide Web Consortium (W3C).
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Perceivable - Information presented in multiple ways</li>
              <li>Operable - Navigation via keyboard and other methods</li>
              <li>Understandable - Clear and simple language</li>
              <li>Robust - Compatible with assistive technologies</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Accessibility Features</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2 mb-4">
              <li>Keyboard navigation throughout the website</li>
              <li>Screen reader compatible markup</li>
              <li>High contrast color options</li>
              <li>Adjustable text sizes</li>
              <li>Alternative text for all images</li>
              <li>Descriptive link text</li>
              <li>Video captions and transcripts</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Browser and Assistive Technology Support</h3>
            <p className="text-secondary-600 mb-4">
              JobConnect is tested with popular screen readers including JAWS, NVDA, and VoiceOver. We support modern browsers used by people with disabilities.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Report Accessibility Issues</h3>
            <p className="text-secondary-600 mb-4">
              If you encounter accessibility barriers while using JobConnect, please let us know. We will work with you to provide the information you need.
            </p>
            <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4">
              <p className="text-sm text-secondary-600">
                Email: accessibility@jobconnect.com
                <br />
                Phone: (555) 123-4567
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Accessibility Statement</h3>
            <p className="text-secondary-600">
              We continually strive to improve accessibility and welcome feedback about barriers you experience while using our site. This statement was last updated in 2024.
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-secondary-600 hover:text-secondary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
