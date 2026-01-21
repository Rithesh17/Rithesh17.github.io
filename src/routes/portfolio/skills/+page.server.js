import { readFileSync } from 'fs';
import { join } from 'path';
import { siteConfig } from '../../../../site.config.js';

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
  const skills = loadSkillsJSON();

  return {
    skills,
    siteConfig
  };
}
