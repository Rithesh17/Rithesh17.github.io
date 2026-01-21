import { getContentByDirectory } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../site.config.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
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
    markdownPath: content.url,
    content: content.content,
    metadata: content.metadata
  })).sort((a, b) => {
    // Sort featured first, then by date
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });

  return {
    projects,
    siteConfig
  };
}
