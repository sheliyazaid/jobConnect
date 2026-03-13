import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Save, X, Bell as BellIcon, Shield, Users } from 'lucide-react';

const CompanySettings = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [accountData, setAccountData] = useState({
    contactEmail: '',
    contactPhone: '',
    notificationsEnabled: true,
    emailAlertsEnabled: true,
    candidateMessagesEnabled: true,
  });

  const [teamData, setTeamData] = useState({
    allowMultipleRecruiters: true,
    showRecruiterNamesToCandidates: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!currentUser) return;

        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAccountData({
            contactEmail: data.email || userData?.email || '',
            contactPhone: data.phone || '',
            notificationsEnabled: data.notificationsEnabled !== false,
            emailAlertsEnabled: data.emailAlertsEnabled !== false,
            candidateMessagesEnabled: data.candidateMessagesEnabled !== false,
          });
          setTeamData({
            allowMultipleRecruiters: data.allowMultipleRecruiters !== false,
            showRecruiterNamesToCandidates: data.showRecruiterNamesToCandidates !== false,
          });
        }
      } catch (error) {
        console.error('Error fetching company settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser, userData]);

  const handleAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTeamChange = (e) => {
    const { name, type, checked } = e.target;
    setTeamData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : prev[name],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!currentUser) return;

      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        phone: accountData.contactPhone,
        notificationsEnabled: accountData.notificationsEnabled,
        emailAlertsEnabled: accountData.emailAlertsEnabled,
        candidateMessagesEnabled: accountData.candidateMessagesEnabled,
        allowMultipleRecruiters: teamData.allowMultipleRecruiters,
        showRecruiterNamesToCandidates: teamData.showRecruiterNamesToCandidates,
      });

      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2 flex items-center gap-3">
          <Settings size={40} />
          Company Account Settings
        </h1>
        <p className="text-secondary-600 text-lg">
          Manage your company contact details, notification preferences and team access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
              <Shield size={24} className="text-primary-600" />
              Contact Information
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={accountData.contactEmail}
                disabled
                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg bg-secondary-50 text-secondary-700 cursor-not-allowed text-sm"
              />
              <p className="text-secondary-600 text-xs mt-1">
                Your login email is used as the primary contact. Contact support if this needs to
                change.
              </p>
            </div>
            <div>
              <label className="block text-secondary-800 font-semibold mb-2 text-sm">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={accountData.contactPhone}
                onChange={handleAccountChange}
                placeholder="Company phone number for candidates to reach you"
                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
              <BellIcon size={24} className="text-primary-600" />
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="pr-4">
                <p className="font-semibold text-secondary-900">Platform Notifications</p>
                <p className="text-secondary-600 text-xs">
                  Receive notifications for new applications, interview updates and messages.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="notificationsEnabled"
                  checked={accountData.notificationsEnabled}
                  onChange={handleAccountChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="pr-4">
                <p className="font-semibold text-secondary-900">Email Alerts</p>
                <p className="text-secondary-600 text-xs">
                  Get important updates sent to your registered email address.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailAlertsEnabled"
                  checked={accountData.emailAlertsEnabled}
                  onChange={handleAccountChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="pr-4">
                <p className="font-semibold text-secondary-900">Candidate Messages</p>
                <p className="text-secondary-600 text-xs">
                  Allow candidates to reply and send messages through the portal.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="candidateMessagesEnabled"
                  checked={accountData.candidateMessagesEnabled}
                  onChange={handleAccountChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <Users size={24} className="text-primary-600" />
            Team & Access Control
          </h2>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="pr-4">
              <p className="font-semibold text-secondary-900">Multiple Recruiters</p>
              <p className="text-secondary-600 text-xs">
                Allow more than one recruiter to access this company account.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="allowMultipleRecruiters"
                checked={teamData.allowMultipleRecruiters}
                onChange={handleTeamChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="pr-4">
              <p className="font-semibold text-secondary-900">Show Recruiter Names</p>
              <p className="text-secondary-600 text-xs">
                Display recruiter names and emails to candidates in messages and invitations.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="showRecruiterNamesToCandidates"
                checked={teamData.showRecruiterNamesToCandidates}
                onChange={handleTeamChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-secondary-200 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary-200 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-300 transition"
          >
            <X size={18} />
            Reset Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;


