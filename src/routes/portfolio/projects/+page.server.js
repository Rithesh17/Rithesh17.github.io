import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../site.config.js';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // featured.json is the single source of truth for "importance" - reused here so
  // card size on this page matches card size on the homepage bento grid.
  let featuredConfig = { featured: [] };
  try {
    const featuredPath = join(process.cwd(), 'content', 'portfolio', 'projects', 'featured.json');
    if (existsSync(featuredPath)) {
      featuredConfig = JSON.parse(readFileSync(featuredPath, 'utf-8'));
    }
  } catch (e) {
    // ignore
  }
  const importanceMap = new Map();
  featuredConfig.featured.forEach((item) => importanceMap.set(item.slug, item));

  // Load projects from markdown files
  const projectsContent = getContentByDirectory('portfolio/projects') || [];
  const projects = projectsContent.map(content => {
    const slug = content.url.split('/').pop();
    const importance = importanceMap.get(slug);
    return {
      id: content.metadata.timelineHash || content.url,
      title: content.metadata.title,
      description: content.metadata.description,
      category: content.metadata.category,
      technologies: content.metadata.technologies || [],
      image: content.metadata.thumbnail,
      liveUrl: content.metadata.liveUrl,
      githubUrl: content.metadata.githubUrl,
      featured: content.metadata.featured || false,
      order: importance?.order || 999,
      date: content.metadata.date,
      tags: content.metadata.tags || [],
      markdownPath: content.url,
      content: content.content,
      metadata: content.metadata
    };
  }).sort((a, b) => {
    // Sort by importance (featured.json order), then by date
    if (a.order !== b.order) return a.order - b.order;
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });

  return {
    projects,
    siteConfig
  };
}
