<script lang="ts">
  import { page } from '$app/stores';

  export let siteConfig: any;
  export let title: string;
  export let description: string = '';
  export let keywords: string[] = [];
  export let image: string = '';
  export let type: 'website' | 'article' | 'profile' = 'website';
  export let author: string = '';
  export let publishedTime: string = '';
  export let modifiedTime: string = '';
  export let canonical: string = '';

  $: siteUrl = siteConfig?.site?.url || '';
  $: siteName = siteConfig?.site?.name || '';
  $: defaultImage = siteConfig?.seo?.ogImage || '/favicon.png';
  $: defaultAuthor = author || siteConfig?.site?.author || siteConfig?.profile?.name || '';
  $: ogImage = image || defaultImage;
  $: fullImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  $: canonicalUrl = canonical || `${siteUrl}${$page.url.pathname}`;
  $: fullTitle = title.includes('|') ? title : `${title} | ${siteName}`;
  $: metaDescription = description || siteConfig?.seo?.defaultDescription || '';
  $: metaKeywords = keywords.length > 0 ? keywords.join(', ') : (siteConfig?.seo?.keywords?.join(', ') || '');
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{fullTitle}</title>
  <meta name="title" content={fullTitle} />
  <meta name="description" content={metaDescription} />
  {#if metaKeywords}
    <meta name="keywords" content={metaKeywords} />
  {/if}
  {#if defaultAuthor}
    <meta name="author" content={defaultAuthor} />
  {/if}
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:image" content={fullImageUrl} />
  <meta property="og:site_name" content={siteName} />
  {#if defaultAuthor}
    <meta property="og:author" content={defaultAuthor} />
  {/if}
  {#if type === 'article' && publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  {#if type === 'article' && modifiedTime}
    <meta property="article:modified_time" content={modifiedTime} />
  {/if}
  {#if keywords.length > 0}
    {#each keywords as keyword}
      <meta property="article:tag" content={keyword} />
    {/each}
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content={siteConfig?.seo?.twitterCard || 'summary_large_image'} />
  <meta name="twitter:url" content={canonicalUrl} />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={metaDescription} />
  <meta name="twitter:image" content={fullImageUrl} />
  {#if siteConfig?.social?.twitter}
    <meta name="twitter:site" content={siteConfig.social.twitter} />
    <meta name="twitter:creator" content={siteConfig.social.twitter} />
  {/if}
</svelte:head>
