import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: "Virtual Career Expo 2024",
      date: "March 20, 2024",
      time: "10:00 AM - 4:00 PM EST",
      type: "Virtual Event",
      speakers: 20,
      attendees: 2000,
      description: "Meet 50+ companies and land your dream job. Live recruiting events all day long.",
      icon: "🎯"
    },
    {
      title: "Interview Mastery Webinar",
      date: "March 22, 2024",
      time: "2:00 PM - 3:30 PM EST",
      type: "Webinar",
      speakers: 3,
      attendees: 500,
      description: "Learn from hiring managers how to ace your interviews and negotiate offers.",
      icon: "🎓"
    },
    {
      title: "Remote Work Panel Discussion",
      date: "March 25, 2024",
      time: "1:00 PM - 2:00 PM EST",
      type: "Panel Discussion",
      speakers: 5,
      attendees: 300,
      description: "Experts discuss the future of remote work and how to succeed working from home.",
      icon: "🌍"
    },
    {
      title: "Salary Negotiation Workshop",
      date: "March 28, 2024",
      time: "3:00 PM - 4:30 PM EST",
      type: "Workshop",
      speakers: 2,
      attendees: 400,
      description: "Professional salary negotiators share insider tips on getting the best compensation.",
      icon: "💰"
    },
    {
      title: "Tech Careers in 2024",
      date: "April 1, 2024",
      time: "11:00 AM - 12:00 PM EST",
      type: "Webinar",
      speakers: 4,
      attendees: 600,
      description: "Explore in-demand tech skills and career paths for 2024 and beyond.",
      icon: "💻"
    },
    {
      title: "Diversity & Inclusion in Tech",
      date: "April 5, 2024",
      time: "2:00 PM - 3:30 PM EST",
      type: "Panel Discussion",
      speakers: 6,
      attendees: 800,
      description: "Leading companies share their D&I initiatives and how to create inclusive teams.",
      icon: "🤝"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">Events & Webinars</h1>
        <p className="text-xl text-secondary-700 mb-12 max-w-3xl">
          Join our community events, webinars, and workshops to learn from industry experts and network with professionals.
        </p>

        {/* Filters */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <button className="px-4 py-2 rounded-lg bg-secondary-900 text-white font-medium hover:bg-secondary-800">
            All Events
          </button>
          <button className="px-4 py-2 rounded-lg bg-white text-secondary-900 border border-secondary-200 font-medium hover:bg-secondary-50">
            Webinars
          </button>
          <button className="px-4 py-2 rounded-lg bg-white text-secondary-900 border border-secondary-200 font-medium hover:bg-secondary-50">
            Workshops
          </button>
          <button className="px-4 py-2 rounded-lg bg-white text-secondary-900 border border-secondary-200 font-medium hover:bg-secondary-50">
            Networking
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center text-5xl">
                {event.icon}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full">
                    {event.type}
                  </span>
                  <span className="text-xs text-secondary-500 font-medium">#REG NOW</span>
                </div>

                <h3 className="text-lg font-bold text-secondary-900 mb-3">{event.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-secondary-700">
                    <Calendar size={16} className="text-secondary-600" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-700">
                    <Clock size={16} className="text-secondary-600" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-700">
                    <Users size={16} className="text-secondary-600" />
                    {event.speakers} speakers, {event.attendees.toLocaleString()} attending
                  </div>
                </div>

                <p className="text-secondary-700 text-sm mb-4">{event.description}</p>

                <button className="w-full bg-secondary-900 text-white py-2 rounded-lg font-semibold hover:bg-secondary-800 transition flex items-center justify-center gap-2">
                  Register Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-secondary-900 text-white rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Never Miss an Event</h2>
          <p className="text-secondary-100 mb-6">Subscribe to our newsletter to get event invitations delivered to your inbox.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none"
            />
            <button className="bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition">
              Subscribe
            </button>
          </div>
          <p className="text-secondary-300 text-xs mt-3">We respect your privacy. Unsubscribe at any time.</p>
        </div>

        {/* FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-lg p-8 border border-secondary-100">
            <h3 className="font-bold text-secondary-900 mb-3">🎯 Are events free?</h3>
            <p className="text-secondary-700">Most events are free for registered members. Premium workshops may have a small fee.</p>
          </div>
          <div className="bg-white rounded-lg p-8 border border-secondary-100">
            <h3 className="font-bold text-secondary-900 mb-3">📹 Can I watch recordings?</h3>
            <p className="text-secondary-700">Yes! Webinar recordings are available for registered members for 30 days after the event.</p>
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

export default Events;
