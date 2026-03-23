import { loadPortfolioData } from '$lib/server/portfolio-load.js';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return loadPortfolioData();
}
