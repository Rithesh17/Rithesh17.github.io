import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { siteConfig } from '../../../../site.config.js';

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
  const skills = loadSkillsJSON();

  return {
    skills,
    siteConfig
  };
}
