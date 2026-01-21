<script>
  import UnderDevelopment from '$lib/components/UnderDevelopment.svelte';
  export let data;
  $: siteConfig = data.siteConfig;
</script>

<svelte:head>
  <title>Blog | {siteConfig?.site?.name || 'Blog'}</title>
  <meta name="description" content="Blog - coming soon" />
</svelte:head>

<UnderDevelopment sectionName="Blog" />
