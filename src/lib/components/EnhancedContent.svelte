<script lang="ts">
  import { ContentBody } from 'statue-ssg';
  import { onMount, tick, afterUpdate } from 'svelte';
  import { browser } from '$app/environment';

  export let content: string = '';

  let contentContainer: HTMLElement;
  let lastProcessedContent: string = '';

  onMount(() => {
    processContent();
  });

  afterUpdate(() => {
    // Re-process when content changes
    if (content !== lastProcessedContent) {
      processContent();
    }
  });

  async function processContent() {
    if (!browser || !contentContainer) return;

    await tick();
    await new Promise(resolve => setTimeout(resolve, 50));

    // Reset any existing wrappers first
    resetContent();
    
    wrapSections();
    processHighlights();
    
    // Show all sections immediately
    contentContainer.querySelectorAll('.content-section, .content-intro').forEach(el => {
      el.classList.add('revealed');
    });

    lastProcessedContent = content;
  }

  function resetContent() {
    // Remove previously added wrapper elements to prevent duplication
    contentContainer.querySelectorAll('.content-section').forEach(section => {
      const parent = section.parentElement;
      if (!parent) return;
      
      // Move children back out
      while (section.firstChild) {
        // Skip the shine-border element
        if ((section.firstChild as Element).classList?.contains('shine-border')) {
          section.removeChild(section.firstChild);
          continue;
        }
        parent.insertBefore(section.firstChild, section);
      }
      parent.removeChild(section);
    });

    contentContainer.querySelectorAll('.content-intro').forEach(intro => {
      const parent = intro.parentElement;
      if (!parent) return;
      while (intro.firstChild) {
        parent.insertBefore(intro.firstChild, intro);
      }
      parent.removeChild(intro);
    });
  }

  function processHighlights() {
    // Find all text nodes and process ==highlight== markers
    const walker = document.createTreeWalker(
      contentContainer,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToProcess: { node: Text; matches: RegExpMatchArray[] }[] = [];
    const regex = /==([^=]+)==/g;

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent || '';
      const matches = [...text.matchAll(regex)];
      if (matches.length > 0) {
        nodesToProcess.push({ node: node as Text, matches });
      }
    }

    // Process in reverse to avoid index issues
    nodesToProcess.reverse().forEach(({ node, matches }) => {
      const parent = node.parentNode;
      if (!parent) return;

      let html = node.textContent || '';
      html = html.replace(/==([^=]+)==/g, '<span class="text-highlight">$1</span>');

      const template = document.createElement('template');
      template.innerHTML = html;

      const fragment = template.content;
      parent.replaceChild(fragment, node);
    });
  }

  function wrapSections() {
    const h2Elements = contentContainer.querySelectorAll('h2');
    
    if (h2Elements.length === 0) return;

    h2Elements.forEach((h2) => {
      const sectionWrapper = document.createElement('div');
      sectionWrapper.className = 'content-section';

      const parent = h2.parentElement;
      if (!parent) return;

      parent.insertBefore(sectionWrapper, h2);
      
      // Add shine border element
      const shineBorder = document.createElement('div');
      shineBorder.className = 'shine-border';
      const shineGlow = document.createElement('div');
      shineGlow.className = 'shine-glow';
      shineBorder.appendChild(shineGlow);
      sectionWrapper.appendChild(shineBorder);
      
      sectionWrapper.appendChild(h2);

      // Collect all content for this section
      let nextSibling = sectionWrapper.nextSibling;
      let isFirstParagraph = true;
      
      while (nextSibling) {
        const nextNext = nextSibling.nextSibling;
        
        if (nextSibling.nodeType === Node.ELEMENT_NODE) {
          const el = nextSibling as Element;
          const tagName = el.tagName?.toLowerCase();
          
          if (tagName === 'h2' || tagName === 'h1') {
            break;
          }
          
          // Mark first paragraph as lead
          if (isFirstParagraph && tagName === 'p') {
            el.classList.add('lead-paragraph');
            isFirstParagraph = false;
          }
        }
        
        // Move element into the wrapper
        sectionWrapper.appendChild(nextSibling);
        nextSibling = nextNext;
      }
    });

    // Handle intro content (before first h2)
    const firstSection = contentContainer.querySelector('.content-section');
    if (firstSection) {
      let prevSibling = firstSection.previousSibling;
      const introElements: Node[] = [];
      
      while (prevSibling) {
        const prevPrev = prevSibling.previousSibling;
        introElements.unshift(prevSibling);
        prevSibling = prevPrev;
      }
      
      if (introElements.length > 0) {
        const introWrapper = document.createElement('div');
        introWrapper.className = 'content-intro';
        introElements.forEach(el => introWrapper.appendChild(el));
        firstSection.parentElement?.insertBefore(introWrapper, firstSection);
      }
    }
  }

  function setupRevealObserver() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      contentContainer.querySelectorAll('.content-section, .content-intro').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    contentContainer.querySelectorAll('.content-section, .content-intro').forEach((section) => {
      observer.observe(section);
    });
  }
</script>

<div class="enhanced-content" bind:this={contentContainer}>
  <ContentBody {content} />
</div>

<style>
  .enhanced-content {
    position: relative;
  }

  /* Glass Card Sections with Shine Border */
  .enhanced-content :global(.content-section) {
    position: relative;
    padding: 2rem 2.5rem;
    margin: 2rem 0;
    background: rgba(5, 5, 8, 0.4);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    
    /* Animation setup */
    opacity: 0;
    transform: translateY(40px);
    transition: 
      opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease;
  }

  /* Shine border container - fixed position, doesn't rotate */
  .enhanced-content :global(.shine-border) {
    position: absolute;
    inset: -1px;
    border-radius: 17px;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  /* The rotating glow element */
  .enhanced-content :global(.shine-glow) {
    position: absolute;
    inset: -50%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      transparent 60deg,
      rgba(148, 163, 184, 0.2) 75deg,
      rgba(148, 163, 184, 0.8) 88deg,
      rgba(200, 220, 255, 1) 90deg,
      rgba(148, 163, 184, 0.8) 92deg,
      rgba(148, 163, 184, 0.2) 105deg,
      transparent 120deg,
      transparent 360deg
    );
    animation: rotateBorder 12s linear infinite;
  }

  @keyframes rotateBorder {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Mask to show only the border - match card background */
  .enhanced-content :global(.shine-border)::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: inherit;
    background: rgba(5, 5, 8, 0.95);
    border-radius: 14px;
    backdrop-filter: blur(2px);
  }

  /* Ensure content is above the shine border */
  .enhanced-content :global(.content-section > h2),
  .enhanced-content :global(.content-section > p),
  .enhanced-content :global(.content-section > ul),
  .enhanced-content :global(.content-section > ol),
  .enhanced-content :global(.content-section > blockquote) {
    position: relative;
    z-index: 1;
  }

  /* Custom text highlighting */
  .enhanced-content :global(.text-highlight) {
    color: rgba(186, 230, 253, 1);
    text-shadow: 0 0 20px rgba(125, 211, 252, 0.4);
    font-weight: 500;
  }

  /* Moving shimmer effect */
  .enhanced-content :global(.content-section)::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 40%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.03) 60%,
      transparent 100%
    );
    animation: shimmer 8s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: 100%;
    }
  }

  /* Revealed state */
  .enhanced-content :global(.content-section.revealed) {
    opacity: 1;
    transform: translateY(0);
  }


  /* Hover effect */
  .enhanced-content :global(.content-section:hover) {
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 40px rgba(0, 0, 0, 0.4),
      0 0 80px rgba(148, 163, 184, 0.08);
  }

  /* Section headings */
  .enhanced-content :global(.content-section h2) {
    margin-top: 0;
    margin-bottom: 1.25rem;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #93c5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .enhanced-content :global(.content-section h2::before) {
    content: '#';
    margin-right: 0.5rem;
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0.85;
  }

  /* Lead paragraph - emphasized summary */
  .enhanced-content :global(.lead-paragraph) {
    font-size: 1.1rem;
    line-height: 1.75;
    color: rgba(240, 240, 245, 0.95);
    font-weight: 450;
    margin-bottom: 1.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  /* Regular paragraphs - dimmer supporting text */
  .enhanced-content :global(.content-section p) {
    margin-bottom: 1.25rem;
    line-height: 1.8;
    color: rgba(180, 185, 195, 0.85);
    font-size: 1rem;
  }

  .enhanced-content :global(.content-section p:last-child) {
    margin-bottom: 0;
  }

  /* Lead paragraph overrides the regular p styles */
  .enhanced-content :global(.content-section p.lead-paragraph) {
    font-size: 1.1rem;
    color: rgba(240, 240, 245, 0.95);
    font-weight: 450;
  }

  /* Intro content */
  .enhanced-content :global(.content-intro) {
    opacity: 0;
    transform: translateY(25px);
    transition: 
      opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    margin-bottom: 2rem;
  }

  .enhanced-content :global(.content-intro.revealed) {
    opacity: 1;
    transform: translateY(0);
  }

  .enhanced-content :global(.content-intro p) {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(220, 225, 230, 0.9);
  }

  /* Stagger animation delay */
  .enhanced-content :global(.content-section:nth-of-type(1)) { transition-delay: 0s; }
  .enhanced-content :global(.content-section:nth-of-type(2)) { transition-delay: 0.1s; }
  .enhanced-content :global(.content-section:nth-of-type(3)) { transition-delay: 0.18s; }
  .enhanced-content :global(.content-section:nth-of-type(4)) { transition-delay: 0.26s; }
  .enhanced-content :global(.content-section:nth-of-type(5)) { transition-delay: 0.34s; }
  .enhanced-content :global(.content-section:nth-of-type(n+6)) { transition-delay: 0.4s; }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .enhanced-content :global(.content-section),
    .enhanced-content :global(.content-intro) {
      opacity: 1;
      transform: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .enhanced-content :global(.content-section)::before {
      animation: none;
      opacity: 1;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .enhanced-content :global(.content-section) {
      padding: 1.5rem 1.5rem 1.5rem 1.75rem;
      margin: 1.5rem 0;
      border-radius: 12px;
    }
    
    .enhanced-content :global(.content-section h2) {
      font-size: 1.3rem;
    }

    .enhanced-content :global(.lead-paragraph) {
      font-size: 1rem;
    }
  }
</style>
