import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        { q: "How do I create an account?", a: "Click the Register button and fill out the form with your information. Choose whether you're a job seeker or company." },
        { q: "Is JobConnect free?", a: "Yes, for job seekers. Companies have paid plans starting at $49 per job posting." },
        { q: "How do I verify my email?", a: "After registration, check your email for a verification link. Click it to activate your account." }
      ]
    },
    {
      category: "Job Search",
      questions: [
        { q: "How do I search for jobs?", a: "Use the search bar and filters to narrow down job listings by location, salary, job type, and skills." },
        { q: "Can I save jobs?", a: "Yes! Click the save button on any job to add it to your saved jobs list." },
        { q: "How often are jobs updated?", a: "New jobs are posted daily. Check back regularly or set up job alerts." }
      ]
    },
    {
      category: "Applying",
      questions: [
        { q: "How do I apply for a job?", a: "Click the Apply button on any job posting. You can apply with your profile or upload a resume." },
        { q: "Can I track my applications?", a: "Yes, visit the Applied Jobs section to see all your applications and their status." },
        { q: "Can I withdraw an application?", a: "Yes, you can withdraw at any time from your applications page." }
      ]
    },
    {
      category: "For Companies",
      questions: [
        { q: "How do I post a job?", a: "Go to Post Job section, fill in the job details, and publish. Your job will appear immediately." },
        { q: "How long does a job posting stay active?", a: "Job postings are active for 60 days from the date of publishing." },
        { q: "Can I edit my job posting?", a: "Yes, you can edit job details anytime from the Manage Jobs section." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-lg text-secondary-700 mb-12 text-center">Find answers to common questions about JobConnect.</p>

        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.questions.map((item, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-white border border-secondary-100 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpanded(expanded === `${idx}-${qIdx}` ? null : `${idx}-${qIdx}`)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary-50 transition"
                    >
                      <span className="font-semibold text-secondary-900">{item.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-secondary-600 transition ${
                          expanded === `${idx}-${qIdx}` ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expanded === `${idx}-${qIdx}` && (
                      <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-100">
                        <p className="text-secondary-700">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary-900 text-white rounded-lg p-12 text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Didn't find your answer?</h2>
          <p className="text-secondary-100 mb-6">Our support team is here to help you 24/7.</p>
          <Link to="/contact-us" className="bg-white text-secondary-900 px-6 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition inline-block">
            Contact Support
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

export default FAQ;
