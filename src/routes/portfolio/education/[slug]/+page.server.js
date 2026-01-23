import { getContentByDirectory, getContentByUrl } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../../site.config.js';
import { error } from '@sveltejs/kit';

// Prerender for production builds
export const prerender = true;

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
export async function load({ params }) {
  const slug = params.slug;
  
  // Try to get content by URL first
  const url = `/portfolio/education/${slug}`;
  let content = getContentByUrl(url);
  
  // If not found by URL, try to find it in the directory
  if (!content) {
    const educationContent = getContentByDirectory('portfolio/education') || [];
    content = educationContent.find(edu => {
      const contentSlug = edu.url?.split('/').pop()?.replace('.md', '') || 
                         edu.url?.split('/').pop() || '';
      return contentSlug === slug;
    });
  }
  
  // If still not found, return 404
  if (!content) {
    throw error(404, {
      message: `Education entry "${slug}" not found`
    });
  }
  
  // Transform content to education format
  const education = {
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
    markdownPath: content.url
  };
  
  return {
    education,
    siteConfig
  };
}
