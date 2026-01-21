import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../site.config.js';

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
export async function load() {
  // Load experience from markdown files
  const experienceContent = getContentByDirectory('portfolio/experience') || [];
  const experience = experienceContent.map(content => ({
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
    metadata: content.metadata
  })).sort((a, b) => {
    // Sort by start date, most recent first
    const dateA = new Date(a.startDate || 0);
    const dateB = new Date(b.startDate || 0);
    return dateB - dateA;
  });

  return {
    experience,
    siteConfig
  };
}
