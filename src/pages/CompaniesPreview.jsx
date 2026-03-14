import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const CompaniesPreview = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'company'), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const companiesList = [];
        querySnapshot.forEach((doc) => {
          companiesList.push({ id: doc.id, ...doc.data() });
        });
        setCompanies(companiesList);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-3">
              Companies on JobConnect
            </h1>
            <p className="text-secondary-700 text-base md:text-lg max-w-2xl">
              Explore verified employers that are actively hiring and building strong teams.
            </p>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="bg-white rounded-xl border border-secondary-200 py-16 px-6 text-center">
            <p className="text-secondary-700 text-lg mb-2">No companies available right now.</p>
            <p className="text-secondary-500 text-sm">
              Check back soon as new employers join the platform.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white border border-secondary-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-secondary-900 transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.companyName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-secondary-900">
                        {company.companyName?.charAt(0) || 'C'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {company.companyName}
                    </h3>
                    {company.industryType && (
                      <p className="text-xs font-medium text-secondary-600 mt-1">
                        {company.industryType}
                      </p>
                    )}
                    {company.companySize && (
                      <p className="text-xs text-secondary-500 mt-0.5">
                        {company.companySize} employees
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                  {company.companyDescription || 'A verified employer building their team with JobConnect.'}
                </p>

                <div className="flex items-center justify-between text-xs text-secondary-500 mt-auto pt-3 border-t border-secondary-100">
                  <div>
                    <p>{company.city && company.country ? `${company.city}, ${company.country}` : (company.location || 'Location not specified')}</p>
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary-900 font-semibold hover:text-secondary-700"
                    >
                      Visit website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPreview;

