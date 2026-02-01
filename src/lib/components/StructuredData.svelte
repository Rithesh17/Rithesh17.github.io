<script lang="ts">
  import { page } from '$app/stores';

  export let siteConfig: any;
  export let type: 'Person' | 'Organization' | 'Article' | 'BreadcrumbList' = 'Person';
  export let articleData: {
    title?: string;
    description?: string;
    image?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    keywords?: string[];
  } = {};
  export let breadcrumbs: Array<{ name: string; url: string }> = [];

  $: siteUrl = siteConfig?.site?.url || '';
  $: profile = siteConfig?.profile || {};
  $: social = siteConfig?.social || {};

  $: personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name || siteConfig?.site?.name || '',
    url: siteUrl,
    ...(profile?.email && { email: profile.email }),
    ...(profile?.website && { sameAs: profile.website }),
    ...(social?.github && { sameAs: [...(profile?.website ? [profile.website] : []), social.github] }),
    ...(social?.linkedin && { sameAs: [...(profile?.website ? [profile.website] : []), social.linkedin] }),
    ...(profile?.bio && { description: profile.bio }),
    ...(profile?.avatarUrl && { image: `${siteUrl}${profile.avatarUrl}` }),
    ...(profile?.location && { address: { '@type': 'PostalAddress', addressLocality: profile.location } })
  };

  $: organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig?.site?.name || '',
    url: siteUrl,
    ...(siteConfig?.site?.description && { description: siteConfig.site.description }),
    ...(siteConfig?.contact?.email && { email: siteConfig.contact.email })
  };

  $: articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title || '',
    description: articleData.description || '',
    ...(articleData.image && { image: articleData.image.startsWith('http') ? articleData.image : `${siteUrl}${articleData.image}` }),
    ...(articleData.author && { author: { '@type': 'Person', name: articleData.author } }),
    ...(articleData.publishedTime && { datePublished: articleData.publishedTime }),
    ...(articleData.modifiedTime && { dateModified: articleData.modifiedTime }),
    ...(articleData.keywords && articleData.keywords.length > 0 && { keywords: articleData.keywords.join(', ') }),
    publisher: {
      '@type': 'Person',
      name: profile?.name || siteConfig?.site?.name || ''
    }
  };

  $: breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`
    }))
  };

  $: schema = type === 'Person' ? personSchema :
              type === 'Organization' ? organizationSchema :
              type === 'Article' ? articleSchema :
              type === 'BreadcrumbList' ? breadcrumbSchema :
              personSchema;
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`}
</svelte:head>
