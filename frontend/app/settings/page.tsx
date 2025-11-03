'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import { authService, User } from '@/lib/auth';
import { Settings, User as UserIcon, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    quizReminders: true,
    gradeNotifications: true,
    darkMode: false,
    autoSave: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setMounted(true);
    setUser(authService.getCurrentUser());
  }, []);

  const handleSave = () => {
    setLoading(true);
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 md:mt-0 md:ml-64 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-5 h-5 text-gray-600" />
            <h2 className="font-orbitron text-xl font-bold text-gray-900">Profile</h2>
          </div>
          {mounted && user && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">{user.role}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="font-orbitron text-xl font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-6">
            <Toggle
              label="Email Notifications"
              description="Receive email notifications for important updates"
              checked={settings.emailNotifications}
              onChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
            <Toggle
              label="Quiz Reminders"
              description="Get reminders for upcoming quiz deadlines"
              checked={settings.quizReminders}
              onChange={(checked) => setSettings({ ...settings, quizReminders: checked })}
            />
            <Toggle
              label="Grade Notifications"
              description="Notify when grades are posted or updated"
              checked={settings.gradeNotifications}
              onChange={(checked) =>
                setSettings({ ...settings, gradeNotifications: checked })
              }
            />
          </div>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-5 h-5 text-gray-600" />
            <h2 className="font-orbitron text-xl font-bold text-gray-900">Preferences</h2>
          </div>
          <div className="space-y-6">
            <Toggle
              label="Dark Mode"
              description="Switch to dark theme (coming soon)"
              checked={settings.darkMode}
              onChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              disabled
            />
            <Toggle
              label="Auto Save"
              description="Automatically save your work as you type"
              checked={settings.autoSave}
              onChange={(checked) => setSettings({ ...settings, autoSave: checked })}
            />
          </div>
        </Card>

        {/* Security */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="font-orbitron text-xl font-bold text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </main>
    </div>
  );
}

