import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uploadResumeToCloudinary, uploadToCloudinary } from '../config/cloudinary';
import { UserPlus, Building2, ChevronRight, ChevronLeft, Plus, X, FileText, Award, DollarSign } from 'lucide-react';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentRole, setCurrentRole] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Info (Both roles)
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    // Employee
    resume: null,
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    // Company
    designation: '', // HR / Recruiter / Founder
    companyLegalName: '',
    companyName: '',
    companyLogo: null,
    website: '',
    industryType: '',
    companySize: '',
    yearOfEstablishment: '',
    country: '',
    state: '',
    city: '',
    fullAddress: '',
    pinCode: '',
    gstNumber: '',
    cinNumber: '',
    panNumber: '',
    businessRegistrationCertificate: null,
    hrName: '',
    hrPhone: '',
    hrEmail: '',
    // Bank Details
    bankAccountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    cancelledCheque: null,
    upiId: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newEducation, setNewEducation] = useState({ school: '', degree: '', field: '', startDate: '', endDate: '' });
  const [newExperience, setNewExperience] = useState({ company: '', position: '', duration: '', description: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', date: '' });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep = (step) => {
    setError('');

    if (step === 1) {
      if (!currentRole) {
        setError('Please select Employee or Company');
        return false;
      }
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Email, password, and confirm password are required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (currentRole === 'employee') {
        if (!formData.firstName || !formData.lastName || !formData.phone) {
          setError('First name, last name, and phone are required');
          return false;
        }
      } else if (currentRole === 'company') {
        if (!formData.firstName || !formData.phone || !formData.designation) {
          setError('Name, phone, and designation are required');
          return false;
        }
      }
      return true;
    }

    if (step === 2) {
      if (currentRole === 'employee') {
        if (!formData.resume) {
          setError('Resume is required');
          return false;
        }
      } else if (currentRole === 'company') {
        if (!formData.companyName || !formData.companyLegalName) {
          setError('Company name and legal name are required');
          return false;
        }
        if (!formData.website || !formData.industryType || !formData.companySize || !formData.yearOfEstablishment) {
          setError('Website, industry type, company size, and year of establishment are required');
          return false;
        }
        if (!formData.country || !formData.state || !formData.city || !formData.fullAddress || !formData.pinCode) {
          setError('Complete address is required');
          return false;
        }
        if (!formData.gstNumber || !formData.cinNumber || !formData.panNumber || !formData.businessRegistrationCertificate) {
          setError('All legal verification documents are required');
          return false;
        }
        if (!formData.hrName || !formData.hrPhone || !formData.hrEmail) {
          setError('Contact person details are required');
          return false;
        }
      }
      return true;
    }

    if (step === 3 && currentRole === 'employee') {
      if (formData.skills.length === 0) {
        setError('Please add at least one skill');
        return false;
      }
      if (formData.experience.length === 0) {
        setError('Please add at least one work experience');
        return false;
      }
      return true;
    }

    if (step === 3 && currentRole === 'company') {
      if (!formData.bankAccountName || !formData.bankName || !formData.accountNumber || !formData.ifscCode) {
        setError('All bank details are required');
        return false;
      }
      if (!formData.cancelledCheque) {
        setError('Cancelled cheque or bank proof is required');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const addEducation = () => {
    if (newEducation.school && newEducation.degree) {
      setFormData({
        ...formData,
        education: [...formData.education, newEducation]
      });
      setNewEducation({ school: '', degree: '', field: '', startDate: '', endDate: '' });
    }
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setFormData({
        ...formData,
        experience: [...formData.experience, newExperience]
      });
      setNewExperience({ company: '', position: '', duration: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification]
      });
      setNewCertification({ name: '', issuer: '', date: '' });
    }
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only allow submission on the final step
    if (currentStep < totalSteps) {
      setError('Please complete all steps before submitting');
      return;
    }

    // Final validation before submission
    if (!validateStep(currentStep)) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      let resumeUrl = null;
      let logoUrl = null;
      let businessRegUrl = null;
      let cancelledChequeUrl = null;

      if (currentRole === 'employee' && formData.resume) {
        resumeUrl = await uploadResumeToCloudinary(formData.resume);
      }

      if (currentRole === 'company') {
        if (formData.companyLogo) {
          logoUrl = await uploadToCloudinary(formData.companyLogo);
        }
        if (formData.businessRegistrationCertificate) {
          businessRegUrl = await uploadToCloudinary(formData.businessRegistrationCertificate);
        }
        if (formData.cancelledCheque) {
          cancelledChequeUrl = await uploadToCloudinary(formData.cancelledCheque);
        }
      }

      const userData = {
        role: currentRole,
        firstName: formData.firstName,
        phone: formData.phone,
        ...(currentRole === 'employee' && {
          lastName: formData.lastName,
          address: formData.address,
          resume: resumeUrl,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
          certifications: formData.certifications,
        }),
        ...(currentRole === 'company' && {
          designation: formData.designation,
          // Company Information
          companyName: formData.companyName,
          companyLegalName: formData.companyLegalName,
          companyLogo: logoUrl,
          website: formData.website,
          industryType: formData.industryType,
          companySize: formData.companySize,
          yearOfEstablishment: formData.yearOfEstablishment,
          // Address
          country: formData.country,
          state: formData.state,
          city: formData.city,
          fullAddress: formData.fullAddress,
          address: formData.fullAddress,
          pinCode: formData.pinCode,
          // Legal Verification
          gstNumber: formData.gstNumber,
          cinNumber: formData.cinNumber,
          panNumber: formData.panNumber,
          businessRegistrationCertificate: businessRegUrl,
          // Contact Person
          hrName: formData.hrName,
          hrPhone: formData.hrPhone,
          hrEmail: formData.hrEmail,
          // Bank Details
          bankAccountName: formData.bankAccountName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          cancelledCheque: cancelledChequeUrl,
          upiId: formData.upiId,
        }),
      };

      await register(formData.email, formData.password, userData);
      alert('Registration successful! Your account is pending admin approval. You will be notified once approved.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleFormKeyDown = (e) => {
    // Prevent Enter key from submitting form unless on final step
    if (e.key === 'Enter' && currentStep < totalSteps) {
      e.preventDefault();
    }
  };

  const totalSteps = currentRole === 'employee' ? 3 : 3;
  const stepLabels = currentRole === 'employee'
    ? ['Basic Info', 'Education', 'Skills & Certificates']
    : ['Basic Info', 'Company & Legal Info', 'Bank Details'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-secondary-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">JobConnect</h1>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">Create your account</h2>
          <p className="text-secondary-600">Join us as a job seeker or employer</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8">

          {/* Step Indicator */}
          {currentRole && (
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-sm font-semibold text-secondary-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-secondary-600">{stepLabels[currentStep - 1]}</span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2">
                <div
                  className="bg-secondary-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Role Selection */}
          {!currentRole ? (
            <div className="mb-8">
              <p className="text-sm font-semibold text-secondary-800 mb-6">I am registering as:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setCurrentRole('employee'); setCurrentStep(1); }}
                  className="flex flex-col items-center gap-3 py-6 px-4 rounded-lg border-2 border-secondary-200 hover:border-secondary-300 bg-white text-secondary-700 font-semibold transition"
                >
                  <UserPlus size={32} />
                  <span>Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentRole('company'); setCurrentStep(1); }}
                  className="flex flex-col items-center gap-3 py-6 px-4 rounded-lg border-2 border-secondary-200 hover:border-secondary-300 bg-white text-secondary-700 font-semibold transition"
                >
                  <Building2 size={32} />
                  <span>Company</span>
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-800 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                      placeholder="City, State"
                    />
                  </div>

                  {currentRole === 'company' && (
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Your Role/Designation *</label>
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                      >
                        <option value="">Select Designation</option>
                        <option value="HR">HR / Human Resources</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Founder">Founder / Management</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 focus:ring-2 focus:ring-secondary-100 text-secondary-900 placeholder-secondary-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Employee - Education & Resume, Company - Details & Bank */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {currentRole === 'employee' ? (
                    <>
                      {/* Resume */}
                      <div>
                        <label className="block text-sm font-semibold text-secondary-800 mb-2 flex items-center gap-2">
                          <FileText size={18} />
                          Resume (PDF) *
                        </label>
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf"
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary-100 file:text-secondary-900 hover:file:bg-secondary-200"
                        />
                      </div>

                      {/* Education */}
                      <div>
                        <label className="block text-sm font-semibold text-secondary-800 mb-3">Education</label>
                        <div className="space-y-3 mb-4">
                          <input
                            type="text"
                            placeholder="School/University"
                            value={newEducation.school}
                            onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                            className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Degree"
                              value={newEducation.degree}
                              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                            />
                            <input
                              type="text"
                              placeholder="Field"
                              value={newEducation.field}
                              onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Start Date (2020)"
                              value={newEducation.startDate}
                              onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                            />
                            <input
                              type="text"
                              placeholder="End Date (2024)"
                              value={newEducation.endDate}
                              onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addEducation}
                            className="flex items-center gap-2 px-4 py-2.5 bg-secondary-100 text-secondary-900 rounded-lg hover:bg-secondary-200 font-semibold transition"
                          >
                            <Plus size={18} />
                            Add Education
                          </button>
                        </div>
                        {formData.education.map((edu, index) => (
                          <div key={index} className="bg-secondary-50 p-4 rounded-lg mb-3 flex justify-between items-start border border-secondary-100">
                            <div>
                              <p className="font-semibold text-secondary-900">{edu.school}</p>
                              <p className="text-sm text-secondary-600">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                              <p className="text-xs text-secondary-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="p-1 hover:bg-red-100 rounded transition"
                            >
                              <X size={18} className="text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* STEP 2: Company - Company Information */}
                      {/* Company Basic Details */}
                      <div>
                        <label className="block text-sm font-semibold text-secondary-800 mb-2">Company Name *</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                          placeholder="Operating Company Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-secondary-800 mb-2">Company Legal Name *</label>
                        <input
                          type="text"
                          name="companyLegalName"
                          value={formData.companyLegalName}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                          placeholder="Legal entity name"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-secondary-800 mb-2">Company Logo</label>
                          <input
                            type="file"
                            name="companyLogo"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary-100 file:text-secondary-900 hover:file:bg-secondary-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-secondary-800 mb-2">Website *</label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                            placeholder="https://company.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-secondary-800 mb-2">Industry Type *</label>
                          <select
                            name="industryType"
                            value={formData.industryType}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
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
                          <label className="block text-sm font-semibold text-secondary-800 mb-2">Company Size *</label>
                          <select
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                          >
                            <option value="">Select Company Size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="10-50">10-50 employees</option>
                            <option value="50-200">50-200 employees</option>
                            <option value="200+">200+ employees</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-secondary-800 mb-2">Year of Establishment *</label>
                        <input
                          type="number"
                          name="yearOfEstablishment"
                          value={formData.yearOfEstablishment}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                          placeholder="e.g., 2010"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>

                      {/* Address */}
                      <div className="pt-4 border-t border-secondary-100">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">Country *</label>
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="Country"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">State *</label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="State / Province"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">PIN Code *</label>
                            <input
                              type="text"
                              name="pinCode"
                              value={formData.pinCode}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="PIN / Postal Code"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-secondary-800 mb-2">Full Address *</label>
                          <textarea
                            name="fullAddress"
                            value={formData.fullAddress}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500 resize-none"
                            rows="2"
                            placeholder="Street address with building/office details"
                          />
                        </div>
                      </div>

                      {/* Legal Verification */}
                      <div className="pt-4 border-t border-secondary-100">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Legal Verification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">GST Number *</label>
                            <input
                              type="text"
                              name="gstNumber"
                              value={formData.gstNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="15-digit GST Number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">CIN Number *</label>
                            <input
                              type="text"
                              name="cinNumber"
                              value={formData.cinNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="Corporate Identification Number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">PAN Number *</label>
                            <input
                              type="text"
                              name="panNumber"
                              value={formData.panNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="10-digit PAN"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">Business Registration Certificate *</label>
                            <input
                              type="file"
                              name="businessRegistrationCertificate"
                              accept=".pdf,image/*"
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary-100 file:text-secondary-900 hover:file:bg-secondary-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* HR Contact */}
                      <div className="pt-4 border-t border-secondary-100">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">HR Contact Person</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">HR Name *</label>
                            <input
                              type="text"
                              name="hrName"
                              value={formData.hrName}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="HR Manager Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">HR Phone *</label>
                            <input
                              type="tel"
                              name="hrPhone"
                              value={formData.hrPhone}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-secondary-800 mb-2">HR Email *</label>
                            <input
                              type="email"
                              name="hrEmail"
                              value={formData.hrEmail}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                              placeholder="hr@company.com"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 3: Company - Bank Details */}
              {currentStep === 3 && currentRole === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-secondary-900 mb-4">Bank Account Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Account Holder Name *</label>
                      <input
                        type="text"
                        name="bankAccountName"
                        value={formData.bankAccountName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        placeholder="Account Holder Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        placeholder="Name of the Bank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">Account Number *</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        placeholder="Bank Account Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-800 mb-2">IFSC Code *</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        placeholder="11-character IFSC Code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-800 mb-2">Cancelled Cheque / Bank Proof *</label>
                    <input
                      type="file"
                      name="cancelledCheque"
                      accept=".pdf,image/*"
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary-100 file:text-secondary-900 hover:file:bg-secondary-200"
                    />
                    <p className="text-xs text-secondary-600 mt-2">Upload a clear image of cancelled cheque or bank account verification document</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary-800 mb-2">UPI ID (Optional)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                      placeholder="example@upi"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Employee - Skills & Certificates */}
              {currentStep === 3 && currentRole === 'employee' && (
                <div className="space-y-6">
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-800 mb-3">Skills</label>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        placeholder="Add a skill (Press Enter or click Add)"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2.5 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-semibold transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="bg-accent-100 text-accent-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="hover:text-accent-700 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-800 mb-3">Work Experience</label>
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Position"
                          value={newExperience.position}
                          onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 2 years)"
                          value={newExperience.duration}
                          onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500 resize-none"
                        rows="2"
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary-100 text-secondary-900 rounded-lg hover:bg-secondary-200 font-semibold transition"
                      >
                        <Plus size={18} />
                        Add Experience
                      </button>
                    </div>
                    {formData.experience.map((exp, index) => (
                      <div key={index} className="bg-secondary-50 p-4 rounded-lg mb-3 flex justify-between items-start border border-secondary-100">
                        <div>
                          <p className="font-semibold text-secondary-900">{exp.company}</p>
                          <p className="text-sm text-secondary-600">{exp.position}</p>
                          <p className="text-xs text-secondary-500">{exp.duration}</p>
                          {exp.description && <p className="text-sm text-secondary-600 mt-1">{exp.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="p-1 hover:bg-red-100 rounded transition"
                        >
                          <X size={18} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary-800 mb-3 flex items-center gap-2">
                      <Award size={18} />
                      Certifications
                    </label>
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        placeholder="Certification Name"
                        value={newCertification.name}
                        onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Issuer/Organization"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        />
                        <input
                          type="text"
                          placeholder="Date (2024)"
                          value={newCertification.date}
                          onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                          className="w-full px-4 py-2.5 border border-secondary-100 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 placeholder-secondary-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addCertification}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary-100 text-secondary-900 rounded-lg hover:bg-secondary-200 font-semibold transition"
                      >
                        <Plus size={18} />
                        Add Certification
                      </button>
                    </div>
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="bg-secondary-50 p-4 rounded-lg mb-3 flex justify-between items-start border border-secondary-100">
                        <div>
                          <p className="font-semibold text-secondary-900">{cert.name}</p>
                          <p className="text-sm text-secondary-600">{cert.issuer}</p>
                          <p className="text-xs text-secondary-500">{cert.date}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="p-1 hover:bg-red-100 rounded transition"
                        >
                          <X size={18} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-secondary-100">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-6 py-2.5 bg-secondary-100 text-secondary-900 rounded-lg hover:bg-secondary-200 font-semibold transition"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-semibold transition"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || currentStep !== totalSteps}
                    className="flex-1 px-6 py-2.5 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Divider & Sign In Link */}
          {currentRole && currentStep === 1 && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-secondary-200"></div>
                <span className="text-sm text-secondary-500">or</span>
                <div className="flex-1 h-px bg-secondary-200"></div>
              </div>

              <p className="text-center text-secondary-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-accent-600 hover:text-accent-700 transition">
                  Sign in here
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-secondary-500 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
