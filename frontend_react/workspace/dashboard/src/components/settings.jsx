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

// Theme and setting options
const Themes = ['purple', 'cyan', 'pink'];
const RefreshIntervals = ['5s', '10s', '30s'];
const AlertSensitivities = ['low', 'medium', 'high'];

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
    <div className="min-h-screen bg-gradient-to-br from-[#0B0C2A] via-[#1a0f3a] to-[#2C0E4E] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white relative inline-block">
            Settings
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#9D4EDD] to-[#00E7F9] rounded-full opacity-70 animate-pulse"></div>
          </h1>
          <p className="text-[#CFCFEF] text-lg mt-6">
            Manage your profile, preferences, system controls, and privacy settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Profile & Preferences */}
          <div className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#00E7F9]" />
              <h2 className="text-2xl font-bold">User Profile & Preferences</h2>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9D4EDD] to-[#00E7F9] flex items-center justify-center text-2xl font-bold">
                JS
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">John Smith</h3>
                <p className="text-[#CFCFEF] text-sm">john.smith@sentily.ai</p>
              </div>
            </div>

            <button className="w-full mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#9D4EDD]/20 to-[#9D4EDD]/10 border border-[#9D4EDD]/50 text-white font-semibold hover:shadow-[0_0_20px_rgba(157,78,221,0.5)] hover:scale-[1.02] transition-all duration-300">
              Edit Profile
            </button>

            <div className="space-y-3">
              <SettingRow
                icon={<Lock className="w-5 h-5" />}
                label="Change Password"
                onClick={() => alert('Change password clicked')}
              />
              <SettingRow
                icon={<Bell className="w-5 h-5" />}
                label="Email & Notifications"
                toggle={notifications}
                onToggle={() => setNotifications(!notifications)}
              />
              <SettingRow
                icon={<Moon className="w-5 h-5" />}
                label="Dark Mode"
                toggle={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
              />
              <div className="setting-row group">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#00E7F9]" />
                  <span className="text-[#CFCFEF] group-hover:text-white transition-colors">
                    Language
                  </span>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-[#00E7F9]/30 text-white focus:border-[#00E7F9] focus:shadow-[0_0_15px_rgba(0,231,249,0.3)] outline-none transition-all duration-300"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-6 h-6 text-[#9D4EDD]" />
              <h2 className="text-2xl font-bold">System Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="setting-row group">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-[#9D4EDD]" />
                  <span className="text-[#CFCFEF] group-hover:text-white transition-colors">
                    Data Refresh Interval
                  </span>
                </div>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-[#9D4EDD]/30 text-white focus:border-[#9D4EDD] focus:shadow-[0_0_15px_rgba(157,78,221,0.3)] outline-none transition-all duration-300"
                >
                  <option value="5s">5 seconds</option>
                  <option value="10s">10 seconds</option>
                  <option value="30s">30 seconds</option>
                </select>
              </div>

              <div className="setting-row group">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#00E7F9]" />
                  <span className="text-[#CFCFEF] group-hover:text-white transition-colors">
                    Alert Sensitivity
                  </span>
                </div>
                <select
                  value={alertSensitivity}
                  onChange={(e) => setAlertSensitivity(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-[#00E7F9]/30 text-white focus:border-[#00E7F9] focus:shadow-[0_0_15px_rgba(0,231,249,0.3)] outline-none transition-all duration-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <SettingRow
                icon={<Brain className="w-5 h-5" />}
                label="AI Insights Mode"
                toggle={aiInsights}
                onToggle={() => setAiInsights(!aiInsights)}
              />

              <SettingRow
                icon={<Database className="w-5 h-5" />}
                label="Auto Backup"
                toggle={autoBackup}
                onToggle={() => setAutoBackup(!autoBackup)}
              />

              {autoBackup && (
                <div className="ml-8 mt-2 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-[#CFCFEF]">Backup in progress...</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#9D4EDD] to-[#00E7F9] rounded-full animate-progress"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Privacy & Permissions */}
          <div className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-[#00E7F9]" />
              <h2 className="text-2xl font-bold">Privacy & Permissions</h2>
            </div>

            <div className="space-y-3">
              <SettingRow
                icon={<Lock className="w-5 h-5" />}
                label="Manage Data Access"
                onClick={() => alert('Manage data access clicked')}
              />

              <button className="w-full setting-row group justify-start hover:border-[#00E7F9]/50">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[#00E7F9]" />
                  <span className="text-[#CFCFEF] group-hover:text-white transition-colors">
                    Download My Data
                  </span>
                </div>
              </button>

              <button className="w-full setting-row group justify-start hover:border-[#9D4EDD]/50">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-[#9D4EDD]" />
                  <span className="text-[#CFCFEF] group-hover:text-white transition-colors">
                    Clear Cache
                  </span>
                </div>
              </button>

              <button
                onClick={handleResetSettings}
                className="w-full setting-row group justify-start hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-red-400" />
                  <span className="text-[#CFCFEF] group-hover:text-red-300 transition-colors">
                    Reset Settings
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Theme Customization */}
          <div className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-[#9D4EDD]" />
              <h2 className="text-2xl font-bold">Theme Customization</h2>
            </div>

            <div className="mb-6">
              <p className="text-[#CFCFEF] mb-4">Select Accent Color:</p>
              <div className="flex gap-4">
                {Themes.map((color) => (
                  <ThemeButton
                    key={color}
                    color={color}
                    selected={selectedTheme === color}
                    onClick={() => setSelectedTheme(color)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-[#CFCFEF] mb-3">Theme Preview:</p>
              <div className="flex gap-3">
                <div
                  className={`h-12 flex-1 rounded-lg ${
                    selectedTheme === 'purple'
                      ? 'bg-gradient-to-r from-[#9D4EDD] to-[#7B2CBF]'
                      : selectedTheme === 'cyan'
                      ? 'bg-gradient-to-r from-[#00E7F9] to-[#0091AD]'
                      : 'bg-gradient-to-r from-[#FF006E] to-[#D90368]'
                  } transition-all duration-500`}
                ></div>
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#9D4EDD]/20 to-[#00E7F9]/20 border border-[#9D4EDD]/50 text-white font-semibold hover:shadow-[0_0_25px_rgba(157,78,221,0.5)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10">Apply Theme</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9D4EDD]/30 to-[#00E7F9]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, toggle, onToggle, onClick }) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <div className="text-[#00E7F9]">{icon}</div>
        <span className="text-[#CFCFEF] group-hover:text-white transition-colors">{label}</span>
      </div>
      {toggle !== undefined && <Toggle checked={toggle} onChange={onToggle} />}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full setting-row group">
        {content}
      </button>
    );
  }

  return <div className="setting-row group">{content}</div>;
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
  const colors = {
    purple: 'from-[#9D4EDD] to-[#7B2CBF]',
    cyan: 'from-[#00E7F9] to-[#0091AD]',
    pink: 'from-[#FF006E] to-[#D90368]',
  };

  const glows = {
    purple: 'shadow-[0_0_20px_rgba(157,78,221,0.6)]',
    cyan: 'shadow-[0_0_20px_rgba(0,231,249,0.6)]',
    pink: 'shadow-[0_0_20px_rgba(255,0,110,0.6)]',
  };

  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colors[color]} hover:scale-110 transition-all duration-300 relative ${
        selected ? glows[color] : ''
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
