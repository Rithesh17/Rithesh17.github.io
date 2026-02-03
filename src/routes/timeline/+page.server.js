import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../site.config.js';

export async function load() {
  // Load experience from markdown files
  const experienceContent = getContentByDirectory('portfolio/experience') || [];
  const experience = experienceContent.map((content) => ({
    id: content.metadata.timelineHash || content.url,
    title: content.metadata.company || content.metadata.title,
    role: content.metadata.title,
    startDate: content.metadata.startDate,
    endDate: content.metadata.endDate === 'present' ? null : content.metadata.endDate,
    current: content.metadata.endDate === 'present',
    description: content.metadata.description || '',
    technologies: content.metadata.technologies || []
  }));

  // Load education from markdown files
  const educationContent = getContentByDirectory('portfolio/education') || [];
  const education = educationContent.map((content) => ({
    id: content.metadata.timelineHash || content.url,
    title: content.metadata.institution,
    role: content.metadata.degree || content.metadata.title,
    startDate: content.metadata.startDate,
    endDate: content.metadata.endDate,
    description: content.metadata.description || '',
    gpa: content.metadata.gpa,
    honors: content.metadata.honors
  }));

  // Load projects from markdown files
  const projectsContent = getContentByDirectory('portfolio/projects') || [];
  const projects = projectsContent.map((content) => ({
    id: content.metadata.timelineHash || content.url,
    title: content.metadata.title,
    role: content.metadata.title,
    date: content.metadata.date,
    description: content.metadata.description || content.content.split('\n').slice(0, 3).join(' ').substring(0, 150),
    technologies: content.metadata.technologies || [],
    category: content.metadata.category
  }));

  // Transform to timeline items format
  /** @type {Array<{type: string, title: string, role: string, date: string, year: number, hash: string, description: string, color: string, colorVar: string, url?: string}>}}
   */
  const timelineItems = [];

  // Add experience items
  experience.forEach((exp) => {
    if (exp.startDate) {
      const startYear = new Date(exp.startDate).getFullYear();
      const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear();
      const dateStr = exp.current 
        ? `${startYear} - Present` 
        : startYear === endYear 
          ? `${startYear}` 
          : `${startYear} - ${endYear}`;
      
      timelineItems.push({
        type: 'work',
        title: exp.title,
        role: exp.role,
        date: dateStr,
        year: startYear,
        hash: exp.id,
        description: exp.description,
        color: '#238636', // Green
        colorVar: '--color-primary',
        url: `/portfolio/experience/${exp.id.replace('exp-', '')}`
      });
    }
  });

  // Add education items
  education.forEach((edu) => {
    if (edu.startDate) {
      const startYear = new Date(edu.startDate).getFullYear();
      const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : new Date().getFullYear();
      const dateStr = startYear === endYear 
        ? `${startYear}` 
        : `${startYear} - ${endYear}`;
      
      let description = edu.description;
      if (edu.gpa) {
        description = `${description} GPA: ${edu.gpa}${edu.honors ? ' (Honors)' : ''}`;
      }
      
      timelineItems.push({
        type: 'education',
        title: edu.title,
        role: edu.role,
        date: dateStr,
        year: startYear,
        hash: edu.id,
        description: description,
        color: '#58a6ff', // Blue
        colorVar: '--color-primary',
        url: `/portfolio/education/${edu.id.replace('edu-', '')}`
      });
    }
  });

  // Add project items
  projects.forEach((proj) => {
    if (proj.date) {
      const year = new Date(proj.date).getFullYear();
      const dateStr = new Date(proj.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      timelineItems.push({
        type: 'project',
        title: proj.title,
        role: proj.title,
        date: dateStr,
        year: year,
        hash: proj.id,
        description: proj.description,
        color: '#a371f7', // Purple
        colorVar: '--color-secondary',
        url: `/portfolio/projects/${proj.id.replace('proj-', '')}`
      });
    }
  });

  // Sort by year (most recent first, then by start date within same year)
  timelineItems.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year; // Most recent first
    }
    // If same year, sort by date string (handles "Present" and date ranges)
    return a.date.localeCompare(b.date);
  });

  // Calculate year range for timeline
  const years = timelineItems.map(item => item.year);
  const minYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear();
  const maxYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

  return {
    timelineItems,
    yearRange: {
      min: minYear,
      max: maxYear
    },
    siteConfig
  };
}
