import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Save, X, Edit2, Mail, Phone, MapPin, Globe, Building2, FileText, DollarSign, Award, Users } from 'lucide-react';

const CompanyProfile = () => {
  const { currentUser, userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Basic
    designation: '',
    companyName: '',
    companyLegalName: '',
    email: '',
    phone: '',

    // Company Details
    website: '',
    industryType: '',
    companySize: '',
    yearOfEstablishment: '',

    // Address
    country: '',
    state: '',
    city: '',
    fullAddress: '',
    pinCode: '',

    // Legal Verification
    gstNumber: '',
    cinNumber: '',
    panNumber: '',

    // HR Contact
    hrName: '',
    hrPhone: '',
    hrEmail: '',

    // Bank Details
    bankAccountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (!currentUser) return;
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            designation: data.designation || '',
            companyName: data.companyName || '',
            companyLegalName: data.companyLegalName || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            industryType: data.industryType || '',
            companySize: data.companySize || '',
            yearOfEstablishment: data.yearOfEstablishment || '',
            country: data.country || '',
            state: data.state || '',
            city: data.city || '',
            fullAddress: data.fullAddress || '',
            pinCode: data.pinCode || '',
            gstNumber: data.gstNumber || '',
            cinNumber: data.cinNumber || '',
            panNumber: data.panNumber || '',
            hrName: data.hrName || '',
            hrPhone: data.hrPhone || '',
            hrEmail: data.hrEmail || '',
            bankAccountName: data.bankAccountName || '',
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            ifscCode: data.ifscCode || '',
            upiId: data.upiId || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, formData);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (userData) {
      setFormData({
        designation: userData.designation || '',
        companyName: userData.companyName || '',
        companyLegalName: userData.companyLegalName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        website: userData.website || '',
        industryType: userData.industryType || '',
        companySize: userData.companySize || '',
        yearOfEstablishment: userData.yearOfEstablishment || '',
        country: userData.country || '',
        state: userData.state || '',
        city: userData.city || '',
        fullAddress: userData.fullAddress || '',
        pinCode: userData.pinCode || '',
        gstNumber: userData.gstNumber || '',
        cinNumber: userData.cinNumber || '',
        panNumber: userData.panNumber || '',
        hrName: userData.hrName || '',
        hrPhone: userData.hrPhone || '',
        hrEmail: userData.hrEmail || '',
        bankAccountName: userData.bankAccountName || '',
        bankName: userData.bankName || '',
        accountNumber: userData.accountNumber || '',
        ifscCode: userData.ifscCode || '',
        upiId: userData.upiId || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary-900 flex items-center gap-3">
            <Building2 size={40} />
            Company Profile
          </h1>
          <p className="text-secondary-700 mt-2">Manage your company information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Profile Card */}
        <div className="card bg-white">
          {isEditing ? (
            <form className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Your Designation *</label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    >
                      <option value="">Select Designation</option>
                      <option value="HR">HR / Human Resources</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Founder">Founder / Management</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="pt-4 border-t border-secondary-100">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Company Legal Name *</label>
                    <input
                      type="text"
                      name="companyLegalName"
                      value={formData.companyLegalName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Industry Type *</label>
                    <select
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    >
                      <option value="">Select Industry</option>
                      <option value="IT">IT / Software</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Company Size *</label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    >
                      <option value="">Select Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="10-50">10-50 employees</option>
                      <option value="50-200">50-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Year of Establishment *</label>
                    <input
                      type="number"
                      name="yearOfEstablishment"
                      value={formData.yearOfEstablishment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://company.com"
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="pt-4 border-t border-secondary-100">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-secondary-800 font-semibold mb-2">Full Address *</label>
                  <textarea
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 resize-none"
                  />
                </div>
              </div>

              {/* Legal Verification */}
              <div className="pt-4 border-t border-secondary-100">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Legal Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">GST Number *</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">CIN Number *</label>
                    <input
                      type="text"
                      name="cinNumber"
                      value={formData.cinNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">PAN Number *</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                </div>
              </div>

              {/* HR Contact */}
              <div className="pt-4 border-t border-secondary-100">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">HR Contact Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">HR Name *</label>
                    <input
                      type="text"
                      name="hrName"
                      value={formData.hrName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">HR Phone *</label>
                    <input
                      type="tel"
                      name="hrPhone"
                      value={formData.hrPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-secondary-800 font-semibold mb-2">HR Email *</label>
                    <input
                      type="email"
                      name="hrEmail"
                      value={formData.hrEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="pt-4 border-t border-secondary-100">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Account Holder Name *</label>
                    <input
                      type="text"
                      name="bankAccountName"
                      value={formData.bankAccountName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">Account Number *</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">IFSC Code *</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                  <div>
                    <label className="block text-secondary-800 font-semibold mb-2">UPI ID (Optional)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="example@upi"
                      className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-secondary-100">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-secondary-200 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-300 transition"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="pb-6 border-b-2 border-primary-200">
                <h2 className="text-3xl font-bold text-secondary-900 mb-2">{formData.companyName}</h2>
                <p className="text-secondary-700 flex items-center gap-2 text-lg">
                  <Building2 size={20} />
                  {formData.companyLegalName}
                </p>
              </div>

              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                    <p className="text-secondary-600 font-medium text-sm mb-1">Designation</p>
                    <p className="text-secondary-900 font-bold">{formData.designation}</p>
                  </div>
                  <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                    <p className="text-secondary-600 font-medium text-sm mb-1 flex items-center gap-2"><Mail size={16} /> Email</p>
                    <a href={`mailto:${formData.email}`} className="text-secondary-900 font-bold hover:text-accent-600">{formData.email}</a>
                  </div>
                  <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                    <p className="text-secondary-600 font-medium text-sm mb-1 flex items-center gap-2"><Phone size={16} /> Phone</p>
                    <a href={`tel:${formData.phone}`} className="text-secondary-900 font-bold hover:text-accent-600">{formData.phone}</a>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
                    <p className="text-blue-600 font-medium text-sm mb-1">Industry</p>
                    <p className="text-secondary-900 font-bold">{formData.industryType}</p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
                    <p className="text-blue-600 font-medium text-sm mb-1">Company Size</p>
                    <p className="text-secondary-900 font-bold">{formData.companySize}</p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
                    <p className="text-blue-600 font-medium text-sm mb-1">Established</p>
                    <p className="text-secondary-900 font-bold">{formData.yearOfEstablishment}</p>
                  </div>
                  {formData.website && (
                    <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
                      <p className="text-blue-600 font-medium text-sm mb-1 flex items-center gap-2"><Globe size={16} /> Website</p>
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-secondary-900 font-bold hover:text-accent-600">{formData.website}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Address</h3>
                <div className="p-4 bg-primary-100 rounded-lg border border-primary-200">
                  <p className="text-secondary-600 font-medium text-sm mb-2 flex items-center gap-2"><MapPin size={16} /> Location</p>
                  <p className="text-secondary-900 font-bold">{formData.fullAddress}</p>
                  <p className="text-secondary-700 text-sm mt-2">{formData.city}, {formData.state}, {formData.country} - {formData.pinCode}</p>
                </div>
              </div>

              {/* Legal Details */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Legal Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <p className="text-green-600 font-medium text-sm mb-1">GST</p>
                    <p className="text-secondary-900 font-bold">{formData.gstNumber}</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <p className="text-green-600 font-medium text-sm mb-1">CIN</p>
                    <p className="text-secondary-900 font-bold">{formData.cinNumber}</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <p className="text-green-600 font-medium text-sm mb-1">PAN</p>
                    <p className="text-secondary-900 font-bold">{formData.panNumber}</p>
                  </div>
                </div>
              </div>

              {/* HR Contact */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2"><Users size={20} /> HR Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-100 rounded-lg border border-purple-200">
                    <p className="text-purple-600 font-medium text-sm mb-1">Name</p>
                    <p className="text-secondary-900 font-bold">{formData.hrName}</p>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-lg border border-purple-200">
                    <p className="text-purple-600 font-medium text-sm mb-1 flex items-center gap-2"><Phone size={14} /> Phone</p>
                    <a href={`tel:${formData.hrPhone}`} className="text-secondary-900 font-bold hover:text-accent-600">{formData.hrPhone}</a>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-lg border border-purple-200 md:col-span-2">
                    <p className="text-purple-600 font-medium text-sm mb-1 flex items-center gap-2"><Mail size={14} /> Email</p>
                    <a href={`mailto:${formData.hrEmail}`} className="text-secondary-900 font-bold hover:text-accent-600">{formData.hrEmail}</a>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2"><DollarSign size={20} /> Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-600 font-medium text-sm mb-1">Account Holder</p>
                    <p className="text-secondary-900 font-bold">{formData.bankAccountName}</p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-600 font-medium text-sm mb-1">Bank</p>
                    <p className="text-secondary-900 font-bold">{formData.bankName}</p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-600 font-medium text-sm mb-1">Account Number</p>
                    <p className="text-secondary-900 font-bold font-mono">{formData.accountNumber}</p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-yellow-600 font-medium text-sm mb-1">IFSC Code</p>
                    <p className="text-secondary-900 font-bold font-mono">{formData.ifscCode}</p>
                  </div>
                  {formData.upiId && (
                    <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-200">
                      <p className="text-yellow-600 font-medium text-sm mb-1">UPI ID</p>
                      <p className="text-secondary-900 font-bold">{formData.upiId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
