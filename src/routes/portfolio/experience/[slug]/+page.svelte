<script lang="ts">
  import BlogLayout from '$lib/components/BlogLayout.svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: experience = data?.experience;
  $: siteConfig = data?.siteConfig;
  $: title = experience?.title || 'Experience';
  $: company = experience?.company || '';
  $: location = experience?.location || '';
  $: startDate = experience?.startDate;
  $: endDate = experience?.endDate;
  $: current = experience?.current || false;
  $: technologies = experience?.technologies || [];
  $: achievements = experience?.achievements || [];
  $: content = experience?.content || '';
  $: type = experience?.type || '';
  
  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  $: description = company ? `${title} at ${company}${location ? ` in ${location}` : ''}` : 'Professional Experience';
  $: fullDescription = `${description}. ${content.substring(0, 150)}...`;
  
  $: metadata = [
    ...(company ? [{ label: 'Company', value: company }] : []),
    ...(location ? [{ label: 'Location', value: location }] : []),
    ...(startDate ? [{
      label: 'Duration',
      value: `${formatDate(startDate)}${endDate ? ` - ${formatDate(endDate)}` : current ? ' - Present' : ''}`
    }] : []),
    ...(type ? [{ label: 'Type', value: type }] : [])
  ];
  
  // Prepend achievements to content if they exist
  $: fullContent = achievements.length > 0
    ? `## Major Achievements\n\n${achievements.map(a => `- ${a}`).join('\n')}\n\n---\n\n${content}`
    : content;

  $: publishedTime = startDate ? new Date(startDate).toISOString() : '';
  $: modifiedTime = endDate && !current ? new Date(endDate).toISOString() : publishedTime;
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Experience', url: '/portfolio/experience' },
    { name: title, url: $page.url.pathname }
  ];
  $: relatedItems = data?.relatedExperience || [];
</script>

<SEO
	siteConfig={siteConfig}
	title={`${title} | Experience`}
	description={fullDescription}
	keywords={[...technologies, company, location, type].filter(Boolean)}
	type="article"
	author={siteConfig?.profile?.name || siteConfig?.site?.author || ''}
	publishedTime={publishedTime}
	modifiedTime={modifiedTime}
	canonical={$page.url.pathname}
/>

<StructuredData 
	siteConfig={siteConfig}
	type="Article"
	articleData={{
		title: `${title} at ${company}`,
		description: fullDescription,
		author: siteConfig?.profile?.name || siteConfig?.site?.author || '',
		publishedTime,
		modifiedTime,
		keywords: [...technologies, company, location].filter(Boolean)
	}}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="experience-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  {#if experience}
    <BlogLayout
      {title}
      {description}
      content={fullContent}
      {metadata}
      tags={technologies}
      backUrl="/portfolio/experience"
      backLabel="Back to Experience"
      portfolioBackUrl="/portfolio"
      portfolioBackLabel="Back to Portfolio"
      actions={[]}
      image=""
      {relatedItems}
      currentUrl={$page.url.href}
    />
  {:else}
    <section class="error-section">
      <div class="container">
        <p class="error-message">Experience entry not found.</p>
        <a href="/portfolio/experience" class="back-btn">Back to Experience</a>
      </div>
    </section>
  {/if}
</div>

<style>
  .experience-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
    padding-top: 2rem;
  }

  /* Ensure particles are behind all content */
  :global(.experience-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  :global(.experience-page > :global(.blog-article)) {
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
