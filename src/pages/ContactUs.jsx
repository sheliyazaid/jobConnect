import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4 text-center">Contact Us</h1>
        <p className="text-xl text-secondary-700 mb-12 text-center max-w-3xl mx-auto">
          Have a question, feedback, or partnership idea? Our team would love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-secondary-100">
            <div className="flex items-center gap-4 mb-6">
              <Mail className="text-secondary-600" size={28} />
              <div>
                <h3 className="font-semibold text-secondary-900">Email</h3>
                <p className="text-secondary-700">support@jobconnect.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Phone className="text-secondary-600" size={28} />
              <div>
                <h3 className="font-semibold text-secondary-900">Phone</h3>
                <p className="text-secondary-700">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="text-secondary-600" size={28} />
              <div>
                <h3 className="font-semibold text-secondary-900">Address</h3>
                <p className="text-secondary-700">123 Job Street, Tech City, TC 12345</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="text-secondary-600" size={28} />
              <div>
                <h3 className="font-semibold text-secondary-900">Hours</h3>
                <p className="text-secondary-700">Mon-Fri: 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-lg p-8 shadow-sm border border-secondary-100">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-600"
                  placeholder="Your name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-600"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-600"
                    placeholder="Subject"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">Message</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-600"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-secondary-900 text-white py-3 rounded-lg font-semibold hover:bg-secondary-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Departments */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-secondary-100">
            <h3 className="font-semibold text-secondary-900 mb-2">📧 General Inquiries</h3>
            <p className="text-sm text-secondary-700 mb-3">info@jobconnect.com</p>
            <Link to="#" className="text-secondary-600 text-sm font-semibold hover:text-secondary-800">
              Send Email →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 border border-secondary-100">
            <h3 className="font-semibold text-secondary-900 mb-2">💼 Sales</h3>
            <p className="text-sm text-secondary-700 mb-3">sales@jobconnect.com</p>
            <Link to="#" className="text-secondary-600 text-sm font-semibold hover:text-secondary-800">
              Send Email →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 border border-secondary-100">
            <h3 className="font-semibold text-secondary-900 mb-2">🛡️ Support</h3>
            <p className="text-sm text-secondary-700 mb-3">support@jobconnect.com</p>
            <Link to="#" className="text-secondary-600 text-sm font-semibold hover:text-secondary-800">
              Send Email →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 border border-secondary-100">
            <h3 className="font-semibold text-secondary-900 mb-2">👨‍💼 Careers</h3>
            <p className="text-sm text-secondary-700 mb-3">careers@jobconnect.com</p>
            <Link to="/careers" className="text-secondary-600 text-sm font-semibold hover:text-secondary-800">
              View Jobs →
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <Link to="/" className="text-secondary-600 hover:text-secondary-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
