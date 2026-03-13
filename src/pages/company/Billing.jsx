import { useState } from 'react';
import { CreditCard, Receipt, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CompanyBilling = () => {
  const { userData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'Free',
      description: 'Post up to 2 active jobs with standard visibility.',
      features: ['2 active job postings', 'Standard listing placement', 'Basic applicant tracking'],
      highlighted: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '₹999 / month',
      description: 'Ideal for growing teams with regular hiring needs.',
      features: [
        '10 active job postings',
        'Priority listing placement',
        'Advanced applicant filters',
        'Basic email support',
      ],
      highlighted: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹2,499 / month',
      description: 'Maximum visibility and tools for high-volume hiring.',
      features: [
        'Unlimited active job postings',
        'Top-of-list visibility',
        'Team collaboration tools',
        'Dedicated account support',
      ],
      highlighted: false,
    },
  ];

  // Static demo transactions – replace with Firestore-backed history later if needed
  const transactions = [
    {
      id: 'INV-2026-001',
      date: '12 Mar 2026',
      plan: 'Standard Plan',
      amount: '₹999',
      status: 'paid',
    },
    {
      id: 'INV-2026-002',
      date: '12 Feb 2026',
      plan: 'Standard Plan',
      amount: '₹999',
      status: 'paid',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
          <CreditCard size={40} />
          Billing & Subscription
        </h1>
        <p className="text-secondary-700 mt-2">
          Manage your job posting plans, invoices and payment details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white lg:col-span-2">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left p-4 rounded-xl border-2 transition flex flex-col justify-between h-full ${
                  selectedPlan === plan.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-400 bg-white'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500 mb-1">
                    {plan.name}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 mb-1">{plan.price}</p>
                  <p className="text-secondary-600 text-sm mb-3">{plan.description}</p>
                  <ul className="space-y-1 text-xs text-secondary-700">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-1">
                        <CheckCircle size={12} className="text-primary-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.highlighted && (
                  <span className="inline-block mt-3 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full w-max">
                    Recommended
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="card bg-white">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Current Status</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-secondary-600 font-medium">Company</p>
              <p className="text-secondary-900 font-semibold">
                {userData?.companyName || 'Your Company'}
              </p>
            </div>
            <div>
              <p className="text-secondary-600 font-medium">Active Plan</p>
              <p className="text-secondary-900 font-semibold">Standard (Demo)</p>
            </div>
            <div className="flex items-center gap-2 text-secondary-700">
              <Clock size={16} className="text-primary-600" />
              <span>Renews automatically every month</span>
            </div>
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-2 text-xs">
              <CheckCircle size={16} className="text-green-600 mt-0.5" />
              <p className="text-green-800">
                Billing is currently in demo mode. Connect a real payment gateway to enable
                production subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
            <Receipt size={22} />
            Payment History
          </h2>
          <span className="text-xs text-secondary-500">
            Showing recent invoices (demo data)
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="flex items-center gap-2 text-secondary-600 text-sm">
            <AlertCircle size={16} className="text-secondary-500" />
            <span>No payments found yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="px-4 py-3 text-left font-semibold text-secondary-900">Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary-900">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary-900">Plan</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary-900">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-secondary-100 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-secondary-900">{tx.id}</td>
                    <td className="px-4 py-3 text-secondary-700">{tx.date}</td>
                    <td className="px-4 py-3 text-secondary-700">{tx.plan}</td>
                    <td className="px-4 py-3 text-secondary-900 font-semibold">{tx.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs font-semibold text-primary-700 hover:text-primary-900">
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyBilling;


