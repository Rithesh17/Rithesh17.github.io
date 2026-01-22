import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../site.config.js';

// Helper function to extract courses from markdown content
function extractCourses(content) {
  const courses = [];
  const lines = content.split('\n');
  let inCoursesSection = false;
  
  for (const line of lines) {
    if (line.includes('## Coursework') || line.includes('## Key Coursework')) {
      inCoursesSection = true;
      continue;
    }
    if (inCoursesSection && line.startsWith('##')) {
      break;
    }
    if (inCoursesSection && line.trim().startsWith('-')) {
      courses.push(line.trim().replace(/^-\s*/, ''));
    }
  }
  
  return courses;
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Load education from markdown files
  const educationContent = getContentByDirectory('portfolio/education') || [];
  const education = educationContent.map(content => {
    // Extract slug from content.url (e.g., /portfolio/education/nitk-btech)
    const urlSlug = content.url ? content.url.split('/').pop() : null;
    
    return {
      id: content.metadata.timelineHash || content.url,
      degree: content.metadata.degree,
      field: content.metadata.field || 'Computer Science',
      institution: content.metadata.institution,
      location: content.metadata.location,
      startDate: content.metadata.startDate,
      endDate: content.metadata.endDate,
      gpa: content.metadata.gpa,
      gpaScale: content.metadata.gpaScale,
      honors: content.metadata.honors ? (Array.isArray(content.metadata.honors) ? content.metadata.honors : [content.metadata.honors]) : [],
      relevantCourses: extractCourses(content.content),
      featured: content.metadata.featured || false,
      content: content.content,
      metadata: content.metadata,
      markdownPath: content.url, // Full path like /portfolio/education/nitk-btech
      slug: urlSlug // Just the slug part for easier access
    };
  }).sort((a, b) => {
    // Sort by end date, most recent first
    const dateA = new Date(a.endDate || 0);
    const dateB = new Date(b.endDate || 0);
    return dateB - dateA;
  });

  return {
    education,
    siteConfig
  };
}
