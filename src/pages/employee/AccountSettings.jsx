import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { updatePassword } from 'firebase/auth';
import { Settings, Save, X, Lock, Eye, EyeOff, Bell as BellIcon, Shield } from 'lucide-react';

const AccountSettings = () => {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountData, setAccountData] = useState({
    email: '',
    phone: '',
    notificationsEnabled: true,
    emailAlertsEnabled: true,
    profileVisible: true,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchAccountSettings = async () => {
      try {
        if (!currentUser) return;

        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAccountData({
            email: data.email || '',
            phone: data.phone || '',
            notificationsEnabled: data.notificationsEnabled !== false,
            emailAlertsEnabled: data.emailAlertsEnabled !== false,
            profileVisible: data.profileVisible !== false,
          });
        }
      } catch (error) {
        console.error('Error fetching account settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountSettings();
  }, [currentUser]);

  const handleAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAccountSettings = async () => {
    setSaving(true);
    try {
      if (!currentUser) return;

      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        phone: accountData.phone,
        notificationsEnabled: accountData.notificationsEnabled,
        emailAlertsEnabled: accountData.emailAlertsEnabled,
        profileVisible: accountData.profileVisible,
      });

      alert('Account settings updated successfully!');
    } catch (error) {
      console.error('Error updating account settings:', error);
      alert('Failed to update account settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setSaving(true);
    try {
      if (!currentUser) return;

      // Update password in Firebase Auth
      await updatePassword(currentUser, passwordData.newPassword);

      alert('Password updated successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangePasswordMode(false);
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/weak-password') {
        alert('Password is too weak. Please use a stronger password');
      } else {
        alert('Failed to update password: ' + error.message);
      }
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-2 flex items-center gap-3">
          <Settings size={40} />
          Account Settings
        </h1>
        <p className="text-secondary-600 text-lg">Manage your account preferences and security</p>
      </div>

      {/* Account Information */}
      <div className="card bg-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <Shield size={24} className="text-primary-600" />
            Account Information
          </h2>
        </div>

        <div className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-secondary-800 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={accountData.email || currentUser?.email || ''}
              disabled
              className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg bg-secondary-50 text-secondary-700 cursor-not-allowed"
            />
            <p className="text-secondary-600 text-sm mt-2">
              Your email address cannot be changed here. Contact support if you need to update it.
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-secondary-800 font-semibold mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={accountData.phone}
              onChange={handleAccountChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-secondary-200">
            <button
              onClick={handleSaveAccountSettings}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Account Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Password & Security */}
      <div className="card bg-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <Lock size={24} className="text-primary-600" />
            Password & Security
          </h2>
        </div>

        {!changePasswordMode ? (
          <button
            onClick={() => setChangePasswordMode(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Lock size={18} />
            Change Password
          </button>
        ) : (
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-secondary-800 font-semibold mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-secondary-600 hover:text-secondary-900"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-secondary-800 font-semibold mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:border-secondary-900 text-secondary-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-secondary-600 hover:text-secondary-900"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 font-semibold text-sm mb-2">Password Requirements:</p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>✓ At least 6 characters long</li>
                <li>✓ Mix of uppercase and lowercase (recommended)</li>
                <li>✓ Include numbers and symbols (recommended)</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-secondary-200">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <Lock size={18} />
                {saving ? 'Updating...' : 'Update Password'}
              </button>
              <button
                onClick={() => {
                  setChangePasswordMode(false);
                  setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-secondary-200 text-secondary-900 rounded-lg font-semibold hover:bg-secondary-300 transition"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="card bg-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <BellIcon size={24} className="text-primary-600" />
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {/* Platform Notifications */}
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div>
              <p className="font-semibold text-secondary-900">Platform Notifications</p>
              <p className="text-secondary-600 text-sm">Receive notifications about applications and messages</p>
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

          {/* Email Alerts */}
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div>
              <p className="font-semibold text-secondary-900">Email Alerts</p>
              <p className="text-secondary-600 text-sm">Receive email notifications for important updates</p>
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
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-secondary-200">
          <button
            onClick={handleSaveAccountSettings}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <Shield size={24} className="text-primary-600" />
            Privacy Settings
          </h2>
        </div>

        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div>
              <p className="font-semibold text-secondary-900">Profile Visibility</p>
              <p className="text-secondary-600 text-sm">Allow employers and recruiters to view your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="profileVisible"
                checked={accountData.profileVisible}
                onChange={handleAccountChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-secondary-200">
          <button
            onClick={handleSaveAccountSettings}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
