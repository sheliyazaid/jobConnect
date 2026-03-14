import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      avatar: "👩‍💻",
      stars: 5,
      text: "JobConnect helped me find the perfect job within 2 weeks! The job matching algorithm is incredibly accurate."
    },
    {
      name: "Michael Garcia",
      role: "HR Manager",
      company: "Global Industries",
      avatar: "👨‍💼",
      stars: 5,
      text: "We've hired 15 great employees through JobConnect. The platform is user-friendly and the candidates are qualified."
    },
    {
      name: "Priya Sharma",
      role: "Marketing Manager",
      company: "StartupXYZ",
      avatar: "👩‍🎨",
      text: "As a startup, we found JobConnect affordable and effective. Great customer support too!",
      stars: 5
    },
    {
      name: "James Wilson",
      role: "Frontend Developer",
      company: "AgencyWorks",
      avatar: "👨‍💻",
      stars: 5,
      text: "The best job portal I've used. Easy to navigate, tons of opportunities, and no spam messages!"
    },
    {
      name: "Neha Patel",
      role: "Recruiter",
      company: "Talent Solutions Inc",
      avatar: "👩‍💼",
      stars: 5,
      text: "JobConnect's screening tools save us hours every week. Highly recommend to any hiring team."
    },
    {
      name: "David Lee",
      role: "Data Scientist",
      company: "Analytics Pro",
      avatar: "👨‍🔬",
      stars: 5,
      text: "Found a job that perfectly matches my data science skills. The matching algorithm really works!"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4 text-center">Success Stories</h1>
        <p className="text-xl text-secondary-700 mb-12 text-center max-w-3xl mx-auto">
          Hear from job seekers and companies who found success with JobConnect.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-secondary-100 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{testimonial.avatar}</span>
                <div>
                  <h3 className="font-semibold text-secondary-900">{testimonial.name}</h3>
                  <p className="text-sm text-secondary-600">{testimonial.role}</p>
                  <p className="text-xs text-secondary-500">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-secondary-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-secondary-900 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">500K+</div>
            <p className="text-secondary-200">Jobs Posted</p>
          </div>
          <div className="bg-secondary-900 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">2M+</div>
            <p className="text-secondary-200">Active Users</p>
          </div>
          <div className="bg-secondary-900 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <p className="text-secondary-200">Hires Made</p>
          </div>
          <div className="bg-secondary-900 text-white rounded-lg p-8 text-center">
            <div className="text-4xl font-bold mb-2">150+</div>
            <p className="text-secondary-200">Countries</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-100 rounded-lg p-12 text-center border-l-4 border-secondary-600">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-secondary-700 mb-6">Join thousands of successful job seekers and companies on JobConnect.</p>
          <Link to="/register" className="bg-secondary-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-800 transition inline-block">
            Get Started Today
          </Link>
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

export default Testimonials;
