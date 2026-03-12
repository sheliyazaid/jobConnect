import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CheckCircle, XCircle, Eye, Edit2, Trash2, X } from 'lucide-react';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'company'));
        const querySnapshot = await getDocs(q);
        const companiesList = [];

        // Get active jobs count for each company
        const jobsRef = collection(db, 'jobs');
        for (const userDoc of querySnapshot.docs) {
          const company = userDoc.data();
          const jobsQuery = query(jobsRef, where('companyId', '==', userDoc.id), where('status', '==', 'active'));
          const jobsSnap = await getDocs(jobsQuery);

          companiesList.push({
            id: userDoc.id,
            ...company,
            activeJobs: jobsSnap.size,
          });
        }

        setCompanies(companiesList);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', companyId), {
        status: newStatus,
      });
      setCompanies(companies.map(company =>
        company.id === companyId ? { ...company, status: newStatus } : company
      ));
      if (selectedCompany?.id === companyId) {
        setSelectedCompany({ ...selectedCompany, status: newStatus });
      }
      alert('Company status updated successfully!');
    } catch (error) {
      console.error('Error updating company status:', error);
      alert('Failed to update company status');
    }
  };

  const filteredCompanies = filter === 'all'
    ? companies
    : companies.filter(company => company.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900">Company Management</h1>
        <p className="text-secondary-700 mt-2">Manage registered companies and their status</p>
      </div>

      {/* Filter Buttons */}
      <div className="card bg-white mb-6">
        <label className="block text-sm font-bold text-secondary-900 mb-3">Filter by Status:</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'All Companies', color: 'bg-secondary-100' },
            { value: 'approved', label: 'Approved', color: 'bg-green-100' },
            { value: 'pending', label: 'Pending', color: 'bg-yellow-100' },
            { value: 'rejected', label: 'Rejected', color: 'bg-red-100' },
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === btn.value
                  ? `${btn.color} text-secondary-900 ring-2 ring-secondary-900`
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredCompanies.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <p className="text-secondary-700 text-lg">No companies found.</p>
        </div>
      ) : (
        <div className="card bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Contact Person</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Active Jobs</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr
                  key={company.id}
                  className={`border-b border-secondary-100 hover:bg-secondary-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-secondary-900">{company.companyName}</p>
                      <p className="text-xs text-secondary-500 mt-1">{company.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-secondary-900 font-medium">{company.contactPerson}</p>
                      <p className="text-xs text-secondary-500">{company.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      company.status === 'approved' ? 'bg-green-100 text-green-800' :
                      company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-secondary-900 font-semibold">{company.activeJobs}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700 transition text-xs"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {company.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(company.id, 'approved')}
                          className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition font-medium text-xs"
                          title="Approve"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {company.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(company.id, 'rejected')}
                          className="flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition font-medium text-xs"
                          title="Reject"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-secondary-100 p-6">
              <h2 className="text-2xl font-bold text-secondary-900">Company Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-secondary-400 hover:text-secondary-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Company Name</p>
                  <p className="text-secondary-900 font-semibold">{selectedCompany.companyName}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                    selectedCompany.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedCompany.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedCompany.status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Contact Person</p>
                  <p className="text-secondary-900 font-semibold">{selectedCompany.contactPerson}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Email</p>
                  <p className="text-secondary-900">{selectedCompany.email}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Phone</p>
                  <p className="text-secondary-900">{selectedCompany.phone}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Location</p>
                  <p className="text-secondary-900">{selectedCompany.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-secondary-600 text-sm font-medium">About Company</p>
                  <p className="text-secondary-700">{selectedCompany.companyDescription || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Registration Number</p>
                  <p className="text-secondary-900">{selectedCompany.companyRegistrationNumber}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Active Jobs</p>
                  <p className="text-secondary-900 font-semibold">{selectedCompany.activeJobs}</p>
                </div>
              </div>

              {selectedCompany.companyDescription && (
                <div className="bg-primary-100 p-4 rounded-lg border border-primary-200">
                  <p className="text-secondary-700"><strong>Bank Details:</strong></p>
                  <p className="text-secondary-700 text-sm mt-2">
                    Account: {selectedCompany.bankAccountName}<br/>
                    Bank: {selectedCompany.bankName}<br/>
                    IFSC: {selectedCompany.ifscCode}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-secondary-100 p-6 flex gap-3">
              {selectedCompany.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedCompany.id, 'approved');
                    setShowModal(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
              )}
              {selectedCompany.status !== 'rejected' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedCompany.id, 'rejected');
                    setShowModal(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center justify-center gap-2 bg-secondary-100 text-secondary-900 px-4 py-2 rounded-lg hover:bg-secondary-200 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCompanies;
