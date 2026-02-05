<script lang="ts">
  import { ContentBody } from 'statue-ssg';
  import EnhancedContent from '$lib/components/EnhancedContent.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  export let enhancedSections: boolean = false;
  export let flowContent: boolean = false;
  export let showHeroImage: boolean = true;
  export let compactHeader: boolean = false;
  export let showRelatedImages: boolean = true;
  export let company: string = '';
  export let duration: string = '';
  export let location: string = '';
  export let jobType: string = '';
  
  export let title: string;
  export let description: string = '';
  export let content: string = '';
  export let metadata: Array<{ label: string; value: string }> = [];
  export let tags: string[] = [];
  export let backUrl: string;
  export let backLabel: string;
  export let portfolioBackUrl: string = '';
  export let portfolioBackLabel: string = 'Back to Portfolio';
  export let actions: Array<{ label: string; href: string; icon?: string }> = [];
  export let image: string = '';
  export let defaultImage: string = '/blog_thumbnail1.jpg';
  export let relatedItems: Array<{ title: string; url: string; description?: string; image?: string }> = [];
  export let currentUrl: string = '';
  
  // Reading progress
  let scrollProgress = 0;
  let readingTime = 0;
  
  // Table of contents
  let headings: Array<{ id: string; text: string; level: number }> = [];
  let activeHeading = '';
  
  // Share functionality
  let shareUrl = '';
  let shareTitle = '';
  let copySuccess = false;
  
  // Capitalize helper
  function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  // Format metadata value
  function formatValue(value: string): string {
    if (!value) return '';
    // Capitalize category values
    if (value.toLowerCase() === value && value.length < 20) {
      return capitalize(value);
    }
    return value;
  }
  
  // Calculate reading time
  function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const textLength = text.split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
  }
  
  // Extract headings from content
  function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: Array<{ id: string; text: string; level: number }> = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ id, text, level });
    }
    
    return headings;
  }
  
  // Share functions
  function shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }
  
  function shareOnLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }
  
  function shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }
  
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    } catch (err) {
      // Silently handle copy errors
    }
  }
  
  // Scroll handler for progress and active heading
  function handleScroll() {
    if (!browser) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate progress
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    scrollProgress = Math.min(100, Math.max(0, progress));
    
    // Find active heading
    for (let i = headings.length - 1; i >= 0; i--) {
      const element = document.getElementById(headings[i].id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          activeHeading = headings[i].id;
          break;
        }
      }
    }
  }
  
  // Default image - use defaultImage if image is empty or not provided
  // Make sure to use the passed defaultImage prop, not a hardcoded fallback
  // Explicitly depend on both image and defaultImage for reactivity
  // Normalize image paths to ensure they're absolute (start with /)
  // Also check for invalid paths like /projects/ that don't exist in static/
  function normalizeImagePath(path: string): string {
    if (!path) return '';
    const trimmed = path.trim();
    // If path doesn't start with /, it's relative - make it absolute
    if (trimmed && !trimmed.startsWith('/')) {
      return '/' + trimmed;
    }
    return trimmed;
  }
  
  // Check if image path is valid (exists in static folder)
  // Paths like /projects/... don't exist in static/, so use default
  function isValidImagePath(path: string): boolean {
    if (!path) return false;
    // If path starts with /projects/, it's likely invalid (doesn't exist in static/)
    // Only allow paths that are known to exist or are in static root
    if (path.startsWith('/projects/')) {
      return false;
    }
    return true;
  }
  
  $: imageTrimmed = normalizeImagePath(image || '');
  $: isValidImage = isValidImagePath(imageTrimmed);
  // Ensure defaultImage is always a valid string and absolute
  $: finalDefaultImage = normalizeImagePath(defaultImage || '/icon.jpg');
  // Use image only if it's valid, otherwise use defaultImage
  $: heroImage = (imageTrimmed && isValidImage) ? imageTrimmed : finalDefaultImage;
  $: hasImage = !!(imageTrimmed && isValidImage);
  
  // Initialize
  $: if (browser && content) {
    readingTime = calculateReadingTime(content);
    headings = extractHeadings(content);
    shareUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    shareTitle = title;
  }
  
  onMount(() => {
    if (browser) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }
  });
  
  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
    }
  });
  
  // Scroll to heading
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
</script>

<!-- Reading Progress Bar -->
{#if browser}
  <div class="reading-progress">
    <div class="progress-bar" style="width: {scrollProgress}%"></div>
  </div>
{/if}

<article class="blog-article" class:compact-header={compactHeader}>
  <header class="article-header">
    <nav class="article-nav">
      <div class="back-buttons">
        <a href={backUrl} class="back-link">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {backLabel}
        </a>
        {#if portfolioBackUrl}
          <a href={portfolioBackUrl} class="back-btn">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            {portfolioBackLabel}
          </a>
        {/if}
      </div>
    </nav>
    
    {#if compactHeader}
      <!-- Compact Header for Experience Pages -->
      <div class="experience-header">
        <div class="experience-header-main">
          <h1 class="experience-title">{title}</h1>
          
          <div class="experience-company-line">
            {#if company}
              <span class="experience-company">{company}</span>
            {/if}
            {#if duration}
              <span class="experience-duration">{duration}</span>
            {/if}
            {#if jobType}
              <span class="experience-type" class:status-active={jobType.toLowerCase() === 'active'} class:status-completed={jobType.toLowerCase() === 'completed'}>{jobType}</span>
            {/if}
          </div>
          
          {#if location}
            <div class="experience-location">
              <svg class="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {location}
            </div>
          {/if}
        </div>
        
        {#if tags.length > 0}
          <div class="experience-tags">
            {#each tags as tag}
              <span class="experience-tag">{tag}</span>
            {/each}
          </div>
        {/if}
        
        {#if actions.length > 0}
          <div class="experience-actions">
            {#each actions as action}
              <a href={action.href} class="experience-action-btn" target="_blank" rel="noopener noreferrer">
                {#if action.icon === 'github'}
                  <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                  </svg>
                {:else if action.icon === 'external'}
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                {/if}
                {action.label}
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <!-- Standard Header -->
      <div class="header-content">
        <div class="header-main">
          <h1 class="article-title">{title}</h1>
          
          {#if description}
            <p class="article-description">{description}</p>
          {/if}
          
          <div class="header-meta">
            {#if metadata.length > 0}
              <div class="article-meta">
                {#each metadata as item}
                  <div class="meta-item">
                    <span class="meta-label">{item.label}</span>
                    <span class="meta-value">{formatValue(item.value)}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          
          {#if tags.length > 0}
            <div class="article-tags">
              {#each tags as tag}
                <span class="tag">
                  {tag}
                </span>
              {/each}
            </div>
          {/if}
          
          {#if actions.length > 0 || readingTime > 0}
            <div class="article-actions">
              {#if actions.length > 0}
                {#each actions as action}
                  <a href={action.href} class="action-btn" target="_blank" rel="noopener noreferrer">
                    {#if action.icon === 'github'}
                      <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                      </svg>
                    {:else if action.icon === 'external'}
                      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    {/if}
                    {action.label}
                  </a>
                {/each}
              {/if}
              {#if readingTime > 0}
                <div class="reading-time">
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{readingTime} min read</span>
                </div>
              {/if}
            </div>
          {/if}
          
          <!-- Share Buttons -->
          {#if browser}
            <div class="share-buttons">
              <span class="share-label">Share:</span>
              <button class="share-btn" on:click={shareOnTwitter} aria-label="Share on Twitter">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </button>
              <button class="share-btn" on:click={shareOnLinkedIn} aria-label="Share on LinkedIn">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </button>
              <button class="share-btn" on:click={shareOnFacebook} aria-label="Share on Facebook">
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
              </button>
              <button class="share-btn" on:click={copyLink} aria-label="Copy link" class:success={copySuccess}>
                {#if copySuccess}
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                {:else}
                  <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                {/if}
              </button>
            </div>
          {/if}
        </div>
        
        <!-- Table of Contents -->
        {#if headings.length > 0}
          <aside class="table-of-contents">
            <h3 class="toc-title">Contents</h3>
            <nav class="toc-nav">
              {#each headings as heading}
                <a
                  href="#{heading.id}"
                  class="toc-link"
                  class:active={activeHeading === heading.id}
                  style="padding-left: {(heading.level - 1) * 1}rem;"
                  on:click|preventDefault={() => scrollToHeading(heading.id)}
                >
                  {heading.text}
                </a>
              {/each}
            </nav>
          </aside>
        {/if}
      </div>
    {/if}
  </header>
  
  <!-- Hero Image -->
  {#if showHeroImage}
    <div class="hero-image" class:has-custom-image={hasImage}>
      <img src={heroImage} alt={title} loading="lazy" on:error={(e) => { e.currentTarget.src = finalDefaultImage; }} />
    </div>
  {/if}
  
  {#if content}
    <div class="article-content">
      {#if enhancedSections}
        <EnhancedContent {content} />
      {:else if flowContent}
        <EnhancedContent {content} flowMode={true} />
      {:else}
        <ContentBody {content} />
      {/if}
    </div>
  {/if}
  
  <!-- Related Items -->
  {#if relatedItems.length > 0}
    <section class="related-items">
      <h2 class="related-title">Related</h2>
      <div class="related-grid" class:no-images={!showRelatedImages}>
        {#each relatedItems as item}
          {@const itemImageNormalized = normalizeImagePath(item.image || '')}
          {@const itemImageValid = isValidImagePath(itemImageNormalized)}
          {@const itemImageSrc = (itemImageNormalized && itemImageValid) ? itemImageNormalized : finalDefaultImage}
          <a href={item.url} class="related-card" class:compact={!showRelatedImages}>
            {#if showRelatedImages}
              <div class="related-image">
                <img src={itemImageSrc} alt={item.title} loading="lazy" on:error={(e) => { e.currentTarget.src = finalDefaultImage; }} />
              </div>
            {/if}
            <div class="related-content">
              <h3 class="related-card-title">{item.title}</h3>
              {#if item.description}
                <p class="related-description">{item.description}</p>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}
  
  <footer class="article-footer">
    <div class="back-buttons">
      <a href={backUrl} class="back-link">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        {backLabel}
      </a>
      {#if portfolioBackUrl}
        <a href={portfolioBackUrl} class="back-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          {portfolioBackLabel}
        </a>
      {/if}
    </div>
  </footer>
</article>

<style>
  /* Reading Progress Bar */
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1000;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%);
    transition: width 0.1s ease;
  }
  
  .blog-article {
    max-width: 850px;
    margin: 0 auto;
    padding: 2rem 1rem;
    color: var(--color-foreground, #d0d0d0);
    position: relative;
  }
  
  .article-header {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* Hero Image */
  .hero-image {
    width: 100%;
    max-width: 100%;
    height: 300px;
    margin: 0 0 3rem 0;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border-radius: 12px;
  }
  
  .hero-image.has-custom-image {
    height: 350px;
  }
  
  .hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    display: block;
  }

  /* Experience Header Styles */
  .experience-header {
    margin-bottom: 3rem;
  }

  .experience-header-main {
    margin-bottom: 1.5rem;
  }

  .experience-title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .experience-company-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .experience-company {
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(165, 180, 252, 1);
  }

  .experience-company::after {
    content: '·';
    margin-left: 0.5rem;
    color: rgba(148, 163, 184, 0.5);
  }

  .experience-duration {
    font-size: 1rem;
    color: rgba(200, 210, 220, 0.85);
  }

  .experience-type {
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0.6rem;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 4px;
    color: rgba(196, 181, 253, 0.95);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 0.5rem;
  }

  .experience-type.status-active {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
    border-color: rgba(34, 197, 94, 0.4);
    color: #4ade80;
  }

  .experience-type.status-completed {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
    border-color: rgba(59, 130, 246, 0.4);
    color: #60a5fa;
  }

  .experience-location {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.95rem;
    color: rgba(148, 163, 184, 0.8);
  }

  .location-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  .experience-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .experience-tag {
    padding: 0.35rem 0.8rem;
    background: rgba(30, 35, 45, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 6px;
    font-size: 0.8rem;
    color: rgba(180, 190, 200, 0.85);
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .experience-tag:hover {
    background: rgba(148, 163, 184, 0.15);
    border-color: rgba(148, 163, 184, 0.25);
    color: rgba(220, 225, 235, 0.95);
  }

  .experience-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .experience-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 8px;
    color: rgba(165, 180, 252, 0.95);
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .experience-action-btn:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
    border-color: rgba(99, 102, 241, 0.5);
    color: rgba(199, 210, 254, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  .experience-action-btn .icon {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    .experience-title {
      font-size: 2rem;
    }

    .experience-company-line {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }

    .experience-company::after {
      display: none;
    }

    .experience-type {
      margin-left: 0;
    }
  }
  
  .header-content {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 3rem;
    align-items: start;
  }
  
  .header-main {
    flex: 1;
  }
  
  .article-nav {
    margin-bottom: 2rem;
  }
  
  .back-buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-muted, #8b949e);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  
  .back-link:hover {
    color: var(--color-foreground, #d0d0d0);
  }
  
  .back-link .icon {
    width: 18px;
    height: 18px;
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
  
  .article-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .article-description {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--color-muted, #8b949e);
    margin: 0 0 1.5rem 0;
  }
  
  .header-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .reading-time {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-muted, #8b949e);
    font-size: 0.9rem;
    margin-left: auto;
  }
  
  .reading-time .icon {
    width: 16px;
    height: 16px;
  }
  
  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    font-size: 0.9rem;
  }
  
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .meta-label {
    color: var(--color-muted, #8b949e);
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
  
  .meta-value {
    color: var(--color-foreground, #d0d0d0);
    font-weight: 500;
  }
  
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tag {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--color-foreground, #d0d0d0);
    font-weight: 500;
  }
  
  .article-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .action-btn .icon {
    width: 18px;
    height: 18px;
  }
  
  /* Share Buttons */
  .share-buttons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .share-label {
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    font-weight: 500;
  }
  
  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: var(--color-foreground, #d0d0d0);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }
  
  .share-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .share-btn.success {
    background: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.4);
    color: #4ade80;
  }
  
  .share-btn .icon {
    width: 18px;
    height: 18px;
  }
  
  /* Table of Contents */
  .table-of-contents {
    position: sticky;
    top: 100px;
    max-width: 250px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
  
  .toc-title {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #8b949e);
    margin: 0 0 1rem 0;
  }
  
  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .toc-link {
    display: block;
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  
  .toc-link:hover {
    color: var(--color-foreground, #d0d0d0);
    background: rgba(255, 255, 255, 0.05);
  }
  
  .toc-link.active {
    color: var(--color-foreground, #e0e0e0);
    background: rgba(255, 255, 255, 0.08);
    font-weight: 500;
  }
  
  .article-content {
    line-height: 1.8;
    font-size: 1.125rem;
    color: var(--color-foreground, #d0d0d0);
  }
  
  .article-content :global(h1),
  .article-content :global(h2),
  .article-content :global(h3),
  .article-content :global(h4) {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-foreground, #e0e0e0);
    scroll-margin-top: 100px;
  }
  
  .article-content :global(h1) {
    font-size: 2rem;
  }
  
  .article-content :global(h2) {
    font-size: 1.75rem;
  }
  
  .article-content :global(h3) {
    font-size: 1.5rem;
  }
  
  .article-content :global(h4) {
    font-size: 1.25rem;
  }
  
  .article-content :global(p) {
    margin-bottom: 1.5rem;
    color: var(--color-foreground, #c9d1d9);
  }
  
  .article-content :global(ul),
  .article-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  .article-content :global(li) {
    margin-bottom: 0.75rem;
    color: var(--color-foreground, #c9d1d9);
  }
  
  .article-content :global(blockquote) {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 8px 8px 0;
    color: var(--color-muted, #8b949e);
    font-style: italic;
  }
  
  .article-content :global(code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: 'Courier New', monospace;
  }
  
  .article-content :global(pre) {
    background: rgba(0, 0, 0, 0.4);
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .article-content :global(pre code) {
    background: none;
    padding: 0;
    font-size: 0.9rem;
  }
  
  .article-content :global(a) {
    color: var(--color-primary, #e0e0e0);
    text-decoration: underline;
    text-decoration-color: rgba(224, 224, 224, 0.3);
    transition: text-decoration-color 0.2s ease;
  }
  
  .article-content :global(a:hover) {
    text-decoration-color: rgba(224, 224, 224, 0.6);
  }
  
  .article-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }
  
  .article-content :global(hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 3rem 0;
  }
  
  /* Related Items */
  .related-items {
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .related-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: var(--color-foreground, #e0e0e0);
  }
  
  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .related-card {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: var(--color-foreground, #d0d0d0);
    transition: all 0.2s ease;
  }
  
  .related-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .related-image {
    width: 100%;
    height: 150px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .related-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .related-content {
    padding: 1rem;
  }
  
  .related-card-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--color-foreground, #e0e0e0);
  }
  
  .related-description {
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
    margin: 0;
    line-height: 1.5;
  }

  /* Compact related cards without images */
  .related-grid.no-images {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .related-card.compact {
    flex-direction: row;
    align-items: center;
  }

  .related-card.compact .related-content {
    padding: 1.25rem 1.5rem;
  }

  .related-card.compact .related-card-title {
    font-size: 1.1rem;
    margin-bottom: 0.35rem;
  }
  
  .article-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 968px) {
    .header-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .table-of-contents {
      position: relative;
      top: 0;
      max-width: 100%;
      max-height: none;
    }
  }
  
  @media (max-width: 768px) {
    .blog-article {
      padding: 1.5rem 1rem;
    }
    
    .hero-image {
      margin: 0 0 2rem 0;
      height: 250px;
    }
    
    .hero-image.has-custom-image {
      height: 280px;
    }
    
    .article-title {
      font-size: 2rem;
    }
    
    .article-description {
      font-size: 1.125rem;
    }
    
    .article-content {
      font-size: 1rem;
    }
    
    .article-meta {
      flex-direction: column;
      gap: 1rem;
    }
    
    .article-actions {
      flex-direction: column;
    }
    
    .action-btn {
      width: 100%;
      justify-content: center;
    }
    
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
