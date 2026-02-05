import { getContentDirectories, getContentByDirectory } from 'statue-ssg/cms/content-processor';
import siteConfig from '../../../site.config.js';
import skills from '$lib/data/skills.json';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const directories = getContentDirectories();

  const enhancedDirectories = directories.map(directory => {
    return {
      ...directory
    };
  });

  const experience = getContentByDirectory('portfolio/experience')
    .map(item => ({ ...item.metadata, slug: item.url }))
    .sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());

  const education = getContentByDirectory('portfolio/education')
    .map(item => ({ ...item.metadata, slug: item.url }))
    .sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());

  return {
    directories: enhancedDirectories,
    siteConfig,
    experience,
    education,
    skills
  };
}
