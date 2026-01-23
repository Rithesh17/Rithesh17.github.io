import { getContentByDirectory, getContentByUrl } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../../site.config.js';
import { error } from '@sveltejs/kit';

// Prerender for production builds
export const prerender = true;

// Helper function to extract achievements from markdown content
function extractAchievements(content) {
  const achievements = [];
  const lines = content.split('\n');
  let inAchievementsSection = false;
  
  for (const line of lines) {
    if (line.includes('## Major Achievements') || line.includes('## Achievements')) {
      inAchievementsSection = true;
      continue;
    }
    if (inAchievementsSection && line.startsWith('##')) {
      break;
    }
    if (inAchievementsSection && line.trim().startsWith('-')) {
      achievements.push(line.trim().replace(/^-\s*/, '').replace(/\*\*/g, ''));
    }
  }
  
  return achievements.length > 0 ? achievements : [];
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const slug = params.slug;
  
  // Try to get content by URL first
  const url = `/portfolio/experience/${slug}`;
  let content = getContentByUrl(url);
  
  // If not found by URL, try to find it in the directory
  if (!content) {
    const experienceContent = getContentByDirectory('portfolio/experience') || [];
    content = experienceContent.find(exp => {
      const contentSlug = exp.url?.split('/').pop()?.replace('.md', '') || 
                         exp.url?.split('/').pop() || '';
      return contentSlug === slug;
    });
  }
  
  // If still not found, return 404
  if (!content) {
    throw error(404, {
      message: `Experience entry "${slug}" not found`
    });
  }
  
  // Transform content to experience format
  const experience = {
    id: content.metadata.timelineHash || content.url,
    title: content.metadata.title,
    company: content.metadata.company,
    location: content.metadata.location,
    startDate: content.metadata.startDate,
    endDate: content.metadata.endDate === 'present' ? null : content.metadata.endDate,
    current: content.metadata.endDate === 'present',
    type: content.metadata.type,
    description: content.metadata.description || content.content.split('\n')[0],
    achievements: extractAchievements(content.content),
    technologies: content.metadata.technologies || [],
    featured: content.metadata.featured || false,
    content: content.content,
    metadata: content.metadata,
    markdownPath: content.url
  };
  
  return {
    experience,
    siteConfig
  };
}
