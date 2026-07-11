export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  avatarUrl?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  gpa: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // can contain multiple bullet points separated by newline
}

export interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  technologies: string; // comma-separated or list
  link: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface InternshipEntry {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  category: string; // e.g., "Languages", "Frontend", "Soft Skills"
  skills: string[]; // individual skills in this category
}

export interface ResumeData {
  id: string;
  title: string; // e.g., "My Software Engineer Resume"
  lastUpdated: string;
  templateId: 'minimalist' | 'modern' | 'creative' | 'professional';
  colorTheme: string; // hex or tailwind class
  fontFamily: 'serif' | 'sans' | 'mono' | 'space';
  spacing: 'compact' | 'comfortable' | 'spacious';
  personalInfo: PersonalInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  internships: InternshipEntry[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
  skills: SkillGroup[];
  sectionOrder: string[]; // to allow drag/drop reordering of sections
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  avatarUrl?: string;
  themePreference: 'light' | 'dark';
}

export interface UserSession {
  user: UserProfile | null;
  isLoggedIn: boolean;
}
