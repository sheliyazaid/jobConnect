import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CheckCircle, XCircle, Eye, FileText, X } from 'lucide-react';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'employee'));
        const querySnapshot = await getDocs(q);
        const employeesList = [];

        // Get application count for each employee
        const appRef = collection(db, 'applications');
        for (const userDoc of querySnapshot.docs) {
          const employee = userDoc.data();
          const appQuery = query(appRef, where('employeeId', '==', userDoc.id));
          const appSnap = await getDocs(appQuery);

          employeesList.push({
            id: userDoc.id,
            ...employee,
            totalApplications: appSnap.size,
          });
        }

        setEmployees(employeesList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', employeeId), {
        status: newStatus,
      });
      setEmployees(employees.map(emp =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      ));
      if (selectedEmployee?.id === employeeId) {
        setSelectedEmployee({ ...selectedEmployee, status: newStatus });
      }
      alert('Employee status updated successfully!');
    } catch (error) {
      console.error('Error updating employee status:', error);
      alert('Failed to update employee status');
    }
  };

  const filteredEmployees = filter === 'all'
    ? employees
    : employees.filter(emp => emp.status === filter);

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
        <h1 className="text-4xl font-bold text-secondary-900">Employee Management</h1>
        <p className="text-secondary-700 mt-2">Manage job seekers and their profiles</p>
      </div>

      {/* Filter Buttons */}
      <div className="card bg-white mb-6">
        <label className="block text-sm font-bold text-secondary-900 mb-3">Filter by Status:</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'All Employees', color: 'bg-secondary-100' },
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
      {filteredEmployees.length === 0 ? (
        <div className="card bg-white p-12 text-center">
          <p className="text-secondary-700 text-lg">No employees found.</p>
        </div>
      ) : (
        <div className="card bg-white overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Profession</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Applications</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`border-b border-secondary-100 hover:bg-secondary-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-secondary-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-secondary-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-secondary-700">{employee.profession || 'Not specified'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-secondary-900">{employee.email}</p>
                      <p className="text-xs text-secondary-500">{employee.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      employee.status === 'approved' ? 'bg-green-100 text-green-800' :
                      employee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-secondary-900 font-semibold">{employee.totalApplications}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700 transition text-xs"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {employee.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(employee.id, 'approved')}
                          className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition font-medium text-xs"
                          title="Approve"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {employee.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(employee.id, 'rejected')}
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
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-secondary-100 p-6">
              <h2 className="text-2xl font-bold text-secondary-900">Employee Details</h2>
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
                  <p className="text-secondary-600 text-sm font-medium">Full Name</p>
                  <p className="text-secondary-900 font-semibold">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                    selectedEmployee.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedEmployee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedEmployee.status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Email</p>
                  <p className="text-secondary-900">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Phone</p>
                  <p className="text-secondary-900">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Profession</p>
                  <p className="text-secondary-900">{selectedEmployee.profession || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Experience</p>
                  <p className="text-secondary-900">{selectedEmployee.experience || '0'} years</p>
                </div>
                <div className="col-span-2">
                  <p className="text-secondary-600 text-sm font-medium">Bio</p>
                  <p className="text-secondary-700">{selectedEmployee.bio || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-secondary-600 text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills?.map((skill, idx) => (
                      <span key={idx} className="bg-accent-100 text-accent-900 text-xs px-3 py-1 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Total Applications</p>
                  <p className="text-secondary-900 font-semibold">{selectedEmployee.totalApplications}</p>
                </div>
                <div>
                  <p className="text-secondary-600 text-sm font-medium">Registered Date</p>
                  <p className="text-secondary-900">
                    {new Date(selectedEmployee.createdAt?.toDate?.() || selectedEmployee.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-secondary-100 p-6 flex gap-3">
              {selectedEmployee.resume && (
                <a
                  href={selectedEmployee.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <FileText size={18} />
                  View Resume
                </a>
              )}
              {selectedEmployee.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedEmployee.id, 'approved');
                    setShowModal(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
              )}
              {selectedEmployee.status !== 'rejected' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedEmployee.id, 'rejected');
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

export default ManageEmployees;
