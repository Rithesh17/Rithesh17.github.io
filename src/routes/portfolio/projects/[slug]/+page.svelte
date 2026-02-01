<script lang="ts">
  import BlogLayout from '$lib/components/BlogLayout.svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: project = data?.project;
  $: siteConfig = data?.siteConfig;
  $: title = project?.title || 'Project';
  $: description = project?.description || '';
  $: technologies = project?.technologies || [];
  $: githubUrl = project?.githubUrl || '';
  $: liveUrl = project?.liveUrl || '';
  $: date = project?.date;
  $: content = project?.content || '';
  $: category = project?.category || '';
  $: tags = project?.tags || [];
  $: thumbnail = project?.image || project?.thumbnail || '';
  
  $: metadata = [
    ...(date ? [{ label: 'Date', value: new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }] : []),
    ...(category ? [{ label: 'Category', value: category }] : [])
  ];
  
  $: actions = [
    ...(githubUrl ? [{ label: 'View on GitHub', href: githubUrl, icon: 'github' }] : []),
    ...(liveUrl ? [{ label: 'Live Demo', href: liveUrl, icon: 'external' }] : [])
  ];

  $: allKeywords = [...technologies, ...tags, category].filter(Boolean);
  $: publishedTime = date ? new Date(date).toISOString() : '';
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Projects', url: '/portfolio/projects' },
    { name: title, url: $page.url.pathname }
  ];
</script>

<SEO
	siteConfig={siteConfig}
	title={`${title} | Projects`}
	description={description || `Learn more about ${title}, a ${category || 'project'} built with ${technologies.slice(0, 3).join(', ')}`}
	keywords={allKeywords}
	type="article"
	image={thumbnail}
	author={siteConfig?.profile?.name || siteConfig?.site?.author || ''}
	publishedTime={publishedTime}
	canonical={$page.url.pathname}
/>

<StructuredData 
	siteConfig={siteConfig}
	type="Article"
	articleData={{
		title,
		description,
		image: thumbnail,
		author: siteConfig?.profile?.name || siteConfig?.site?.author || '',
		publishedTime,
		keywords: allKeywords
	}}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="project-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  {#if project}
    <BlogLayout
      {title}
      {description}
      {content}
      {metadata}
      tags={[...technologies, ...tags]}
      backUrl="/portfolio/projects"
      backLabel="Back to Projects"
      {actions}
    />
  {:else}
    <section class="error-section">
      <div class="container">
        <p class="error-message">Project not found.</p>
        <a href="/portfolio/projects" class="back-btn">Back to Projects</a>
      </div>
    </section>
  {/if}
</div>

<style>
  .project-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
    padding-top: 2rem;
  }

  /* Ensure particles are behind all content */
  :global(.project-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  :global(.project-page > :global(.blog-article)) {
    position: relative;
    z-index: 1;
  }

  .error-section {
    position: relative;
    z-index: 1;
    padding: 4rem 1rem;
    max-width: 850px;
    margin: 0 auto;
    text-align: center;
  }

  .error-message {
    color: var(--color-muted, #8b949e);
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
</style>
