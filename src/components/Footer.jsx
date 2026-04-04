import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto bg-secondary-900 text-secondary-100 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top band */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-secondary-700 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-xs font-bold text-secondary-900 shadow-sm">
              JC
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">JobConnect</h3>
              <p className="text-sm text-secondary-300 mt-1">
                A modern hiring platform for ambitious teams and talent.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <p className="text-sm text-secondary-200">
              Ready to post your next role or find your next move?
            </p>
            <div className="flex gap-2">
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition hover:text-white"
              >
                Get Started
              </Link>
              <Link
                to="/contact-us"
                className="px-4 py-2 rounded-full border border-secondary-600 text-sm font-semibold text-secondary-100 hover:bg-secondary-700 transition hover:text-white"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-secondary-300 hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-secondary-300 hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/mobile" className="text-secondary-300 hover:text-white transition">
                  Mobile App
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-secondary-300 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/talent-solutions" className="text-secondary-300 hover:text-white transition">
                  Talent Solutions
                </Link>
              </li>
              <li>
                <Link to="/sales-solutions" className="text-secondary-300 hover:text-white transition">
                  Sales Solutions
                </Link>
              </li>
              <li>
                <Link to="/marketing-solutions" className="text-secondary-300 hover:text-white transition">
                  Marketing Solutions
                </Link>
              </li>
              <li>
                <Link to="/small-business" className="text-secondary-300 hover:text-white transition">
                  Small Business
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/professional-community" className="text-secondary-300 hover:text-white transition">
                  Professional Community
                </Link>
              </li>
              <li>
                <Link to="/policies" className="text-secondary-300 hover:text-white transition">
                  Community Policies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-secondary-300 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-secondary-300 hover:text-white transition">
                  Events & Webinars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" className="text-secondary-300 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-secondary-300 hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-secondary-300 hover:text-white transition">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/safety-center" className="text-secondary-300 hover:text-white transition">
                  Safety Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-secondary-300 hover:text-white transition">
                  Privacy & Terms
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-secondary-300 hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/ad-choices" className="text-secondary-300 hover:text-white transition">
                  Ad Choices
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-secondary-300 hover:text-white transition">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-secondary-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-secondary-300">
            &copy; 2025 JobConnect. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/privacy" className="text-secondary-300 hover:text-white transition">
              Privacy
            </Link>
            <Link to="/terms-and-conditions" className="text-secondary-300 hover:text-white transition">
              Terms
            </Link>
            <Link to="/accessibility" className="text-secondary-300 hover:text-white transition">
              Accessibility
            </Link>
            <Link to="/ad-choices" className="text-secondary-300 hover:text-white transition">
              Cookie Preferences
            </Link>
            <Link to="/careers" className="text-secondary-300 hover:text-white transition">
              Careers
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
