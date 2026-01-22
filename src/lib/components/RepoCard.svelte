<script lang="ts">
	import { Star, GitFork } from 'lucide-svelte';

	export let repo: {
		name: string;
		link: string;
		description: string;
		isPublic: boolean;
		language: string;
		languageColor: string;
		stars: number;
		forks: number;
	};

	// Create valid CSS identifier for view-transition-name
	$: transitionName = `repo-${repo.name.replace(/[^a-zA-Z0-9]/g, '-')}`;

	function handleCardClick() {
		// Navigate to repositories page with repo name as query param
		const repoName = encodeURIComponent(repo.name);
		window.location.href = `/repositoriespage?repo=${repoName}`;
	}

	function stopPropagation(e: Event) {
		e.stopPropagation();
	}
</script>

<div 
	class="flex flex-col justify-between p-4 border border-border-default rounded-md bg-canvas-default hover:border-fg-muted transition-colors cursor-pointer" 
	style="view-transition-name: {transitionName};"
	on:click={handleCardClick}
	role="button"
	tabindex="0"
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleCardClick();
		}
	}}
>
	<div>
		<div class="flex items-center gap-2 mb-2">
			<a href={repo.link} class="font-semibold text-accent-fg hover:underline break-all" on:click={stopPropagation} target="_blank" rel="noopener noreferrer">
				{repo.name}
			</a>
			<span class="px-2 py-[2px] text-xs text-fg-muted border border-border-default rounded-full font-medium">
				{repo.isPublic ? 'Public' : 'Private'}
			</span>
		</div>
		<p class="text-xs text-fg-muted mb-4 line-clamp-2">
			{repo.description}
		</p>
	</div>

	<div class="flex items-center gap-4 text-xs text-fg-muted mt-2">
		<div class="flex items-center gap-1">
			<span class="w-3 h-3 rounded-full" style="background-color: {repo.languageColor}"></span>
			<span>{repo.language}</span>
		</div>

		{#if repo.stars > 0}
			<div class="flex items-center gap-1 hover:text-accent-fg cursor-pointer">
				<Star size={14} />
				<span>{repo.stars}</span>
			</div>
		{/if}

		{#if repo.forks > 0}
			<div class="flex items-center gap-1 hover:text-accent-fg cursor-pointer">
				<GitFork size={14} />
				<span>{repo.forks}</span>
			</div>
		{/if}
	</div>
</div>

