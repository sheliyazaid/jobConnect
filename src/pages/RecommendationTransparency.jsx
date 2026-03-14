import { Link } from 'react-router-dom';

const RecommendationTransparency = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-8">Recommendation Transparency</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">How We Recommend Jobs & Candidates</h2>
            <p className="text-secondary-600 mb-4">
              At JobConnect, we use AI and machine learning to provide relevant recommendations. We believe you should understand how these recommendations are created and how we protect your data.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Our Recommendation Algorithm</h3>
            <p className="text-secondary-600 mb-4">
              Our algorithm analyzes multiple factors to provide personalized job recommendations:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2 mb-4">
              <li><strong>Skills Match:</strong> Comparing your skills to job requirements (40% weight)</li>
              <li><strong>Experience Level:</strong> Matching your years of experience (30% weight)</li>
              <li><strong>Location Preference:</strong> Considering geographic preferences (15% weight)</li>
              <li><strong>Education Background:</strong> Matching educational qualifications (15% weight)</li>
              <li>Job application history and saved jobs</li>
              <li>Career trajectory and growth opportunities</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Data Used for Recommendations</h3>
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="font-semibold text-secondary-800 mb-3">Information We Use:</h4>
              <ul className="list-disc pl-6 text-secondary-600 space-y-2">
                <li>Profile information (skills, experience, education)</li>
                <li>Job search and browsing history</li>
                <li>Application and job preference data</li>
                <li>Location and visa status</li>
                <li>Saved and liked jobs</li>
                <li>Messages and communications (anonymized)</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">How to Control Recommendations</h3>
            <p className="text-secondary-600 mb-4">
              You have full control over how we recommend jobs and candidates to you:
            </p>
            <div className="space-y-3 bg-secondary-50 p-4 rounded-lg">
              <div>
                <p className="font-semibold text-secondary-800 mb-1">Update Your Profile</p>
                <p className="text-sm text-secondary-600">Keep your skills, experience, and preferences current for better recommendations</p>
              </div>
              <div>
                <p className="font-semibold text-secondary-800 mb-1">Adjust Search Filters</p>
                <p className="text-sm text-secondary-600">Use location, salary, job type, and experience filters to refine recommendations</p>
              </div>
              <div>
                <p className="font-semibold text-secondary-800 mb-1">Provide Feedback</p>
                <p className="text-sm text-secondary-600">Tell us if recommendations are relevant or not so we can improve</p>
              </div>
              <div>
                <p className="font-semibold text-secondary-800 mb-1">Opt Out</p>
                <p className="text-sm text-secondary-600">You can opt out of personalized recommendations in settings</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">For Employers & Recruiters</h3>
            <p className="text-secondary-600 mb-4">
              We also provide AI-powered candidate recommendations based on:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Job requirements and description</li>
              <li>Candidate skills and experience</li>
              <li>Historical hiring data</li>
              <li>Successful candidate profiles</li>
              <li>Application patterns</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Transparency & Fairness</h3>
            <p className="text-secondary-600 mb-4">
              We are committed to transparency and fairness in our recommendations:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2 mb-4">
              <li>No recommendations based on protected characteristics (race, gender, age, religion)</li>
              <li>Regular audits for bias and discrimination</li>
              <li>Explainable recommendations - you can see why something was recommended</li>
              <li>Human review of algorithmic decisions</li>
              <li>Compliance with employment and data protection laws</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Privacy & Data Protection</h3>
            <p className="text-secondary-600 mb-4">
              Your data privacy is paramount in our recommendation system:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Data encryption in transit and at rest</li>
              <li>Limited access to personal data</li>
              <li>Regular security audits</li>
              <li>GDPR and CCPA compliance</li>
              <li>No selling of personal data to third parties</li>
              <li>Data retention policies limit storage</li>
            </ul>
          </section>

          <section className="bg-secondary-100 border-l-4 border-secondary-600 p-4">
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Questions or Concerns?</h3>
            <p className="text-sm text-secondary-600 mb-3">
              We take recommendation transparency seriously. If you have questions or concerns:
            </p>
            <p className="text-sm text-secondary-600">
              Email: transparency@jobconnect.com
              <br />
              Subject: "Recommendation Transparency Question"
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Learn More</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-secondary-600 hover:underline">
                  Read our Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/ad-choices" className="text-secondary-600 hover:underline">
                  Manage Your Privacy Choices
                </Link>
              </li>
            </ul>
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

export default RecommendationTransparency;
