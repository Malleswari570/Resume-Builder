import React, { useRef, useState } from 'react';
import { Download, Sparkles, Sliders, Type, AlignJustify, Printer, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ResumeData } from '../types';
import { THEME_COLORS, FONTS, TEMPLATES } from '../constants';

interface ResumePreviewProps {
  resume: ResumeData;
  onChangeSettings: (updates: Partial<ResumeData>) => void;
}

export default function ResumePreview({ resume, onChangeSettings }: ResumePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [isInIframe, setIsInIframe] = useState(false);

  React.useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }
  }, []);

  const activeColor = THEME_COLORS.find(c => c.primaryHex === resume.colorTheme) || THEME_COLORS[1];

  // Map font styles
  const getFontClass = () => {
    switch (resume.fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'space': return 'font-space';
      default: return 'font-sans';
    }
  };

  // Map spacing styles
  const getSpacingClass = () => {
    switch (resume.spacing) {
      case 'compact': return 'space-y-1.5 md:space-y-2';
      case 'spacious': return 'space-y-5 md:space-y-6';
      default: return 'space-y-3 md:space-y-4';
    }
  };

  const getMarginClass = () => {
    switch (resume.spacing) {
      case 'compact': return 'py-4 px-6 gap-3';
      case 'spacious': return 'py-8 px-10 gap-6';
      default: return 'py-6 px-8 gap-4';
    }
  };

  const getBulletSpacing = () => {
    return resume.spacing === 'compact' ? 'space-y-0.5' : 'space-y-1';
  };

  const getSectionGap = () => {
    return resume.spacing === 'compact' ? 'mt-2' : resume.spacing === 'spacious' ? 'mt-4' : 'mt-3';
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    setDownloadStatus('generating');

    try {
      // Dynamic import to prevent bundler problems and keep code light
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = printRef.current;
      
      const fileNameClean = `${resume.personalInfo.firstName || 'Resume'}_${resume.personalInfo.lastName || ''}_Resume`
        .trim()
        .replace(/\s+/g, '_');

      const opt = {
        margin:       0.15, // dynamic small margins for safety
        filename:     `${fileNameClean}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };

      // Create PDF blob for robust manual download flow to files
      const blob = await html2pdf().set(opt).from(element).output('blob');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileNameClean}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup anchor link
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 150);

      setDownloadStatus('success');
      // Dismiss success alert automatically after 8 seconds
      setTimeout(() => setDownloadStatus('idle'), 8000);
    } catch (err) {
      console.error('PDF Generation failed, falling back to standard print:', err);
      setDownloadStatus('error');
      // Also trigger print fallback
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe split helper for description textareas to convert bullet lists
  const renderBullets = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    return (
      <ul className={`list-disc list-outside pl-4 text-slate-700 leading-relaxed ${getBulletSpacing()}`}>
        {lines.map((line, i) => {
          const cleanLine = line.replace(/^[•\-\*\s]+/, ''); // remove existing bullets if any
          return <li key={i}>{cleanLine}</li>;
        })}
      </ul>
    );
  };

  // RENDER SECTIONS DYNAMICALLY ACCORDING TO USER'S SECTION ORDER
  const renderSection = (sectionId: string, isSidebar: boolean = false) => {
    const { personalInfo, education, experience, projects, internships, certifications, achievements, skills } = resume;

    // Skip personalInfo & summary if we're rendering normal sections since personalInfo is usually rendered in header
    if (sectionId === 'personalInfo') return null;

    if (sectionId === 'summary' && personalInfo.summary) {
      return (
        <div key="summary" className="printable-section">
          {!isSidebar && (
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
              Professional Summary
            </h3>
          )}
          <p className="text-slate-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      );
    }

    if (sectionId === 'experience' && experience.length > 0) {
      return (
        <div key="experience" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Work History
          </h3>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{exp.role}</h4>
                    <p className="text-xs text-slate-500 font-medium">{exp.company} — {exp.location}</p>
                  </div>
                  <span className="text-xs text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0 font-medium">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''} -{' '}
                    {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                {exp.description && <div className="mt-1.5 text-xs text-slate-600">{renderBullets(exp.description)}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionId === 'projects' && projects.length > 0) {
      return (
        <div key="projects" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Projects
          </h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-slate-800 text-sm">{proj.name}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 inline-flex items-center gap-0.5 text-[10px] underline decoration-dotted">
                          link <ExternalLinkIcon />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{proj.role}</p>
                  </div>
                  <span className="text-xs text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0 font-medium">
                    {proj.startDate ? new Date(proj.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''} -{' '}
                    {proj.current ? 'Present' : proj.endDate ? new Date(proj.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                {proj.technologies && (
                  <p className="text-[10px] mt-1 text-slate-550 italic font-medium">
                    Built with: <span className="font-sans font-semibold text-slate-700">{proj.technologies}</span>
                  </p>
                )}
                {proj.description && <p className="mt-1 text-xs text-slate-600 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionId === 'education' && education.length > 0) {
      return (
        <div key="education" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h4>
                    <p className="text-xs text-slate-550 font-semibold">{edu.institution} — {edu.location}</p>
                  </div>
                  <span className="text-xs text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0 font-medium">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric' }) : ''} -{' '}
                    {edu.current ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric' }) : ''}
                  </span>
                </div>
                {edu.gpa && <p className="text-xs text-slate-650 font-bold mt-0.5">GPA: <span className="font-normal">{edu.gpa}</span></p>}
                {edu.description && <p className="mt-1 text-xs text-slate-550 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionId === 'skills' && skills.some(g => g.skills.length > 0)) {
      return (
        <div key="skills" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Skills & Tech
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.filter(g => g.skills.length > 0).map((group) => (
              <div key={group.id} className="break-inside-avoid">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{group.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionId === 'internships' && internships.length > 0) {
      return (
        <div key="internships" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Internships
          </h3>
          <div className="space-y-3">
            {internships.map((intern) => (
              <div key={intern.id} className="break-inside-avoid">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{intern.role}</h4>
                    <p className="text-xs text-slate-500 font-medium">{intern.organization}</p>
                  </div>
                  <span className="text-xs text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0 font-medium">
                    {intern.startDate ? new Date(intern.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''} -{' '}
                    {intern.current ? 'Present' : intern.endDate ? new Date(intern.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                  </span>
                </div>
                {intern.description && <p className="mt-1 text-xs text-slate-600 leading-relaxed">{intern.description}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionId === 'certifications' && certifications.length > 0) {
      return (
        <div key="certifications" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Certifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="break-inside-avoid text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{cert.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">{cert.issuer}</p>
                {cert.issueDate && (
                  <p className="text-[10px] text-slate-450">
                    Issued {new Date(cert.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </p>
                )}
                {cert.credentialId && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {cert.credentialId}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sectionId === 'achievements' && achievements.length > 0) {
      return (
        <div key="achievements" className="printable-section">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2 font-sans" style={{ color: resume.colorTheme, borderColor: `${resume.colorTheme}25` }}>
            Honors & Awards
          </h3>
          <div className="space-y-2">
            {achievements.map((ach) => (
              <div key={ach.id} className="break-inside-avoid text-xs">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h4 className="font-bold text-slate-800">{ach.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{ach.issuer}</p>
                  </div>
                  {ach.date && (
                    <span className="text-[10px] text-slate-450 bg-slate-50 px-1.5 py-0.5 rounded border font-medium">
                      {new Date(ach.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                {ach.description && <p className="text-slate-550 mt-1">{ach.description}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const { personalInfo } = resume;

  return (
    <div className="flex flex-col h-full bg-slate-100 border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-slate-800">
      {/* Visual Tuning Toolbar */}
      <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Real-time Preview Tag */}
          <span className="hidden lg:inline-flex px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider font-space">
            Real-time Preview
          </span>

          {/* Template select */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Sliders size={13} className="text-indigo-600" />
            <select
              value={resume.templateId}
              onChange={(e) => onChangeSettings({ templateId: e.target.value as any })}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id} className="text-slate-800">{t.name}</option>
              ))}
            </select>
          </div>

          {/* Color choice circles */}
          <div className="flex items-center gap-1.5">
            {THEME_COLORS.map((c) => (
              <button
                key={c.primaryHex}
                onClick={() => onChangeSettings({ colorTheme: c.primaryHex })}
                className={`h-5 w-5 rounded-full border transition-all hover:scale-115 cursor-pointer ${
                  resume.colorTheme === c.primaryHex ? 'ring-2 ring-indigo-500 border-white scale-110 shadow-xs' : 'border-slate-200'
                }`}
                style={{ backgroundColor: c.primaryHex }}
                title={c.name}
              />
            ))}
          </div>

          {/* Font settings */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Type size={13} className="text-indigo-600" />
            <select
              value={resume.fontFamily}
              onChange={(e) => onChangeSettings({ fontFamily: e.target.value as any })}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              {FONTS.map(f => (
                <option key={f.id} value={f.id as any} className="text-slate-800">{f.name}</option>
              ))}
            </select>
          </div>

          {/* Spacing density settings */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <AlignJustify size={13} className="text-indigo-600" />
            <select
              value={resume.spacing}
              onChange={(e) => onChangeSettings({ spacing: e.target.value as any })}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="compact" className="text-slate-800">Compact Density</option>
              <option value="comfortable" className="text-slate-800">Comfortable</option>
              <option value="spacious" className="text-slate-800">Spacious</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Native Print Fallback */}
          <button
            onClick={handlePrint}
            title="Open browser print dialog for Vector PDF"
            className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-all"
          >
            <Printer size={15} />
          </button>

          {/* Core Client-Side PDF Generation Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs cursor-pointer transition-all ${
              isDownloading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Download & Files Storage Help Notification (Bento Styled) */}
      {downloadStatus !== 'idle' ? (
        <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100/60 flex items-center justify-between text-xs text-indigo-950 transition-all font-medium no-print">
          <div className="flex items-center gap-2.5">
            {downloadStatus === 'generating' && (
              <>
                <div className="h-4 w-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                <span>Generating high-fidelity document package...</span>
              </>
            )}
            {downloadStatus === 'success' && (
              <>
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Download Initiated!</strong> Your professional resume is saved to your device's <strong>Downloads/Files</strong> folder.
                  <span className="hidden sm:inline"> If blocked by your browser preview frame, please use the 🖨️ Printer icon to print/save as PDF.</span>
                </span>
              </>
            )}
            {downloadStatus === 'error' && (
              <>
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <span>Direct export restricted. Opening native print dialog — choose 'Save as PDF' to save to your files.</span>
              </>
            )}
          </div>
          <button
            onClick={() => setDownloadStatus('idle')}
            className="text-indigo-400 hover:text-indigo-700 p-1 rounded-lg hover:bg-indigo-100/50 cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        isInIframe && (
          <div className="px-5 py-3.5 bg-amber-50/95 border-b border-amber-200/60 text-xs text-amber-900 transition-all no-print">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="font-bold leading-normal">
                  ⚠️ AI Studio Preview detected: Browser security may block direct programmatical downloads inside the preview frame.
                </p>
                <div className="text-[11px] text-amber-800 leading-relaxed space-y-1">
                  <p>
                    <strong>👉 Option 1 (Recommended & Easiest):</strong> Click the 🖨️ <strong>Print (ప్రింట్) icon</strong> in the toolbar above, then select <strong>"Save as PDF"</strong> (సేవ్ యాస్ పిడిఎఫ్) as your destination. This generates a perfect vector PDF instantly!
                  </p>
                  <p>
                    <strong>👉 Option 2:</strong> Click the <strong>"Open in New Tab"</strong> button at the top-right of your Google AI Studio editor, then click <strong>Download PDF</strong>. This will instantly download the file directly to your system's Downloads folder!
                  </p>
                  <p className="pt-1 text-[11px] border-t border-amber-200/40 text-amber-700 font-mono">
                    తెలుగు సహాయం: ప్రివ్యూ ఫ్రేమ్ లో ఉన్నప్పుడు డైరెక్ట్ డౌన్‌లోడ్ బ్లాక్ అవ్వచ్చు. కాబట్టి 🖨️ ప్రింటర్ బటన్ క్లిక్ చేసి 'Save as PDF' ఆప్షన్ ద్వారా సులభంగా పిడిఎఫ్ ఫైల్ డౌన్‌లోడ్ చేసుకోండి లేదా పైనున్న 'Open in New Tab' క్లిక్ చేయండి.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Actual Scrollable Resume Preview Board */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200/50 flex justify-center items-start shadow-inner">
        {/* The paper wrapper styled for printing as well */}
        <div
          ref={printRef}
          id="printable-resume-paper"
          className={`w-full max-w-[800px] bg-white text-slate-800 shadow-xl border border-slate-200/60 min-h-[1050px] font-sans flex flex-col transition-all duration-300 ${getFontClass()}`}
          style={{ letterSpacing: '-0.01em' }}
        >
          {/* TEMPLATE RENDERINGS */}

          {/* 1. EXECUTIVE MINIMALIST */}
          {resume.templateId === 'minimalist' && (
            <div className={`flex flex-col h-full ${getMarginClass()}`}>
              {/* Header */}
              <div className="text-center space-y-2 pb-4 border-b border-slate-200">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                  {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                {personalInfo.title && (
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500" style={{ color: resume.colorTheme }}>
                    {personalInfo.title}
                  </p>
                )}
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 font-medium">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.website && (
                    <a href={personalInfo.website} className="hover:underline font-semibold" style={{ color: resume.colorTheme }}>
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                  {personalInfo.github && <span>{personalInfo.github}</span>}
                </div>
              </div>

              {/* Sections list in order */}
              <div className={`flex-1 ${getSpacingClass()}`}>
                {resume.sectionOrder.map((secId) => renderSection(secId, false))}
              </div>
            </div>
          )}

          {/* 2. MODERN COLUMNS */}
          {resume.templateId === 'modern' && (
            <div className="flex flex-1 h-full min-h-[1050px] flex-col md:flex-row">
              {/* Left Column (Sidebar) */}
              <div className="w-full md:w-1/3 text-white p-6 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-slate-100 shrink-0 select-none printable-sidebar" style={{ backgroundColor: resume.colorTheme }}>
                <div className="space-y-1.5">
                  <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight">
                    {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
                  </h1>
                  {personalInfo.title && (
                    <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                      {personalInfo.title}
                    </p>
                  )}
                </div>

                <div className="h-[1px] bg-white/20" />

                {/* Left side details */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-2.5">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Contact</h3>
                    <div className="space-y-1.5 text-white/90">
                      {personalInfo.email && <p className="truncate">✉ {personalInfo.email}</p>}
                      {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
                      {personalInfo.location && <p>📍 {personalInfo.location}</p>}
                      {personalInfo.website && (
                        <p className="truncate">
                          🔗{' '}
                          <a href={personalInfo.website} className="hover:underline text-white font-bold">
                            {personalInfo.website.replace(/^https?:\/\//, '')}
                          </a>
                        </p>
                      )}
                      {personalInfo.linkedin && <p className="truncate">in: {personalInfo.linkedin}</p>}
                      {personalInfo.github && <p className="truncate">gh: {personalInfo.github}</p>}
                    </div>
                  </div>

                  {/* Skills (sidebar) */}
                  {resume.skills.some(g => g.skills.length > 0) && (
                    <div className="space-y-2.5">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Core Expertise</h3>
                      <div className="space-y-3">
                        {resume.skills.filter(g => g.skills.length > 0).map((g) => (
                          <div key={g.id}>
                            <h4 className="text-[9px] font-bold uppercase tracking-wide text-white/70 mb-1">{g.category}</h4>
                            <div className="flex flex-wrap gap-1">
                              {g.skills.map((s) => (
                                <span key={s} className="px-1.5 py-0.5 rounded bg-white/10 text-white font-medium text-[10px]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications (sidebar) */}
                  {resume.certifications.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Credentials</h3>
                      <div className="space-y-2 text-[11px] text-white/85">
                        {resume.certifications.map((c) => (
                          <div key={c.id}>
                            <p className="font-bold">{c.name}</p>
                            <p className="text-[10px] text-white/65">{c.issuer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (Primary details) */}
              <div className={`flex-1 flex flex-col ${getMarginClass()}`}>
                {/* Personal Summary first */}
                {personalInfo.summary && (
                  <div className="space-y-1.5">
                    <p className="text-slate-600 text-xs italic leading-relaxed">
                      "{personalInfo.summary}"
                    </p>
                    <div className="h-[1px] bg-slate-100" />
                  </div>
                )}

                {/* Rest of the ordered sections (minus skills & certifications which are sidebar) */}
                <div className={`flex-1 ${getSpacingClass()}`}>
                  {resume.sectionOrder
                    .filter(secId => secId !== 'skills' && secId !== 'certifications' && secId !== 'summary')
                    .map((secId) => renderSection(secId, false))}
                </div>
              </div>
            </div>
          )}

          {/* 3. CREATIVE PULSE */}
          {resume.templateId === 'creative' && (
            <div className={`flex flex-col h-full ${getMarginClass()}`}>
              {/* Header Banner */}
              <div className="flex items-stretch gap-6 border-b pb-5 border-slate-150 relative">
                {/* Little Accent bar */}
                <div className="w-1.5 rounded" style={{ backgroundColor: resume.colorTheme }} />
                <div className="flex-1 space-y-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {personalInfo.firstName} <span style={{ color: resume.colorTheme }}>{personalInfo.lastName}</span>
                  </h1>
                  {personalInfo.title && (
                    <p className="text-sm font-bold tracking-wide uppercase text-slate-500">
                      {personalInfo.title}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold pt-1.5">
                    {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                    {personalInfo.website && (
                      <a href={personalInfo.website} className="underline" style={{ color: resume.colorTheme }}>
                        {personalInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className={`flex-1 ${getSpacingClass()}`}>
                {resume.sectionOrder.map((secId) => renderSection(secId, false))}
              </div>
            </div>
          )}

          {/* 4. COMPACT PROFESSIONAL */}
          {resume.templateId === 'professional' && (
            <div className={`flex flex-col h-full ${getMarginClass()}`} style={{ fontSize: '11px' }}>
              {/* Tiny spacing compact header */}
              <div className="flex justify-between items-end border-b pb-2.5 border-slate-200">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h1>
                  {personalInfo.title && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-550 mt-1" style={{ color: resume.colorTheme }}>
                      {personalInfo.title}
                    </p>
                  )}
                </div>
                <div className="text-right text-[10px] text-slate-500 font-medium space-y-0.5">
                  <p>{personalInfo.email} {personalInfo.phone ? `| ${personalInfo.phone}` : ''}</p>
                  <p>{personalInfo.location} {personalInfo.website ? `| ${personalInfo.website.replace(/^https?:\/\//, '')}` : ''}</p>
                </div>
              </div>

              {/* Compact Sections */}
              <div className="flex-1 space-y-3 mt-2">
                {resume.sectionOrder.map((secId) => renderSection(secId, false))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Minimal vector icons inline
function ExternalLinkIcon() {
  return (
    <svg className="h-2.5 w-2.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
