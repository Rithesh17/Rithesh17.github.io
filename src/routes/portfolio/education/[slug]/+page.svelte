<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import { ContentBody } from 'statue-ssg';
  import Particles from '$lib/animations/Particles.svelte';
  
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
</script>

<svelte:head>
  <title>{title} | Education | Portfolio | {siteConfig?.site?.name || 'Portfolio'}</title>
  <meta name="description" content={education?.description || `Education at ${institution}`} />
</svelte:head>

<div class="education-page">
  <Particles className="absolute inset-0" refresh={true} />
  
  <div class="back-nav">
    <a href="/portfolio/education" class="back-btn">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Back to Education
    </a>
    <a href="/portfolio" class="back-btn portfolio-btn">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
      Back to Portfolio
    </a>
  </div>
  
  <PageHero
    title={title}
    description={institution ? `at ${institution}` : 'Academic Background'}
  />
  
  {#if education}
    <section class="education-section">
      <div class="container">
        <div class="education-header">
          <div class="education-meta">
            {#if institution}
              <div class="meta-item">
                <span class="meta-label">Institution:</span>
                <span class="meta-value">{institution}</span>
              </div>
            {/if}
            {#if field}
              <div class="meta-item">
                <span class="meta-label">Field:</span>
                <span class="meta-value">{field}</span>
              </div>
            {/if}
            {#if location}
              <div class="meta-item">
                <span class="meta-label">Location:</span>
                <span class="meta-value">{location}</span>
              </div>
            {/if}
            {#if startDate}
              <div class="meta-item">
                <span class="meta-label">Duration:</span>
                <span class="meta-value">
                  {formatDate(startDate)}
                  {#if endDate}
                    - {formatDate(endDate)}
                  {/if}
                </span>
              </div>
            {/if}
            {#if gpa}
              <div class="meta-item">
                <span class="meta-label">GPA:</span>
                <span class="meta-value">{gpa}{gpaScale ? ` / ${gpaScale}` : ''}</span>
              </div>
            {/if}
            {#if honors.length > 0}
              <div class="meta-item">
                <span class="meta-label">Honors:</span>
                <span class="meta-value">{honors.join(', ')}</span>
              </div>
            {/if}
          </div>
        </div>
        
        {#if courses.length > 0}
          <div class="courses">
            <h3 class="section-title">Key Coursework</h3>
            <ul class="courses-list">
              {#each courses as course}
                <li class="course-item">{course}</li>
              {/each}
            </ul>
          </div>
        {/if}
        
        <div class="education-content">
          <ContentBody content={content} />
        </div>
        
        <div class="back-link">
          <a href="/portfolio/education" class="back-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Education
          </a>
          <a href="/portfolio" class="back-btn portfolio-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Back to Portfolio
          </a>
        </div>
      </div>
    </section>
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
  }

  /* Ensure particles are behind all content */
  :global(.education-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
  }

  .education-section {
    padding: 4rem 1rem;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .education-header {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .education-meta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .meta-item {
    display: flex;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .meta-label {
    color: var(--color-muted, #8b949e);
    font-weight: 500;
  }

  .meta-value {
    color: var(--color-foreground, #d0d0d0);
  }

  .courses {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .courses-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .course-item {
    padding: 0.75rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--color-foreground, #c9d1d9);
    line-height: 1.6;
  }

  .course-item::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--color-primary, #e0e0e0);
  }

  .education-content {
    margin-bottom: 3rem;
    line-height: 1.7;
  }

  .education-content :global(h1),
  .education-content :global(h2),
  .education-content :global(h3) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--color-foreground, #d0d0d0);
  }

  .education-content :global(p) {
    margin-bottom: 1rem;
    color: var(--color-foreground, #c9d1d9);
  }

  .education-content :global(ul),
  .education-content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .education-content :global(li) {
    margin-bottom: 0.5rem;
    color: var(--color-foreground, #c9d1d9);
  }

  .back-link {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .back-link.top-nav {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .back-link:not(.top-nav) {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
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

  .back-btn .icon {
    width: 18px;
    height: 18px;
  }

  .back-btn:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .portfolio-btn {
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
  }

  .portfolio-btn:hover {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
  }

  .back-nav {
    position: relative;
    z-index: 1;
    padding: 2rem 1rem 0;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .error-section {
    padding: 4rem 1rem;
  }

  .error-message {
    text-align: center;
    color: var(--color-muted, #8b949e);
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .back-link {
      flex-direction: column;
    }

    .back-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
