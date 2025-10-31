import { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Moon,
  Globe,
  RefreshCw,
  AlertTriangle,
  Brain,
  Database,
  Download,
  Trash2,
  RotateCcw,
  Palette,
  Check,
} from 'lucide-react';

const Themes = ['purple', 'cyan', 'pink'];

function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState('10s');
  const [alertSensitivity, setAlertSensitivity] = useState('medium');
  const [selectedTheme, setSelectedTheme] = useState('purple');
  const [language, setLanguage] = useState('en');

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
      setDarkMode(true);
      setNotifications(true);
      setAiInsights(true);
      setAutoBackup(false);
      setRefreshInterval('10s');
      setAlertSensitivity('medium');
      setSelectedTheme('purple');
      setLanguage('en');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0C2A] via-[#1a0f3a] to-[#2C0E4E] text-white px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 relative inline-block">
            Settings
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#9D4EDD] to-[#00E7F9] rounded-full opacity-70 animate-pulse"></div>
          </h1>
          <p className="text-[#CFCFEF] text-lg mt-4">
            Manage your profile, preferences, system controls, and privacy settings.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* === User Profile === */}
          <GlassCard title="User Profile & Preferences" icon={<User className="w-6 h-6 text-[#00E7F9]" />}>
            <ProfileCard />
            <ActionButton label="Edit Profile" gradient="from-[#9D4EDD]/20 to-[#9D4EDD]/10" border="border-[#9D4EDD]/50" />

            <div className="space-y-4 mt-4">
              <SettingRow icon={<Lock className="w-5 h-5" />} label="Change Password" onClick={() => alert('Change password clicked')} />
              <SettingRow icon={<Bell className="w-5 h-5" />} label="Email & Notifications" toggle={notifications} onToggle={() => setNotifications(!notifications)} />
              <SettingRow icon={<Moon className="w-5 h-5" />} label="Dark Mode" toggle={darkMode} onToggle={() => setDarkMode(!darkMode)} />

              <div className="setting-row flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#00E7F9]" />
                  <span className="text-[#CFCFEF]">Language</span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-[#00E7F9]/30 text-white text-sm focus:border-[#00E7F9] outline-none transition-all"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* === System Settings === */}
          <GlassCard title="System Settings" icon={<RefreshCw className="w-6 h-6 text-[#9D4EDD]" />}>
            <SettingDropdown icon={<RefreshCw className="w-5 h-5 text-[#9D4EDD]" />} label="Data Refresh Interval" value={refreshInterval} onChange={setRefreshInterval} options={['5s', '10s', '30s']} />
            <SettingDropdown icon={<AlertTriangle className="w-5 h-5 text-[#00E7F9]" />} label="Alert Sensitivity" value={alertSensitivity} onChange={setAlertSensitivity} options={['low', 'medium', 'high']} />
            <SettingRow icon={<Brain className="w-5 h-5" />} label="AI Insights Mode" toggle={aiInsights} onToggle={() => setAiInsights(!aiInsights)} />
            <SettingRow icon={<Database className="w-5 h-5" />} label="Auto Backup" toggle={autoBackup} onToggle={() => setAutoBackup(!autoBackup)} />

            {autoBackup && (
              <div className="ml-8 mt-3">
                <div className="text-sm text-[#CFCFEF] mb-1">Backup in progress...</div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#9D4EDD] to-[#00E7F9] rounded-full animate-progress"></div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* === Privacy Settings === */}
          <GlassCard title="Privacy & Permissions" icon={<Lock className="w-6 h-6 text-[#00E7F9]" />}>
            <SettingRow icon={<Lock className="w-5 h-5" />} label="Manage Data Access" onClick={() => alert('Manage Data Access')} />
            <SettingButton icon={<Download className="w-5 h-5 text-[#00E7F9]" />} label="Download My Data" />
            <SettingButton icon={<Trash2 className="w-5 h-5 text-[#9D4EDD]" />} label="Clear Cache" />
            <SettingButton icon={<RotateCcw className="w-5 h-5 text-red-400" />} label="Reset Settings" onClick={handleResetSettings} extraClasses="hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
          </GlassCard>

          {/* === Theme Customization === */}
          <GlassCard title="Theme Customization" icon={<Palette className="w-6 h-6 text-[#9D4EDD]" />}>
            <p className="text-[#CFCFEF] mb-3">Select Accent Color:</p>
            <div className="flex gap-4 mb-6">
              {Themes.map((color) => (
                <ThemeButton key={color} color={color} selected={selectedTheme === color} onClick={() => setSelectedTheme(color)} />
              ))}
            </div>

            <div className="mb-6 p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-sm text-[#CFCFEF] mb-2">Theme Preview:</p>
              <div className="flex gap-3">
                <div
                  className={`h-12 flex-1 rounded-lg transition-all duration-500 ${
                    selectedTheme === 'purple'
                      ? 'bg-gradient-to-r from-[#9D4EDD] to-[#7B2CBF]'
                      : selectedTheme === 'cyan'
                      ? 'bg-gradient-to-r from-[#00E7F9] to-[#0091AD]'
                      : 'bg-gradient-to-r from-[#FF006E] to-[#D90368]'
                  }`}
                ></div>
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <ActionButton label="Apply Theme" gradient="from-[#9D4EDD]/20 to-[#00E7F9]/20" border="border-[#9D4EDD]/50" />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ===== Reusable Components ===== */

function GlassCard({ title, icon, children }) {
  return (
    <div className="glass-card p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-[0_0_25px_rgba(157,78,221,0.3)] transition-all animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/10 border border-white/20">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9D4EDD] to-[#00E7F9] flex items-center justify-center text-2xl font-bold">
        JS
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">John Smith</h3>
        <p className="text-[#CFCFEF] text-sm">john.smith@sentily.ai</p>
      </div>
    </div>
  );
}

function ActionButton({ label, gradient, border }) {
  return (
    <button
      className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r ${gradient} ${border} text-white font-semibold hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] transition-all duration-300`}
    >
      {label}
    </button>
  );
}

function SettingRow({ icon, label, toggle, onToggle, onClick }) {
  return (
    <div
      onClick={onClick}
      className="setting-row flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="text-[#00E7F9]">{icon}</div>
        <span className="text-[#CFCFEF]">{label}</span>
      </div>
      {toggle !== undefined && <Toggle checked={toggle} onChange={onToggle} />}
    </div>
  );
}

function SettingButton({ icon, label, onClick, extraClasses = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${extraClasses}`}
    >
      {icon}
      <span className="text-[#CFCFEF]">{label}</span>
    </button>
  );
}

function SettingDropdown({ icon, label, value, onChange, options }) {
  return (
    <div className="setting-row flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[#CFCFEF]">{label}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/5 border border-[#9D4EDD]/30 text-white text-sm focus:border-[#9D4EDD] outline-none transition-all"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
        checked ? 'bg-gradient-to-r from-[#9D4EDD] to-[#00E7F9]' : 'bg-white/20'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-lg ${
          checked ? 'left-7' : 'left-1'
        }`}
      ></div>
    </button>
  );
}

function ThemeButton({ color, selected, onClick }) {
  const styles = {
    purple: 'from-[#9D4EDD] to-[#7B2CBF]',
    cyan: 'from-[#00E7F9] to-[#0091AD]',
    pink: 'from-[#FF006E] to-[#D90368]',
  };
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${styles[color]} hover:scale-110 transition-all relative ${
        selected ? 'shadow-[0_0_20px_rgba(157,78,221,0.6)]' : ''
      }`}
    >
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      )}
    </button>
  );
}

export default Settings;
