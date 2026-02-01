import { getContentByUrl, getContentDirectories, getSidebarTree } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../site.config.js';

// Make this page pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // Add slash to the beginning of the URL
  const url = `/${params.slug}`;

  // Exclude portfolio listing pages (they have their own specific pages)
  // But allow individual portfolio items (e.g., /portfolio/projects/slug, /portfolio/education/slug)
  if (url === '/portfolio/experience' ||
      url === '/portfolio/education' ||
      url === '/portfolio/projects' ||
      url === '/portfolio/skills' ||
      url === '/portfolio/contact') {
    const directories = getContentDirectories();
    return { notFound: true, directories, sidebarItems: [] };
  }
  
  // Disable problematic routes
  if (url.includes('/blog/[slug]') || url.includes('/docs/[slug]')) {
    throw new Error('This route cannot be used');
  }

  // Find content
  const content = getContentByUrl(url);

  // Get folders in content directory for navigation links
  const directories = getContentDirectories();

  // Get sidebar items for docs content
  const isDocsContent = content?.directory?.startsWith('docs') || url.startsWith('/docs');
  const sidebarItems = isDocsContent ? getSidebarTree('docs') : [];

  // If content is not found
  if (!content) {
    // Allow SvelteKit to handle routing
    // If a Svelte component exists, it will be shown, otherwise it will return 404
    return { notFound: true, directories, sidebarItems };
  }

  // Set default author and avatar from site config
  if (content?.metadata) {
    if (siteConfig.profile?.name || siteConfig.site?.author) {
      content.metadata.author = siteConfig.profile?.name || siteConfig.site?.author;
    }
    
    if (siteConfig.profile?.avatarUrl || siteConfig.blog?.defaultAuthorAvatar) {
      content.metadata.authorAvatar = siteConfig.profile?.avatarUrl || siteConfig.blog?.defaultAuthorAvatar || '/avatar.jpg';
    }
  }

  // Return content
  return {
    content,
    directories,
    sidebarItems,
    defaultAuthorAvatar: siteConfig.profile?.avatarUrl || siteConfig.blog?.defaultAuthorAvatar || '/avatar.jpg'
  };
}
