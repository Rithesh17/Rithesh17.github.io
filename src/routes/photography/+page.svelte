<script>
  import UnderDevelopment from '$lib/components/UnderDevelopment.svelte';
  export let data;
  $: siteConfig = data.siteConfig;
</script>

<svelte:head>
  <title>Photography | {siteConfig?.site?.name || 'Photography'}</title>
  <meta name="description" content="Photography portfolio - coming soon" />
</svelte:head>

<UnderDevelopment sectionName="Photography" />
