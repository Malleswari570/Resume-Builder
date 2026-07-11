import React, { useState, useEffect } from 'react';
import { ResumeData, UserProfile } from './types';
import { SAMPLE_RESUME_DATA, BLANK_RESUME_DATA } from './constants';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import Settings from './components/Settings';
import { FileText, Eye, Edit2, Layout, Sliders, ChevronLeft } from 'lucide-react';

export default function App() {
  // Authentication state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Resume builder state
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  // View state: 'dashboard' | 'editor' | 'settings'
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'settings'>('dashboard');

  // Mobile Editor Sub-view: 'form' | 'preview'
  const [mobileSubView, setMobileSubView] = useState<'form' | 'preview'>('form');

  // Check login and resumes from localStorage on boot
  useEffect(() => {
    // 1. Auth check
    const savedUser = localStorage.getItem('resume_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('resume_user');
      }
    }

    // 2. Resumes list load
    const savedResumes = localStorage.getItem('resume_data_list');
    if (savedResumes) {
      try {
        const parsed = JSON.parse(savedResumes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResumes(parsed);
        } else {
          // Pre-populate with sample data if list is empty
          setResumes([SAMPLE_RESUME_DATA]);
        }
      } catch (e) {
        setResumes([SAMPLE_RESUME_DATA]);
      }
    } else {
      // First-time user: give them our pre-made template so they see visual styling
      setResumes([SAMPLE_RESUME_DATA]);
      localStorage.setItem('resume_data_list', JSON.stringify([SAMPLE_RESUME_DATA]));
    }

    setIsAuthLoading(false);
  }, []);

  // Sync resumes to localStorage on update
  const saveResumes = (updatedList: ResumeData[]) => {
    setResumes(updatedList);
    localStorage.setItem('resume_data_list', JSON.stringify(updatedList));
  };

  // Auth callbacks
  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? Your work remains saved locally.')) {
      localStorage.removeItem('resume_user');
      setUser(null);
      setCurrentView('dashboard');
    }
  };

  // Profile update callback
  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('resume_user', JSON.stringify(updatedProfile));
  };

  // Resume CRUD operations
  const handleCreateResume = (
    templateId: 'minimalist' | 'modern' | 'creative' | 'professional' = 'modern',
    useSample: boolean = false
  ) => {
    const newId = `resume-${Date.now()}`;
    const newTitle = useSample ? `Copy of ${SAMPLE_RESUME_DATA.personalInfo.firstName || 'Sample'}'s Resume` : 'Untitled Resume';
    
    let newResume: ResumeData;
    if (useSample) {
      newResume = {
        ...SAMPLE_RESUME_DATA,
        id: newId,
        title: newTitle,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      newResume = BLANK_RESUME_DATA(newId, newTitle);
      newResume.templateId = templateId;
    }

    const updated = [newResume, ...resumes];
    saveResumes(updated);
    setActiveResumeId(newId);
    setCurrentView('editor');
    setMobileSubView('form');
  };

  const handleUpdateResume = (updatedResume: ResumeData) => {
    const updated = resumes.map((r) => (r.id === updatedResume.id ? updatedResume : r));
    saveResumes(updated);
  };

  const handleUpdateResumeSettings = (updates: Partial<ResumeData>) => {
    if (!activeResumeId) return;
    const updated = resumes.map((r) => {
      if (r.id === activeResumeId) {
        return {
          ...r,
          ...updates,
          lastUpdated: new Date().toISOString(),
        };
      }
      return r;
    });
    saveResumes(updated);
  };

  const handleDeleteResume = (id: string) => {
    const updated = resumes.filter((r) => r.id !== id);
    saveResumes(updated);
    if (activeResumeId === id) {
      setActiveResumeId(null);
      setCurrentView('dashboard');
    }
  };

  const handleDuplicateResume = (id: string) => {
    const target = resumes.find((r) => r.id === id);
    if (!target) return;

    const dupId = `resume-dup-${Date.now()}`;
    const duplicated: ResumeData = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
      lastUpdated: new Date().toISOString(),
    };

    const updated = [duplicated, ...resumes];
    saveResumes(updated);
  };

  const handleResetAllData = () => {
    localStorage.removeItem('resume_data_list');
    localStorage.removeItem('resume_user');
    setResumes([SAMPLE_RESUME_DATA]);
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleImportResumes = (imported: ResumeData[]) => {
    saveResumes(imported);
  };

  // Active resume object lookup
  const activeResume = resumes.find((r) => r.id === activeResumeId);

  // loading spinner for initial bootstrap
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4" />
        <p className="text-sm text-slate-400 font-mono">Initializing Resume Builder...</p>
      </div>
    );
  }

  // Not logged in: show Login/Signup flow
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Settings page
  if (currentView === 'settings') {
    return (
      <Settings
        user={user}
        resumes={resumes}
        onUpdateUser={handleUpdateUser}
        onImportResumes={handleImportResumes}
        onResetAllData={handleResetAllData}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  // Dashboard page
  if (currentView === 'dashboard') {
    return (
      <Dashboard
        user={user}
        resumes={resumes}
        onSelectResume={(id) => {
          setActiveResumeId(id);
          setCurrentView('editor');
        }}
        onCreateResume={handleCreateResume}
        onDeleteResume={handleDeleteResume}
        onDuplicateResume={handleDuplicateResume}
        onNavigateToSettings={() => setCurrentView('settings')}
        onLogout={handleLogout}
      />
    );
  }

  // Editor splitscreen interface (Form & Live Preview side-by-side on desktop)
  if (currentView === 'editor' && activeResume) {
    return (
      <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
        {/* Editor custom banner header */}
        <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft size={14} className="mr-1" />
              <span>Dashboard</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
              <FileText size={14} />
              <span>Editing:</span>
              <strong className="text-slate-800 font-semibold max-w-[120px] truncate">{activeResume.title}</strong>
            </span>
          </div>

          {/* Toggle buttons for Mobile Subviews */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMobileSubView('form')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileSubView === 'form'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit2 size={13} />
              <span>Form</span>
            </button>
            <button
              onClick={() => setMobileSubView('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mobileSubView === 'preview'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye size={13} />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Tips label on Desktop */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-3 py-1.5 rounded-xl font-medium animate-pulse">
            <Layout size={13} />
            <span>Interactive real-time preview</span>
          </span>
        </header>

        {/* Split Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Form container: left on desktop, conditionally rendered on mobile */}
          <div
            className={`w-full md:w-[48%] xl:w-[45%] h-full flex flex-col p-3 md:p-4 shrink-0 no-print ${
              mobileSubView === 'form' ? 'block' : 'hidden md:block'
            }`}
          >
            <ResumeForm
              resume={activeResume}
              onChange={handleUpdateResume}
              onBack={() => setCurrentView('dashboard')}
            />
          </div>

          {/* Preview container: right on desktop, conditionally rendered on mobile */}
          <div
            className={`flex-1 h-full flex flex-col p-3 md:p-4 md:pl-0 ${
              mobileSubView === 'preview' ? 'block' : 'hidden md:block'
            }`}
          >
            <ResumePreview
              resume={activeResume}
              onChangeSettings={handleUpdateResumeSettings}
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback in case something is wrong
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-500 mb-2">No Active Resume selected.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}
