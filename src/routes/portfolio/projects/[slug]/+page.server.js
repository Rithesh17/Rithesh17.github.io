import { getContentByDirectory, getContentByUrl } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../../../site.config.js';
import { error } from '@sveltejs/kit';

// Prerender for production builds
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const slug = params.slug;
  
  // Try to get content by URL first
  const url = `/portfolio/projects/${slug}`;
  let content = getContentByUrl(url);
  
  // If not found by URL, try to find it in the directory
  if (!content) {
    const projectsContent = getContentByDirectory('portfolio/projects') || [];
    content = projectsContent.find(p => {
      const contentSlug = p.url?.split('/').pop()?.replace('.md', '') || 
                         p.url?.split('/').pop() || '';
      return contentSlug === slug;
    });
  }
  
  // If still not found, return 404
  if (!content) {
    throw error(404, {
      message: `Project "${slug}" not found`
    });
  }
  
  // Transform content to project format
  const project = {
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
  };
  
  return {
    project,
    siteConfig
  };
}
