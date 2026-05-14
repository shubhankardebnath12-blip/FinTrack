import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { User, Palette, Globe, Bell, Shield, Sun, Moon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: '$ USD - US Dollar' },
  { value: 'EUR', label: '€ EUR - Euro' },
  { value: 'GBP', label: '£ GBP - British Pound' },
  { value: 'INR', label: '₹ INR - Indian Rupee' },
  { value: 'JPY', label: '¥ JPY - Japanese Yen' },
  { value: 'CAD', label: 'CA$ CAD - Canadian Dollar' },
  { value: 'AUD', label: 'A$ AUD - Australian Dollar' },
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'txn',      label: 'Transaction alerts',  desc: 'Get notified when a transaction is added',  enabled: true  },
  { id: 'budget',   label: 'Budget warnings',      desc: 'Alerts when approaching budget limit',       enabled: true  },
  { id: 'monthly',  label: 'Monthly reports',      desc: 'Receive monthly financial summaries',        enabled: false },
  { id: 'security', label: 'Security alerts',      desc: 'Get notified about account activity',        enabled: true  },
];

/* ── Reusable Toggle ─────────────────────────────────── */
const Toggle = ({ enabled, onToggle, id }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
      enabled ? 'bg-primary-600' : 'bg-white/20'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

/* ── Section header ──────────────────────────────────── */
const SectionHeader = ({ icon: Icon, label, desc, iconBg, iconColor }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2 rounded-xl ${iconBg}`}>
      <Icon size={18} className={iconColor} />
    </div>
    <div>
      <h3 className="text-base font-semibold text-white">{label}</h3>
      <p className="text-xs text-white/40">{desc}</p>
    </div>
  </div>
);

/* ── Main component ──────────────────────────────────── */
const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({ name: user?.name || '', currency: user?.currency || 'USD' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Fully interactive notification toggles
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [notifSaved, setNotifSaved] = useState(false);

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      const { data } = await userService.updateProfile(profile);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleToggleNotif = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
    setNotifSaved(false);
  };

  const handleSaveNotifications = () => {
    // Persist to localStorage (backend endpoint not required)
    localStorage.setItem('notif_prefs', JSON.stringify(notifications));
    setNotifSaved(true);
    toast.success('Notification preferences saved!');
    setTimeout(() => setNotifSaved(false), 2500);
  };

  const handleChangePassword = () => {
    toast('Password change — coming soon!', { icon: '🔐' });
  };

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl space-y-6 animate-in">

      {/* ── Profile ───────────────────────────────── */}
      <Card className="p-6">
        <SectionHeader
          icon={User}
          label="Profile"
          desc="Manage your account information"
          iconBg="bg-primary-500/20"
          iconColor="text-primary-400"
        />

        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
            <p className="text-xs text-white/30 mt-0.5">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
          />

          <div>
            <label className="input-label">Email Address</label>
            <input value={user?.email} disabled className="input opacity-50 cursor-not-allowed" />
            <p className="text-xs text-white/30 mt-1">Email cannot be changed</p>
          </div>

          <Select
            label="Default Currency"
            options={CURRENCY_OPTIONS}
            value={profile.currency}
            onChange={(e) => setProfile((p) => ({ ...p, currency: e.target.value }))}
          />

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={handleProfileSave} loading={profileLoading}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Appearance ────────────────────────────── */}
      <Card className="p-6">
        <SectionHeader
          icon={Palette}
          label="Appearance"
          desc="Customize how FinTrack looks"
          iconBg="bg-violet-500/20"
          iconColor="text-violet-400"
        />

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={16} className="text-violet-400" /> : <Sun size={16} className="text-yellow-500" />}
            <div>
              <p className="text-sm font-medium text-white">
                {isDark ? 'Dark' : 'Light'} Mode
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                Click to switch to {isDark ? 'light' : 'dark'} theme
              </p>
            </div>
          </div>
          <Toggle enabled={isDark} onToggle={toggleTheme} id="theme-toggle" />
        </div>
      </Card>

      {/* ── Notifications ─────────────────────────── */}
      <Card className="p-6">
        <SectionHeader
          icon={Bell}
          label="Notifications"
          desc="Control your notification preferences"
          iconBg="bg-warning-500/20"
          iconColor="text-warning-400"
        />

        <div className="space-y-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                id={`notif-${item.id}`}
                enabled={item.enabled}
                onToggle={() => handleToggleNotif(item.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
          <p className="text-xs text-white/30">
            {notifications.filter((n) => n.enabled).length} of {notifications.length} enabled
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveNotifications}
            id="save-notifications-btn"
          >
            {notifSaved ? (
              <span className="flex items-center gap-1.5">
                <Check size={13} /> Saved
              </span>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </Card>

      {/* ── Security ──────────────────────────────── */}
      <Card className="p-6">
        <SectionHeader
          icon={Shield}
          label="Security"
          desc="Manage account security"
          iconBg="bg-success-500/20"
          iconColor="text-success-400"
        />

        <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-sm">
          <p className="text-success-400 font-medium mb-1">✓ Account Secured</p>
          <p className="text-white/50 text-xs">
            Your account is protected with bcrypt password hashing and JWT tokens with 7-day expiry.
          </p>
        </div>

        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={handleChangePassword} id="change-password-btn">
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
