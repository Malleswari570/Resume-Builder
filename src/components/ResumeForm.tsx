import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, BookOpen, Briefcase, Award, FolderGit, Cpu, AwardIcon, BookmarkCheck,
  ChevronLeft, ChevronRight, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, HelpCircle, Save, ArrowLeft, GripVertical
} from 'lucide-react';
import { ResumeData, EducationEntry, ExperienceEntry, ProjectEntry, InternshipEntry, CertificationEntry, AchievementEntry, SkillGroup } from '../types';

interface ResumeFormProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  onBack: () => void;
}

type StepId = 'personalInfo' | 'summary' | 'experience' | 'projects' | 'education' | 'skills' | 'internships' | 'certifications' | 'achievements' | 'sections';

export default function ResumeForm({ resume, onChange, onBack }: ResumeFormProps) {
  const [activeStep, setActiveStep] = useState<StepId>('personalInfo');

  const steps: { id: StepId; label: string; icon: React.ReactNode }[] = [
    { id: 'personalInfo', label: 'Personal Details', icon: <User size={16} /> },
    { id: 'summary', label: 'Summary', icon: <HelpCircle size={16} /> },
    { id: 'experience', label: 'Work Experience', icon: <Briefcase size={16} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit size={16} /> },
    { id: 'education', label: 'Education', icon: <BookOpen size={16} /> },
    { id: 'skills', label: 'Skills & Tech', icon: <Cpu size={16} /> },
    { id: 'internships', label: 'Internships', icon: <Award size={16} /> },
    { id: 'certifications', label: 'Certifications', icon: <BookmarkCheck size={16} /> },
    { id: 'achievements', label: 'Achievements', icon: <AwardIcon size={16} /> },
    { id: 'sections', label: 'Section Order', icon: <GripVertical size={16} /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === activeStep);

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setActiveStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveStep(steps[currentStepIndex + 1].id);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    const updated = {
      ...resume,
      lastUpdated: new Date().toISOString(),
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    };
    onChange(updated);
  };

  const updateField = (section: keyof ResumeData, value: any) => {
    const updated = {
      ...resume,
      lastUpdated: new Date().toISOString(),
      [section]: value,
    };
    onChange(updated);
  };

  // Helper functions to manage array sub-sections (add, remove, update, move)
  const addArrayItem = (section: 'education' | 'experience' | 'projects' | 'internships' | 'certifications' | 'achievements') => {
    const id = `${section}-${Date.now()}`;
    let newItem: any;

    if (section === 'education') {
      newItem = { id, institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, location: '', gpa: '', description: '' };
    } else if (section === 'experience') {
      newItem = { id, company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' };
    } else if (section === 'projects') {
      newItem = { id, name: '', role: '', technologies: '', link: '', startDate: '', endDate: '', current: false, description: '' };
    } else if (section === 'internships') {
      newItem = { id, organization: '', role: '', startDate: '', endDate: '', current: false, description: '' };
    } else if (section === 'certifications') {
      newItem = { id, name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' };
    } else if (section === 'achievements') {
      newItem = { id, title: '', issuer: '', date: '', description: '' };
    }

    const updatedList = [...(resume[section] as any[]), newItem];
    updateField(section, updatedList);
  };

  const removeArrayItem = (section: 'education' | 'experience' | 'projects' | 'internships' | 'certifications' | 'achievements', id: string) => {
    const filteredList = (resume[section] as any[]).filter((item) => item.id !== id);
    updateField(section, filteredList);
  };

  const updateArrayItemValue = (
    section: 'education' | 'experience' | 'projects' | 'internships' | 'certifications' | 'achievements',
    id: string,
    field: string,
    value: any
  ) => {
    const updatedList = (resume[section] as any[]).map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateField(section, updatedList);
  };

  const moveArrayItem = (
    section: 'education' | 'experience' | 'projects' | 'internships' | 'certifications' | 'achievements',
    index: number,
    direction: 'up' | 'down'
  ) => {
    const list = [...(resume[section] as any[])];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = list[index];
    list[index] = list[swapIndex];
    list[swapIndex] = temp;

    updateField(section, list);
  };

  // Skill specific actions
  const addSkillGroup = () => {
    const id = `sk-group-${Date.now()}`;
    const newGroup: SkillGroup = { id, category: 'New Category', skills: [] };
    updateField('skills', [...resume.skills, newGroup]);
  };

  const removeSkillGroup = (groupId: string) => {
    updateField('skills', resume.skills.filter((g) => g.id !== groupId));
  };

  const updateSkillGroupCategory = (groupId: string, category: string) => {
    const updated = resume.skills.map((g) => (g.id === groupId ? { ...g, category } : g));
    updateField('skills', updated);
  };

  const addSkillTag = (groupId: string, tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const updated = resume.skills.map((g) => {
      if (g.id === groupId) {
        if (g.skills.includes(trimmed)) return g; // avoid duplicates
        return { ...g, skills: [...g.skills, trimmed] };
      }
      return g;
    });
    updateField('skills', updated);
  };

  const removeSkillTag = (groupId: string, tag: string) => {
    const updated = resume.skills.map((g) => {
      if (g.id === groupId) {
        return { ...g, skills: g.skills.filter((s) => s !== tag) };
      }
      return g;
    });
    updateField('skills', updated);
  };

  // Section Order functions
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...resume.sectionOrder];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = list[index];
    list[index] = list[swapIndex];
    list[swapIndex] = temp;

    updateField('sectionOrder', list);
  };

  const getSectionTitle = (id: string) => {
    switch (id) {
      case 'personalInfo': return 'Personal Header';
      case 'summary': return 'Personal Summary';
      case 'experience': return 'Work History / Experience';
      case 'projects': return 'Technical Projects';
      case 'education': return 'Education & Academy';
      case 'skills': return 'Skills & Technologies';
      case 'internships': return 'Internships & Fellowships';
      case 'certifications': return 'Certifications';
      case 'achievements': return 'Achievements & Honors';
      default: return id;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Title / Back Panel */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-200/65 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <input
              type="text"
              value={resume.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white rounded px-1.5 py-0.5 border-transparent border hover:border-slate-200 transition-all max-w-[240px] sm:max-w-md"
            />
            <p className="text-[11px] text-slate-500 px-1.5 mt-0.5">Editing • Click text to rename resume</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg transition-colors cursor-pointer border border-emerald-100"
        >
          <Save size={14} />
          <span>Save & Exit</span>
        </button>
      </div>

      {/* Main split: Side step navigator on left, active form input on right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Step Sidebar */}
        <nav className="w-64 border-r border-slate-100 p-4 space-y-1 hidden md:block overflow-y-auto bg-slate-50/30 shrink-0">
          
          {/* Bento Step Navigator Widget */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between mb-4">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold font-space">Current Section</span>
              <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{steps[currentStepIndex].label}</h4>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center relative shrink-0">
              <svg className="w-full h-full absolute -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-600 transition-all duration-300" strokeWidth="3" strokeDasharray={`${((currentStepIndex + 1) / steps.length) * 100} 100`} strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-bold font-mono text-slate-700">{currentStepIndex + 1}/{steps.length}</span>
            </div>
          </div>

          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-3 mb-2 font-space">Sections</p>
          {steps.map((step) => {
            const isCompleted = () => {
              if (step.id === 'personalInfo') return resume.personalInfo.firstName && resume.personalInfo.lastName;
              if (step.id === 'summary') return !!resume.personalInfo.summary;
              if (step.id === 'skills') return resume.skills.some((g) => g.skills.length > 0);
              return resume[step.id as keyof ResumeData] && (resume[step.id as keyof ResumeData] as any[]).length > 0;
            };

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  activeStep === step.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={activeStep === step.id ? 'text-indigo-600' : 'text-slate-400'}>
                    {step.icon}
                  </span>
                  <span>{step.label}</span>
                </div>
                {isCompleted() && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Panel */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Mobile Step Dropdown / Swiper */}
          <div className="p-3 border-b border-slate-100 md:hidden bg-slate-50/50">
            <select
              value={activeStep}
              onChange={(e) => setActiveStep(e.target.value as StepId)}
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {steps.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="p-6 flex-1 max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 1. PERSONAL INFO STEP */}
                {activeStep === 'personalInfo' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Ensure your contact details are accurate so recruiters can reach you easily.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">First Name</label>
                        <input
                          type="text"
                          value={resume.personalInfo.firstName}
                          onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={resume.personalInfo.lastName}
                          onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Professional Title</label>
                        <input
                          type="text"
                          value={resume.personalInfo.title}
                          onChange={(e) => updatePersonalInfo('title', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="Lead Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={resume.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={resume.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="+1 (555) 019-2834"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={resume.personalInfo.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Website URL</label>
                        <input
                          type="text"
                          value={resume.personalInfo.website}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="https://johndoe.dev"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={resume.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub Profile</label>
                        <input
                          type="text"
                          value={resume.personalInfo.github}
                          onChange={(e) => updatePersonalInfo('github', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="github.com/johndoe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SUMMARY STEP */}
                {activeStep === 'summary' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Personal Summary</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Write a brief professional summary (3-4 sentences) outlining your background, core strengths, and goals.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Summary Paragraph</label>
                      <textarea
                        rows={6}
                        value={resume.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        placeholder="Performance-driven Full Stack Developer with over 5 years of experience... Experts in TypeScript and React..."
                      />
                    </div>
                  </div>
                )}

                {/* 3. EXPERIENCE STEP */}
                {activeStep === 'experience' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Work Experience</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Add your professional work history starting with the most recent.</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('experience')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Role
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resume.experience.map((exp, idx) => (
                        <div key={exp.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Role #{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveArrayItem('experience', idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveArrayItem('experience', idx, 'down')}
                                disabled={idx === resume.experience.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => removeArrayItem('experience', exp.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Company Name</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateArrayItemValue('experience', exp.id, 'company', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Google Inc."
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Job Role / Title</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => updateArrayItemValue('experience', exp.id, 'role', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Senior Software Engineer"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Start Date</label>
                              <input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateArrayItemValue('experience', exp.id, 'startDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">End Date</label>
                              <input
                                type="month"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateArrayItemValue('experience', exp.id, 'endDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm disabled:opacity-55"
                              />
                            </div>
                            <div className="sm:col-span-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`exp-current-${exp.id}`}
                                checked={exp.current}
                                onChange={(e) => {
                                  updateArrayItemValue('experience', exp.id, 'current', e.target.checked);
                                  if (e.target.checked) updateArrayItemValue('experience', exp.id, 'endDate', '');
                                }}
                                className="h-4 w-4 rounded border-slate-350 text-indigo-600"
                              />
                              <label htmlFor={`exp-current-${exp.id}`} className="ml-2 text-xs font-semibold text-slate-700">
                                I currently work in this role
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateArrayItemValue('experience', exp.id, 'location', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="New York, NY"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Description & Responsibilities</label>
                              <p className="text-[10px] text-slate-500 mb-1">Tip: List bullet points separated by new lines.</p>
                              <textarea
                                rows={4}
                                value={exp.description}
                                onChange={(e) => updateArrayItemValue('experience', exp.id, 'description', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="• Directed a team of 4 React engineers to deliver standard core tools.&#10;• Reduced latency averages by over 14%."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS STEP */}
                {activeStep === 'projects' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Technical Projects</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Showcase critical software projects you created or led.</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('projects')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Project
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resume.projects.map((proj, idx) => (
                        <div key={proj.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Project #{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveArrayItem('projects', idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveArrayItem('projects', idx, 'down')}
                                disabled={idx === resume.projects.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => removeArrayItem('projects', proj.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Project Name</label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'name', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="OmnDocs Editor"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">My Role</label>
                              <input
                                type="text"
                                value={proj.role}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'role', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Creator & Developer"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Technologies Used</label>
                              <input
                                type="text"
                                value={proj.technologies}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'technologies', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="React, Node.js, Socket.io"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Project Link</label>
                              <input
                                type="text"
                                value={proj.link}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'link', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="https://github.com/.../..."
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Start Date</label>
                              <input
                                type="month"
                                value={proj.startDate}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'startDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">End Date</label>
                              <input
                                type="month"
                                value={proj.endDate}
                                disabled={proj.current}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'endDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm disabled:opacity-55"
                              />
                            </div>
                            <div className="sm:col-span-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`proj-current-${proj.id}`}
                                checked={proj.current}
                                onChange={(e) => {
                                  updateArrayItemValue('projects', proj.id, 'current', e.target.checked);
                                  if (e.target.checked) updateArrayItemValue('projects', proj.id, 'endDate', '');
                                }}
                                className="h-4 w-4 rounded border-slate-350 text-indigo-600"
                              />
                              <label htmlFor={`proj-current-${proj.id}`} className="ml-2 text-xs font-semibold text-slate-700">
                                This project is ongoing
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Brief Description</label>
                              <textarea
                                rows={3}
                                value={proj.description}
                                onChange={(e) => updateArrayItemValue('projects', proj.id, 'description', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Developed a real-time Markdown editor offering low-latency sync..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. EDUCATION STEP */}
                {activeStep === 'education' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Education Details</h3>
                        <p className="text-xs text-slate-500 mt-0.5">List your schools, college degrees, and academic backgrounds.</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('education')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Education
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resume.education.map((edu, idx) => (
                        <div key={edu.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">School #{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveArrayItem('education', idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveArrayItem('education', idx, 'down')}
                                disabled={idx === resume.education.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => removeArrayItem('education', edu.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Institution Name</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'institution', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="University of California, Berkeley"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Degree Received</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'degree', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Bachelor of Science (B.S.)"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Field of Study</label>
                              <input
                                type="text"
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'fieldOfStudy', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Computer Science & Engineering"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Location</label>
                              <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'location', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Berkeley, CA"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Start Date</label>
                              <input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'startDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">End Date</label>
                              <input
                                type="month"
                                value={edu.endDate}
                                disabled={edu.current}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'endDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm disabled:opacity-55"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`edu-current-${edu.id}`}
                                checked={edu.current}
                                onChange={(e) => {
                                  updateArrayItemValue('education', edu.id, 'current', e.target.checked);
                                  if (e.target.checked) updateArrayItemValue('education', edu.id, 'endDate', '');
                                }}
                                className="h-4 w-4 rounded border-slate-350 text-indigo-600"
                              />
                              <label htmlFor={`edu-current-${edu.id}`} className="ml-2 text-xs font-semibold text-slate-700">
                                I am currently studying here
                              </label>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">GPA / Grade (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'gpa', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="3.8 / 4.0"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Description (Optional)</label>
                              <textarea
                                rows={2}
                                value={edu.description}
                                onChange={(e) => updateArrayItemValue('education', edu.id, 'description', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Dean's List honors recipient, relevant coursework, extracurriculars..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. SKILLS STEP */}
                {activeStep === 'skills' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Skills & Technologies</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Organize your skill sets by categories (e.g. Languages, Databases, Tools).</p>
                      </div>
                      <button
                        onClick={addSkillGroup}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Category
                      </button>
                    </div>

                    <div className="space-y-6">
                      {resume.skills.map((group) => (
                        <div key={group.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/10 space-y-4">
                          <div className="flex justify-between items-center gap-4">
                            <input
                              type="text"
                              value={group.category}
                              onChange={(e) => updateSkillGroupCategory(group.id, e.target.value)}
                              className="font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:bg-white px-1"
                              placeholder="e.g. Languages"
                            />
                            <button
                              onClick={() => removeSkillGroup(group.id)}
                              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap gap-2 items-center">
                            {group.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkillTag(group.id, skill)}
                                  className="text-indigo-400 hover:text-indigo-900 cursor-pointer font-bold leading-none"
                                >
                                  ×
                                </button>
                              </span>
                            ))}

                            <SkillInput onAdd={(tag) => addSkillTag(group.id, tag)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. INTERNSHIPS STEP */}
                {activeStep === 'internships' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Internships & Fellowships</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Include short-term industrial experience, fellowships, or co-ops.</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('internships')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Internship
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resume.internships.map((intern, idx) => (
                        <div key={intern.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Internship #{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveArrayItem('internships', idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveArrayItem('internships', idx, 'down')}
                                disabled={idx === resume.internships.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => removeArrayItem('internships', intern.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Organization</label>
                              <input
                                type="text"
                                value={intern.organization}
                                onChange={(e) => updateArrayItemValue('internships', intern.id, 'organization', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Redwood Software Labs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Internship Role</label>
                              <input
                                type="text"
                                value={intern.role}
                                onChange={(e) => updateArrayItemValue('internships', intern.id, 'role', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Frontend Engineering Intern"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Start Date</label>
                              <input
                                type="month"
                                value={intern.startDate}
                                onChange={(e) => updateArrayItemValue('internships', intern.id, 'startDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">End Date</label>
                              <input
                                type="month"
                                value={intern.endDate}
                                disabled={intern.current}
                                onChange={(e) => updateArrayItemValue('internships', intern.id, 'endDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm disabled:opacity-55"
                              />
                            </div>
                            <div className="sm:col-span-2 flex items-center">
                              <input
                                type="checkbox"
                                id={`intern-current-${intern.id}`}
                                checked={intern.current}
                                onChange={(e) => {
                                  updateArrayItemValue('internships', intern.id, 'current', e.target.checked);
                                  if (e.target.checked) updateArrayItemValue('internships', intern.id, 'endDate', '');
                                }}
                                className="h-4 w-4 rounded border-slate-350 text-indigo-600"
                              />
                              <label htmlFor={`intern-current-${intern.id}`} className="ml-2 text-xs font-semibold text-slate-700">
                                This internship is ongoing
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Description</label>
                              <textarea
                                rows={3}
                                value={intern.description}
                                onChange={(e) => updateArrayItemValue('internships', intern.id, 'description', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Implemented standard UI components, assisted in code reviews..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. CERTIFICATIONS STEP */}
                {activeStep === 'certifications' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Professional Certifications</h3>
                        <p className="text-xs text-slate-500 mt-0.5">List credential achievements (e.g. AWS, Cloud, Salesforce).</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('certifications')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Certificate
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resume.certifications.map((cert, idx) => (
                        <div key={cert.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Certificate #{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveArrayItem('certifications', idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveArrayItem('certifications', idx, 'down')}
                                disabled={idx === resume.certifications.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => removeArrayItem('certifications', cert.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateArrayItemValue('certifications', cert.id, 'name', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Issuing Authority</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateArrayItemValue('certifications', cert.id, 'issuer', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Amazon Web Services"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Issue Date</label>
                              <input
                                type="month"
                                value={cert.issueDate}
                                onChange={(e) => updateArrayItemValue('certifications', cert.id, 'issueDate', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Credential ID (Optional)</label>
                              <input
                                type="text"
                                value={cert.credentialId}
                                onChange={(e) => updateArrayItemValue('certifications', cert.id, 'credentialId', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="AWS-SAP-8921"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Credential Verification URL (Optional)</label>
                              <input
                                type="text"
                                value={cert.credentialUrl}
                                onChange={(e) => updateArrayItemValue('certifications', cert.id, 'credentialUrl', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="https://aws.amazon.com/verification"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. ACHIEVEMENTS STEP */}
                {activeStep === 'achievements' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Achievements & Honors</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Highlight hackathons won, academic honors, or organizational citations.</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('achievements')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer border border-indigo-100 transition-colors"
                      >
                        <Plus size={14} /> Add Achievement
                      </button>
                    </div>

                    <div className="space-y-4">
                      {resume.achievements.map((ach, idx) => (
                        <div key={ach.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/20 relative space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">Award #{idx + 1}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveArrayItem('achievements', idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                onClick={() => moveArrayItem('achievements', idx, 'down')}
                                disabled={idx === resume.achievements.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                onClick={() => removeArrayItem('achievements', ach.id)}
                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Award Title / Recognition</label>
                              <input
                                type="text"
                                value={ach.title}
                                onChange={(e) => updateArrayItemValue('achievements', ach.id, 'title', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="1st Place - Berkeley Hackathon"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Issuer / Authority</label>
                              <input
                                type="text"
                                value={ach.issuer}
                                onChange={(e) => updateArrayItemValue('achievements', ach.id, 'issuer', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Cal Hacks Organizers"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-550">Date Received</label>
                              <input
                                type="month"
                                value={ach.date}
                                onChange={(e) => updateArrayItemValue('achievements', ach.id, 'date', e.target.value)}
                                className="mt-1 w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-slate-550">Brief Impact Description</label>
                              <textarea
                                rows={2}
                                value={ach.description}
                                onChange={(e) => updateArrayItemValue('achievements', ach.id, 'description', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm"
                                placeholder="Selected from 180 teams for optimizing decentralized mesh messaging..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. SECTION REORDER STEP */}
                {activeStep === 'sections' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Custom Section Order</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Control the layout sequence of your resume. Reorder sections based on what you want recruiters to see first!</p>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      {resume.sectionOrder.map((sectionId, idx) => (
                        <div
                          key={sectionId}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200/85 rounded-xl shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">
                              <GripVertical size={16} />
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                              {getSectionTitle(sectionId)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg disabled:opacity-25 disabled:hover:text-slate-400 disabled:hover:bg-transparent cursor-pointer"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 'down')}
                              disabled={idx === resume.sectionOrder.length - 1}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg disabled:opacity-25 disabled:hover:text-slate-400 disabled:hover:bg-transparent cursor-pointer"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Bottom Action Bar */}
          <div className="mt-auto border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between gap-4 sticky bottom-0 z-10">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} className="mr-1.5" />
              Previous
            </button>

            {/* Quick status dots */}
            <div className="hidden sm:flex items-center gap-1">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id)}
                  className={`h-1.5 w-1.5 rounded-full transition-all cursor-pointer ${
                    activeStep === s.id ? 'bg-indigo-600 w-3' : 'bg-slate-300'
                  }`}
                  title={s.label}
                />
              ))}
            </div>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={onBack}
                className="inline-flex items-center px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Finished Editing
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Next Step
                <ChevronRight size={16} className="ml-1.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Sub-component for adding Tags
interface SkillInputProps {
  onAdd: (val: string) => void;
}

function SkillInput({ onAdd }: SkillInputProps) {
  const [val, setVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = val.replace(/,$/, '').trim();
      if (cleaned) {
        onAdd(cleaned);
        setVal('');
      }
    }
  };

  const handleBlur = () => {
    const cleaned = val.trim();
    if (cleaned) {
      onAdd(cleaned);
      setVal('');
    }
  };

  return (
    <div className="flex items-center gap-1 shrink-0">
      <input
        type="text"
        placeholder="Add skill... (Press Enter)"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="border border-slate-200 border-dashed rounded-lg px-2 py-1 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36"
      />
    </div>
  );
}
