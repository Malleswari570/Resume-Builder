import { ResumeData } from './types';

export const THEME_COLORS = [
  { name: 'Classic Slate', class: 'bg-slate-800 text-white', primaryHex: '#1e293b', accentClass: 'text-slate-800 border-slate-800' },
  { name: 'Ocean Blue', class: 'bg-blue-600 text-white', primaryHex: '#2563eb', accentClass: 'text-blue-600 border-blue-600' },
  { name: 'Teal Forest', class: 'bg-teal-600 text-white', primaryHex: '#0d9488', accentClass: 'text-teal-600 border-teal-600' },
  { name: 'Emerald Growth', class: 'bg-emerald-600 text-white', primaryHex: '#059669', accentClass: 'text-emerald-600 border-emerald-600' },
  { name: 'Indigo Dream', class: 'bg-indigo-600 text-white', primaryHex: '#4f46e5', accentClass: 'text-indigo-600 border-indigo-600' },
  { name: 'Violet Creative', class: 'bg-purple-600 text-white', primaryHex: '#9333ea', accentClass: 'text-purple-600 border-purple-600' },
  { name: 'Crimson Bold', class: 'bg-rose-600 text-white', primaryHex: '#e11d48', accentClass: 'text-rose-600 border-rose-600' },
];

export const FONTS = [
  { id: 'sans', name: 'Inter (Sans)', class: 'font-sans' },
  { id: 'serif', name: 'Merriweather (Serif)', class: 'font-serif' },
  { id: 'mono', name: 'JetBrains Mono (Mono)', class: 'font-mono' },
  { id: 'space', name: 'Space Grotesk (Tech)', class: 'font-space' },
];

export const TEMPLATES = [
  {
    id: 'minimalist',
    name: 'Executive Minimal',
    description: 'A traditional, elegant black-and-white serif layout. Perfect for finance, consulting, and formal business roles.',
    image: '📊',
  },
  {
    id: 'modern',
    name: 'Modern Tech Column',
    description: 'Sleek two-column design with a distinct sidebar for skills and personal info. Tailored for software engineers and product managers.',
    image: '💻',
  },
  {
    id: 'creative',
    name: 'Creative Pulse',
    description: 'Vibrant and expressive, using modern accent shapes, clean spacing, and modern typography to stand out in creative industries.',
    image: '🎨',
  },
  {
    id: 'professional',
    name: 'Compact Professional',
    description: 'High-density, structured single-column design with elegant dividing lines, optimized to cram maximum achievements into a single page.',
    image: '💼',
  },
];

export const BLANK_RESUME_DATA = (id: string, title: string = 'My Resume'): ResumeData => ({
  id,
  title,
  lastUpdated: new Date().toISOString(),
  templateId: 'modern',
  colorTheme: '#2563eb',
  fontFamily: 'sans',
  spacing: 'comfortable',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  internships: [],
  certifications: [],
  achievements: [],
  skills: [
    { id: '1', category: 'Technical Skills', skills: [] },
    { id: '2', category: 'Soft Skills', skills: [] },
  ],
  sectionOrder: ['personalInfo', 'summary', 'experience', 'projects', 'education', 'skills', 'internships', 'certifications', 'achievements'],
});

export const SAMPLE_RESUME_DATA: ResumeData = {
  id: 'sample-resume',
  title: 'Alex Mercer - Lead Full Stack Engineer',
  lastUpdated: new Date().toISOString(),
  templateId: 'modern',
  colorTheme: '#4f46e5', // Indigo
  fontFamily: 'sans',
  spacing: 'comfortable',
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Mercer',
    email: 'alex.mercer@dev.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    title: 'Lead Full Stack Engineer',
    website: 'https://alexmercer.dev',
    linkedin: 'linkedin.com/in/alex-mercer',
    github: 'github.com/alexmercer',
    summary: 'Innovative and performance-driven Lead Full Stack Engineer with over 6 years of experience building scalable, cloud-native web applications. Proven track record of improving site reliability by 35% and leading agile engineering teams of 8+ members. Expert in React, Node.js, and modern distributed systems.',
  },
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2016-09',
      endDate: '2020-05',
      current: false,
      location: 'Berkeley, CA',
      gpa: '3.82 / 4.00',
      description: 'Graduated with Honors. Recipient of Regents and Chancellor\'s Scholarship. Active member of Computer Science Undergraduate Association.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Synthetix Cloud Solutions',
      role: 'Lead Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-10',
      endDate: '',
      current: true,
      description: 'Architected and built a micro-frontend design system using React and Vite, reducing page load latency by 42% across 14 commercial applications.\nLed a team of 6 engineers to migrate legacy monoliths into AWS Lambda microservices, saving $120k annually in server overhead.\nSpearheaded real-time workspace collaboration features using WebSockets and conflict-free replicated data types (CRDTs).',
    },
    {
      id: 'exp-2',
      company: 'InnovateTech Systems',
      role: 'Senior Frontend Engineer',
      location: 'Oakland, CA',
      startDate: '2020-06',
      endDate: '2022-09',
      current: false,
      description: 'Developed critical analytics dashboards handling millions of concurrent metric events daily.\nMentored 4 junior engineers on React performance optimization techniques and automated testing frameworks.\nConfigured CI/CD pipelines using GitHub Actions, decreasing deployment failure rates by 28%.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniDocs - Markdown Collaboration Platform',
      role: 'Creator & Lead Maintainer',
      technologies: 'React, Tailwind CSS, TypeScript, Socket.io',
      link: 'https://github.com/alexmercer/omnidocs',
      startDate: '2023-01',
      endDate: '2023-08',
      current: false,
      description: 'A lightning-fast real-time collaborative markdown editor and notes dashboard. Supports offline synchronization and secure client-side encryption. Acquired over 2,500 GitHub stars within the first 3 months of launch.',
    },
    {
      id: 'proj-2',
      name: 'EcoRoute - Carbon Offset Navigator',
      role: 'Full Stack Contributor',
      technologies: 'Next.js, Python, FastAPI, Google Maps API',
      link: 'https://ecoroute.app',
      startDate: '2021-11',
      endDate: '2022-02',
      current: false,
      description: 'An AI-powered routing engine that calculates travel routes based on estimated carbon emissions. Integrates seamlessly with Uber and Lime API sandboxes for local commuter offset purchases.',
    },
  ],
  internships: [
    {
      id: 'int-1',
      organization: 'Redwood Software Labs',
      role: 'Frontend Engineering Intern',
      startDate: '2019-06',
      endDate: '2019-09',
      current: false,
      description: 'Implemented standard design components in TypeScript and compiled internal npm packages. Added unit test suites to the primary client onboarding flow, boosting test coverage from 45% to 80%.',
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2023-04',
      expiryDate: '2026-04',
      credentialId: 'AWS-SAP-8921',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'The Linux Foundation',
      issueDate: '2021-12',
      expiryDate: '2024-12',
      credentialId: 'CKA-552-1109',
      credentialUrl: 'https://training.linuxfoundation.org',
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Winner - UC Berkeley Hackathon (Best Overall App)',
      issuer: 'Cal Hacks Executive Committee',
      date: '2019-10',
      description: 'Spearheaded a 4-person team to build a peer-to-peer safety notification system utilizing decentralized mesh networking, beating 180+ teams.',
    },
    {
      id: 'ach-2',
      title: 'Innovator of the Quarter',
      issuer: 'Synthetix Cloud Labs',
      date: '2024-03',
      description: 'Recognized for building a serverless automated scaling engine that automatically mitigated high-traffic outages.',
    }
  ],
  skills: [
    {
      id: 'sk-1',
      category: 'Languages & Core',
      skills: ['TypeScript', 'JavaScript', 'Python', 'HTML5', 'CSS3/Sass', 'SQL', 'GraphQL', 'Go']
    },
    {
      id: 'sk-2',
      category: 'Frameworks & Libraries',
      skills: ['React', 'Next.js', 'Node.js/Express', 'FastAPI', 'Tailwind CSS', 'Redux', 'Zustand', 'Socket.io']
    },
    {
      id: 'sk-3',
      category: 'Tools & Infrastructure',
      skills: ['Docker', 'Kubernetes', 'AWS (Lambda, S3, RDS)', 'Git/GitHub', 'CI/CD Pipelines', 'Vite/Webpack', 'Jest']
    }
  ],
  sectionOrder: ['personalInfo', 'summary', 'experience', 'projects', 'education', 'skills', 'internships', 'certifications', 'achievements'],
};
