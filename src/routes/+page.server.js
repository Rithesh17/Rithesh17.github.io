import { siteConfig } from '../../site.config.js';
import fs from 'fs';
import path from 'path';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ depends }) {
  // Mark dependencies for cache invalidation
  depends('data:repositories');
  depends('data:contributions');

  // Load repositories from JSON file
  let repositories = [];
  try {
    const reposPath = path.resolve('static/repositories.json');
    if (fs.existsSync(reposPath)) {
      const data = fs.readFileSync(reposPath, 'utf-8');
      repositories = JSON.parse(data);
    }
  } catch (e) {
    // Silently continue if repositories.json cannot be loaded
  }

  // Load contributions from JSON file
  let contributions = null;
  try {
    const contribPath = path.resolve('static/contributions.json');
    if (fs.existsSync(contribPath)) {
      const data = fs.readFileSync(contribPath, 'utf-8');
      contributions = JSON.parse(data);
    }
  } catch (e) {
    // Silently continue if contributions.json cannot be loaded
  }

  return {
    profile: siteConfig.profile,
    features: siteConfig.features,
    site: siteConfig.site,
    repositories,
    contributions
  };
}