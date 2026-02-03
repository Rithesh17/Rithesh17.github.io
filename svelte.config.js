import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import fs from 'fs';

// Function to get all project slugs for prerendering
function getProjectEntries() {
  const projectsDir = path.resolve('./content/portfolio/projects');
  const entries = [];
  
  try {
    if (fs.existsSync(projectsDir)) {
      const files = fs.readdirSync(projectsDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          entries.push(`/portfolio/projects/${slug}`);
        }
      });
    }
  } catch (e) {
    console.warn('Could not read projects directory for prerender entries:', e);
  }
  
  return entries;
}

// Function to get all experience slugs for prerendering
function getExperienceEntries() {
  const experienceDir = path.resolve('./content/portfolio/experience');
  const entries = [];
  
  try {
    if (fs.existsSync(experienceDir)) {
      const files = fs.readdirSync(experienceDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          entries.push(`/portfolio/experience/${slug}`);
        }
      });
    }
  } catch (e) {
    console.warn('Could not read experience directory for prerender entries:', e);
  }
  
  return entries;
}

// Function to get all education slugs for prerendering
function getEducationEntries() {
  const educationDir = path.resolve('./content/portfolio/education');
  const entries = [];
  
  try {
    if (fs.existsSync(educationDir)) {
      const files = fs.readdirSync(educationDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          entries.push(`/portfolio/education/${slug}`);
        }
      });
    }
  } catch (e) {
    console.warn('Could not read education directory for prerender entries:', e);
  }
  
  return entries;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Using vitePreprocess for preprocessor
  preprocess: vitePreprocess(),

  kit: {
    // Static site generator
    adapter: adapter({
      // Static site output folder
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // Using index.html instead of null for a real static site
      precompress: false,
      strict: false // Set to false to include non-prerendered routes via fallback
    }),
    
    // Custom alias defined to handle the content folder
    alias: {
      $content: path.resolve('./content'),
      $lib: path.resolve('./src/lib')
    },
    
    // Static site pre-processing options
    prerender: {
      crawl: true,
      entries: [
        '/',
        '/about',
        '/portfolio',
        '/portfolio/experience',
        '/portfolio/education',
        '/portfolio/projects',
        '/portfolio/skills',
        '/portfolio/contact',
        '/photography',
        '/blog',
        '/timeline',
        // Add all project, experience, and education pages dynamically
        ...getProjectEntries(),
        ...getExperienceEntries(),
        ...getEducationEntries()
      ],
      handleHttpError: 'warn',
      handleUnseenRoutes: 'ignore'
    }
  }
};

export default config; 