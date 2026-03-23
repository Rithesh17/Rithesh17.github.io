import { redirect } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  redirect(308, '/');
}
