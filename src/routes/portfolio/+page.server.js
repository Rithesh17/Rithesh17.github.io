import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { siteConfig } from '../../../site.config.js';

function loadSkillsJSON() {
  try {
    const filePath = join(process.cwd(), 'src', 'lib', 'data', 'skills.json');
    const fileContents = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading skills.json:', error);
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
  }));

  // Load projects from markdown files
  const projectsContent = getContentByDirectory('portfolio/projects') || [];
  const projects = projectsContent.map(content => ({
    id: content.metadata.timelineHash || content.url,
    title: content.metadata.title,
    description: content.metadata.description,
    category: content.metadata.category,
    technologies: content.metadata.technologies || [],
    image: content.metadata.thumbnail,
    liveUrl: content.metadata.liveUrl,
    githubUrl: content.metadata.githubUrl,
    featured: content.metadata.featured || false,
    date: content.metadata.date,
    tags: content.metadata.tags || [],
    markdownPath: content.url
  }));

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
    console.warn('Could not load repositories.json:', e);
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
    console.warn('Could not load contributions.json:', e);
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
