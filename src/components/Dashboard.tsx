import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Copy, Trash2, Edit3, Calendar, FileText, Search, Grid, List, Sparkles, Settings, LogOut, ArrowRight, Check } from 'lucide-react';
import { ResumeData, UserProfile } from '../types';
import { TEMPLATES } from '../constants';

interface DashboardProps {
  user: UserProfile;
  resumes: ResumeData[];
  onSelectResume: (id: string) => void;
  onCreateResume: (templateId?: 'minimalist' | 'modern' | 'creative' | 'professional', useSample?: boolean) => void;
  onDeleteResume: (id: string) => void;
  onDuplicateResume: (id: string) => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

export default function Dashboard({
  user,
  resumes,
  onSelectResume,
  onCreateResume,
  onDeleteResume,
  onDuplicateResume,
  onNavigateToSettings,
  onLogout,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredResumes = resumes
    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const getCompletenessScore = (resume: ResumeData) => {
    let score = 0;
    const info = resume.personalInfo;
    if (info.firstName && info.lastName) score += 20;
    if (info.email && info.phone) score += 10;
    if (info.summary) score += 10;
    if (resume.education.length > 0) score += 15;
    if (resume.experience.length > 0) score += 15;
    if (resume.projects.length > 0) score += 15;
    if (resume.skills.flatMap(s => s.skills).length > 0) score += 15;
    return Math.min(score, 100);
  };

  const getTemplateName = (id: string) => {
    return TEMPLATES.find(t => t.id === id)?.name || id;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Upper Navigation Rail */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                R
              </div>
              <span className="font-bold text-slate-900 text-lg hidden sm:block">Resume Builder</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateToSettings}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-sm font-medium"
              >
                <Settings size={18} />
                <span className="hidden md:inline">Settings</span>
              </button>

              <div className="h-6 w-[1px] bg-slate-200" />

              <div className="flex items-center gap-2.5">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user.title}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50/50 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Bento Grid layout for Header, Stats & Quick Links */}
        <div className="grid grid-cols-12 gap-6">
          {/* Welcome Card - Bento block (col-span-8) */}
          <div className="col-span-12 md:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-extrabold font-space">Workspace Control Center</span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1 font-space">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                Select an existing resume to edit or draft a new professional document using our high-grade Bento templates optimized for modern ATS systems.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => onCreateResume('modern', true)}
                className="inline-flex items-center px-4 py-2.5 border border-slate-200 rounded-xl shadow-xs bg-slate-50/50 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-all cursor-pointer"
              >
                <Sparkles size={14} className="mr-2 text-amber-500 animate-pulse" />
                <span>Populate Sample Resume</span>
              </button>
              <button
                onClick={() => onCreateResume('modern', false)}
                className="inline-flex items-center px-5 py-2.5 rounded-xl shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <Plus size={14} className="mr-2" />
                <span>Create Blank Resume</span>
              </button>
            </div>
          </div>

          {/* Active Template Quick Glance - Bento block (col-span-4) */}
          <div className="col-span-12 md:col-span-4 bg-indigo-600 rounded-3xl p-6 shadow-sm text-white flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest opacity-75 font-extrabold font-space">Engine Status</span>
                <p className="text-sm font-medium opacity-90 mt-1">Active Style Preset</p>
              </div>
              <span className="bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                ATS Friendly
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black font-space tracking-tight">
                {resumes.length > 0 ? getTemplateName(resumes[0].templateId) : 'Modern Minimalist'}
              </h3>
              <p className="text-xs opacity-80 leading-relaxed">
                {resumes.length > 0 ? "You're actively working on your documents using this structure." : "Choose from our carefully crafted style matrices below."}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Bento Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-slate-300">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-space block">Total Documents</span>
              <p className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{resumes.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-slate-300">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Check size={20} />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-space block">Average Completeness</span>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {resumes.length > 0
                    ? Math.round(resumes.reduce((acc, r) => acc + getCompletenessScore(r), 0) / resumes.length)
                    : 0}%
                </p>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[120px]">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ 
                      width: `${resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + getCompletenessScore(r), 0) / resumes.length) : 0}%` 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:border-slate-300">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-space block">Workspace Quality</span>
              <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1">
                <span>Optimized Content Grid</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">Ready</span>
              </p>
            </div>
          </div>
        </div>

        {/* Templates Catalog Selector */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 font-space">Choose a Professional Template</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => onCreateResume(tpl.id as any, false)}
                className="border border-slate-200 hover:border-indigo-500 hover:shadow-md rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group h-full bg-slate-50/20"
              >
                <div>
                  <div className="text-3xl mb-3">{tpl.image}</div>
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm font-space">{tpl.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tpl.description}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  Create with this <ArrowRight size={12} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumes List Header with Filters */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900"
              />
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="date">Last Updated</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes Display */}
        {filteredResumes.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No resumes found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              {searchTerm ? 'No resumes match your search query. Try typing something else!' : "You haven't created any resumes yet. Start by choosing a template above!"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => onCreateResume('modern', false)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <Plus size={16} className="mr-2" />
                Create First Resume
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => {
              const score = getCompletenessScore(resume);
              return (
                <motion.div
                  key={resume.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md rounded-2xl overflow-hidden transition-all flex flex-col justify-between group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600">
                        <FileText size={22} />
                      </div>
                      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateResume(resume.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                          title="Duplicate Resume"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this resume?')) {
                              onDeleteResume(resume.id);
                            }
                          }}
                          className="p-1.5 text-slate-450 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                          title="Delete Resume"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mt-4 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {resume.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar size={13} />
                      <span>Updated {new Date(resume.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Progress score */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-slate-500">Completeness</span>
                        <span className="text-slate-800">{score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            score < 40 ? 'bg-amber-500' : score < 80 ? 'bg-indigo-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100/80 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {getTemplateName(resume.templateId)}
                    </span>

                    <button
                      onClick={() => onSelectResume(resume.id)}
                      className="inline-flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      Edit Resume <ArrowRight size={13} className="ml-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {filteredResumes.map((resume) => {
                const score = getCompletenessScore(resume);
                return (
                  <li
                    key={resume.id}
                    onClick={() => onSelectResume(resume.id)}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {resume.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Updated {new Date(resume.lastUpdated).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                            {getTemplateName(resume.templateId)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      {/* Completeness bar */}
                      <div className="w-24 sm:w-32">
                        <div className="flex justify-between items-center text-[10px] font-bold mb-0.5">
                          <span className="text-slate-450">Progress</span>
                          <span className="text-slate-700">{score}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              score < 40 ? 'bg-amber-500' : score < 80 ? 'bg-indigo-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      {/* Item actions */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateResume(resume.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Duplicate Resume"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this resume?')) {
                              onDeleteResume(resume.id);
                            }
                          }}
                          className="p-1.5 text-slate-450 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Resume"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => onSelectResume(resume.id)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Resume"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
