import { Link } from 'react-router-dom';

const CommunityPolicies = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-8">Community Policies</h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">Our Community Standards</h2>
            <p className="text-secondary-600 mb-4">
              JobConnect is committed to creating a safe, respectful, and professional community for all members. These policies outline the standards we expect from our community members.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Code of Conduct</h3>
            <div className="space-y-3 text-secondary-600">
              <p><strong>Be Professional:</strong> Interact with others in a respectful and professional manner. Avoid offensive language or behavior.</p>
              <p><strong>No Harassment:</strong> We do not tolerate harassment, bullying, or discrimination based on race, gender, religion, or other protected characteristics.</p>
              <p><strong>No Spam:</strong> Do not post spam, advertisements, or promotional content unrelated to legitimate job opportunities.</p>
              <p><strong>No Fraud:</strong> Do not misrepresent yourself, post false information, or engage in fraudulent activities.</p>
              <p><strong>Respect Privacy:</strong> Do not share others' personal information without consent. Respect privacy and confidentiality.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Content Guidelines</h3>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2 mb-4">
              <li>No hate speech or violent content</li>
              <li>No adult or explicit content</li>
              <li>No copyrighted material without permission</li>
              <li>No links to malicious websites</li>
              <li>No personal contact information in public posts</li>
              <li>Keep content relevant to employment and career</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Enforcement</h3>
            <p className="text-secondary-600 mb-4">
              Violations of these policies may result in:
            </p>
            <ul className="list-disc pl-6 text-secondary-600 space-y-2">
              <li>Warning or suspension of account</li>
              <li>Removal of content</li>
              <li>Permanent ban from the community</li>
              <li>Referral to law enforcement if applicable</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Reporting Violations</h3>
            <p className="text-secondary-600 mb-4">
              If you encounter content or behavior that violates these policies, please report it to our moderation team.
            </p>
            <div className="bg-secondary-100 border-l-4 border-secondary-600 p-4">
              <p className="text-sm text-secondary-600">
                Email: community@jobconnect.com
                <br />
                Use the "Report" button on any post or profile
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Appeals</h3>
            <p className="text-secondary-600">
              If you believe your account was suspended in error, you can appeal the decision within 30 days. Submit your appeal with details to community@jobconnect.com.
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

export default CommunityPolicies;
