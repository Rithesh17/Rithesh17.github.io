import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { siteConfig } from '../../../site.config.js';

function loadSkillsJSON() {
  try {
    // First try to load from content folder
    const contentPath = join(process.cwd(), 'content', 'portfolio', 'skills.json');
    if (existsSync(contentPath)) {
      const fileContents = readFileSync(contentPath, 'utf-8');
      return JSON.parse(fileContents);
    }
    // Fallback to src/lib/data for backwards compatibility
    const fallbackPath = join(process.cwd(), 'src', 'lib', 'data', 'skills.json');
    if (existsSync(fallbackPath)) {
      const fileContents = readFileSync(fallbackPath, 'utf-8');
      return JSON.parse(fileContents);
    }
    return { categories: [] };
  } catch (error) {
    // Silently return empty skills if file cannot be loaded
    return { categories: [] };
  }
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
    featured: content.metadata.featured || false
  }));

  // Load education from markdown files
  const educationContent = getContentByDirectory('portfolio/education') || [];
  const education = educationContent.map(content => ({
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
    featured: content.metadata.featured || false
  })).sort((a, b) => {
    // Sort by startDate in reverse chronological order (most recent first)
    const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
    const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
    return dateB - dateA;
  });

  // Load featured projects configuration
  let featuredConfig = { featured: [] };
  try {
    const featuredPath = join(process.cwd(), 'content', 'portfolio', 'projects', 'featured.json');
    if (existsSync(featuredPath)) {
      const data = readFileSync(featuredPath, 'utf-8');
      featuredConfig = JSON.parse(data);
    }
  } catch (e) {
    // Silently continue if featured.json cannot be loaded
  }
  
  // Create a map of slug -> { featured, order }
  const featuredMap = new Map();
  featuredConfig.featured.forEach(item => {
    featuredMap.set(item.slug, { featured: true, order: item.order });
  });

  // Load projects from markdown files
  const projectsContent = getContentByDirectory('portfolio/projects') || [];
  const projects = projectsContent.map(content => {
    // Extract slug from URL (e.g., "/portfolio/projects/openvino-go" -> "openvino-go")
    const slug = content.url.split('/').pop();
    const featuredInfo = featuredMap.get(slug) || { featured: false, order: 999 };
    
    return {
      id: content.metadata.timelineHash || content.url,
      title: content.metadata.title,
      description: content.metadata.description,
      category: content.metadata.category,
      technologies: content.metadata.technologies || [],
      image: content.metadata.thumbnail,
      liveUrl: content.metadata.liveUrl,
      githubUrl: content.metadata.githubUrl,
      featured: featuredInfo.featured,
      order: featuredInfo.order,
      date: content.metadata.date,
      status: content.metadata.status,
      tags: content.metadata.tags || [],
      markdownPath: content.url,
      content: content.content // Include full markdown content for extended descriptions
    };
  });

  // Load skills from JSON (kept as JSON since it's structured data)
  const skills = loadSkillsJSON();

  // Load repositories
  let repositories = [];
  try {
    const reposPath = resolve('static/repositories.json');
    if (existsSync(reposPath)) {
      const data = readFileSync(reposPath, 'utf-8');
      repositories = JSON.parse(data);
    }
  } catch (e) {
    // Silently continue if repositories.json cannot be loaded
  }

  // Load contributions
  let contributions = null;
  try {
    const contribPath = resolve('static/contributions.json');
    if (existsSync(contribPath)) {
      const data = readFileSync(contribPath, 'utf-8');
      contributions = JSON.parse(data);
    }
  } catch (e) {
    // Silently continue if contributions.json cannot be loaded
  }

  return {
    experience,
    education,
    projects,
    skills,
    repositories,
    contributions,
    siteConfig,
    profile: siteConfig.profile,
    features: siteConfig.features
  };
}

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
