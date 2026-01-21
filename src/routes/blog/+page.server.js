import { siteConfig } from '../../../site.config.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    siteConfig
  };
}
