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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partner Companies</h1>
        <p className="text-gray-600">
          Discover the verified companies actively hiring on JobConnect
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No companies available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.companyName}
                  className="w-16 h-16 object-contain mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {company.companyName}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {company.companyDescription || 'A verified company on JobConnect'}
              </p>
              <div className="text-sm text-gray-500">
                <p>{company.location || 'Location not specified'}</p>
                <p>{company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Visit Website</a>}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPreview;

