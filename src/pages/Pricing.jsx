import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing = () => {
  const employeePlans = [
    {
      title: "Student",
      price: "Free",
      description: "Perfect for students starting their career",
      features: [
        "Browse unlimited jobs",
        "Apply to jobs",
        "Build profile and resume",
        "Save jobs for later",
        "Basic job recommendations",
        "Email notifications"
      ]
    },
    {
      title: "Professional",
      price: "Free",
      description: "All you need to find your dream job",
      features: [
        "Everything in Student plan",
        "Enhanced profile visibility",
        "Priority support",
        "Skill endorsements",
        "Advanced job matching",
        "Interview tips & resources",
        "Career coaching resources"
      ],
      popular: true
    }
  ];

  const companyPlans = [
    {
      title: "Starter",
      price: "$49",
      period: "per job",
      description: "Perfect for first-time posters",
      features: [
        "Post 1 job for 30 days",
        "Up to 50 applications",
        "Basic screening tools",
        "Email notifications",
        "Job analytics",
        "Company profile"
      ]
    },
    {
      title: "Professional",
      price: "$199",
      period: "per month",
      description: "For growing teams",
      features: [
        "Post up to 5 concurrent jobs",
        "Unlimited applications",
        "Advanced screening tools",
        "Video interview feature",
        "Interview scheduling",
        "Priority support",
        "Detailed analytics",
        "Team collaboration tools",
        "Company branding options"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For large-scale hiring",
      features: [
        "Unlimited job postings",
        "Unlimited applications",
        "Full API access",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
        "Advanced analytics",
        "Bulk hiring tools",
        "White-label options"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4 text-center">Simple, Transparent Pricing</h1>
        <p className="text-xl text-secondary-700 mb-12 text-center max-w-3xl mx-auto">
          Choose the perfect plan for your needs. No hidden fees, cancel anytime.
        </p>

        {/* Job Seekers Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">👨‍💼 For Job Seekers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {employeePlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-8 transition ${
                  plan.popular
                    ? 'bg-secondary-900 text-white shadow-xl transform md:scale-105'
                    : 'bg-white border border-secondary-200 text-secondary-900'
                }`}
              >
                <div className="mb-4">
                  <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-secondary-900'}`}>
                    {plan.title}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-secondary-200' : 'text-secondary-600'} mt-2`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-secondary-900'}`}>
                    {plan.price}
                  </span>
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-secondary-300' : 'text-secondary-600'}`}>
                    {plan.period || 'forever'}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className={plan.popular ? 'text-secondary-200' : 'text-secondary-600'} />
                      <span className={plan.popular ? 'text-secondary-100' : 'text-secondary-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                    plan.popular
                      ? 'bg-white text-secondary-900 hover:bg-secondary-50'
                      : 'bg-secondary-900 text-white hover:bg-secondary-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Companies Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">🏢 For Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {companyPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-8 transition relative ${
                  plan.popular
                    ? 'bg-secondary-900 text-white shadow-xl transform md:scale-105'
                    : 'bg-white border border-secondary-200 text-secondary-900'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-secondary-900'}`}>
                    {plan.title}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-secondary-200' : 'text-secondary-600'} mt-2`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-secondary-900'}`}>
                    {plan.price}
                  </span>
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-secondary-300' : 'text-secondary-600'}`}>
                    {plan.period}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className={plan.popular ? 'text-secondary-200' : 'text-secondary-600'} />
                      <span className={plan.popular ? 'text-secondary-100' : 'text-secondary-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                    plan.popular
                      ? 'bg-white text-secondary-900 hover:bg-secondary-50'
                      : 'bg-secondary-900 text-white hover:bg-secondary-800'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-12 border border-secondary-100 mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-secondary-700">Yes! There are no long-term contracts. Cancel your subscription anytime from your account settings.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Do you offer refunds?</h4>
              <p className="text-secondary-700">We offer a 7-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-secondary-700">Yes! You can change your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-secondary-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-secondary-700">We accept credit cards, debit cards, and bank transfers. All payments are secure and encrypted.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-900 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-secondary-100 mb-8">Join thousands of successful job seekers and companies on JobConnect.</p>
          <Link to="/register" className="bg-white text-secondary-900 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-50 transition inline-block">
            Sign Up Now
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

export default Pricing;
