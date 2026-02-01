<script lang="ts">
  import BlogLayout from '$lib/components/BlogLayout.svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: education = data?.education;
  $: siteConfig = data?.siteConfig;
  $: title = education?.degree || 'Education';
  $: institution = education?.institution || '';
  $: location = education?.location || '';
  $: field = education?.field || '';
  $: startDate = education?.startDate;
  $: endDate = education?.endDate;
  $: gpa = education?.gpa;
  $: gpaScale = education?.gpaScale;
  $: honors = education?.honors || [];
  $: courses = education?.relevantCourses || [];
  $: content = education?.content || '';
  
  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  $: description = institution ? `${title} from ${institution}${location ? ` in ${location}` : ''}` : 'Academic Background';
  $: fullDescription = `${description}. ${content.substring(0, 150)}...`;
  
  $: metadata = [
    ...(institution ? [{ label: 'Institution', value: institution }] : []),
    ...(field ? [{ label: 'Field', value: field }] : []),
    ...(location ? [{ label: 'Location', value: location }] : []),
    ...(startDate ? [{
      label: 'Duration',
      value: `${formatDate(startDate)}${endDate ? ` - ${formatDate(endDate)}` : ''}`
    }] : []),
    ...(gpa ? [{ label: 'GPA', value: `${gpa}${gpaScale ? ` / ${gpaScale}` : ''}` }] : []),
    ...(honors.length > 0 ? [{ label: 'Honors', value: honors.join(', ') }] : [])
  ];
  
  // Prepend courses to content if they exist
  $: fullContent = courses.length > 0
    ? `## Key Coursework\n\n${courses.map(c => `- ${c}`).join('\n')}\n\n---\n\n${content}`
    : content;

  $: publishedTime = startDate ? new Date(startDate).toISOString() : '';
  $: modifiedTime = endDate ? new Date(endDate).toISOString() : publishedTime;
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Education', url: '/portfolio/education' },
    { name: title, url: $page.url.pathname }
  ];
  $: relatedItems = data?.relatedEducation || [];
</script>

<SEO
	siteConfig={siteConfig}
	title={`${title} | Education`}
	description={fullDescription}
	keywords={[field, institution, location, 'education', 'academic'].filter(Boolean)}
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
		title: `${title} from ${institution}`,
		description: fullDescription,
		author: siteConfig?.profile?.name || siteConfig?.site?.author || '',
		publishedTime,
		modifiedTime,
		keywords: [field, institution, location].filter(Boolean)
	}}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="education-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  {#if education}
    <BlogLayout
      {title}
      {description}
      content={fullContent}
      {metadata}
      tags={[]}
      backUrl="/portfolio/education"
      backLabel="Back to Education"
      actions={[]}
      image=""
      {relatedItems}
      currentUrl={$page.url.href}
    />
  {:else}
    <section class="error-section">
      <div class="container">
        <p class="error-message">Education entry not found.</p>
        <a href="/portfolio/education" class="back-btn">Back to Education</a>
      </div>
    </section>
  {/if}
</div>

<style>
  .education-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
    padding-top: 2rem;
  }

  /* Ensure particles are behind all content */
  :global(.education-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  :global(.education-page > :global(.blog-article)) {
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
