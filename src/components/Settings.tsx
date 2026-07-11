import React, { useState } from 'react';
import { User, Shield, Key, Download, Upload, Trash2, Check, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { UserProfile, ResumeData } from '../types';

interface SettingsProps {
  user: UserProfile;
  resumes: ResumeData[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onImportResumes: (imported: ResumeData[]) => void;
  onResetAllData: () => void;
  onBack: () => void;
}

export default function Settings({
  user,
  resumes,
  onUpdateUser,
  onImportResumes,
  onResetAllData,
  onBack,
}: SettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [themePreference, setThemePreference] = useState(user.themePreference);
  const [isSaved, setIsSaved] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      title,
      avatarUrl: avatarUrl || undefined,
      themePreference,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Backup resumes and profile into a downloadable JSON file
  const handleExportData = () => {
    const backupObj = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      resumes,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resume_builder_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore resumes and profile from a JSON file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.resumes)) {
          onImportResumes(parsed.resumes);
          if (parsed.user) {
            onUpdateUser(parsed.user);
            setName(parsed.user.name);
            setEmail(parsed.user.email);
            setTitle(parsed.user.title);
            setAvatarUrl(parsed.user.avatarUrl || '');
            setThemePreference(parsed.user.themePreference || 'light');
          }
          alert('Backup restored successfully! All resumes and profile settings loaded.');
          setFileError('');
        } else {
          setFileError('Invalid backup file structure. Must contain resumes array.');
        }
      } catch (err) {
        setFileError('Could not parse JSON. Please check the backup file.');
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="font-bold text-slate-900 text-lg">Settings & Profile</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="space-y-6">
          {/* PROFILE SECTION */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/40">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <User size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Personal Profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize your personal identity and application preferences.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-100">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar Preview"
                    className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xl flex items-center justify-center border border-indigo-200">
                    {name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Provide an image URL to show on your dashboard.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Default Theme Choice</label>
                  <select
                    value={themePreference}
                    onChange={(e) => setThemePreference(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="light">Light Slate Dashboard</option>
                    <option value="dark">Dark Slate (Planned)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                {isSaved ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <Check size={14} /> Profile Saved!
                  </span>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* BACKUP & RESTORE DATA */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/40">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Download size={18} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Backup, Export & Portability</h2>
                <p className="text-xs text-slate-500 mt-0.5">Keep your resumes safe. Export them to a local JSON backup or import them from another device.</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Export Local Backup</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Download a JSON file containing all of your resumes, section orderings, and personal details. Useful for backups.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                  >
                    <Download size={14} />
                    Export JSON Data Backup
                  </button>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Import / Restore Backup</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Load a previously downloaded backup JSON file to restore your resumes and profile. This merges or overwrites your current dashboard!
                    </p>
                  </div>
                  <div className="mt-4 relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="import-backup-file"
                    />
                    <label
                      htmlFor="import-backup-file"
                      className="inline-flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer text-center"
                    >
                      <Upload size={14} />
                      Choose Backup File
                    </label>
                  </div>
                  {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-white border border-red-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-red-100 flex items-center gap-3 bg-red-50/20">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="font-bold text-red-900 text-sm">Danger Zone</h2>
                <p className="text-xs text-red-500 mt-0.5">Destructive actions. Use with caution.</p>
              </div>
            </div>

            <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Reset Dashboard & Storage</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-lg">
                  This will completely clear your cached resumes and settings. Your workspace will revert to the default sample resume and initial empty state.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('CRITICAL: This will delete ALL saved resumes and profiles in this browser cache. Are you absolutely sure?')) {
                    onResetAllData();
                    onBack();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-transparent rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
