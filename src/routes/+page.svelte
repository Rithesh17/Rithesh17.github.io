<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import BoxReveal from '$lib/animations/BoxReveal.svelte';
	import Particles from '$lib/animations/Particles.svelte';

	export let data;

	let buttonVisible = false;

	onMount(() => {
		// Delay button animation slightly after text
		setTimeout(() => {
			buttonVisible = true;
		}, 800);
	});
</script>

<svelte:head>
	<title>Welcome</title>
	<meta name="description" content="Welcome to my portfolio" />
</svelte:head>

<div class="welcome-page">
	<Particles className="absolute inset-0" refresh={true} quantity={400} />
	
	<div class="welcome-content">
		<BoxReveal boxColor="#e0e0e0" duration={0.6}>
			<h1 class="welcome-title">Welcome to my page</h1>
		</BoxReveal>
		
		<div class="button-container" class:visible={buttonVisible}>
			<a href="/portfolio" class="portfolio-button">
				<span class="button-text">Portfolio</span>
				<span class="button-arrow">→</span>
			</a>
		</div>
	</div>
</div>

<style>
	.welcome-page {
		min-height: 100vh;
		background: var(--color-background, #000000);
		color: var(--color-foreground, #d0d0d0);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Ensure particles are behind all content */
	:global(.welcome-page > div[aria-hidden="true"]) {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.welcome-content {
		position: relative;
		z-index: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		padding: 2rem;
	}

	.welcome-title {
		font-size: clamp(2.5rem, 8vw, 5rem);
		font-weight: 300;
		letter-spacing: -0.02em;
		margin: 0;
		background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1.2;
	}

	.button-container {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s;
	}

	.button-container.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.portfolio-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2.5rem;
		background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
		color: var(--color-background, #000000);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50px;
		font-size: 1.125rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2), 
		            0 0 1px rgba(255, 255, 255, 0.3) inset;
		position: relative;
		overflow: hidden;
	}

	.portfolio-button::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.portfolio-button:hover::before {
		opacity: 1;
	}

	.portfolio-button:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3), 
		            0 0 2px rgba(255, 255, 255, 0.4) inset;
	}

	.portfolio-button:active {
		transform: translateY(0) scale(0.98);
	}

	.button-text {
		position: relative;
		z-index: 1;
	}

	.button-arrow {
		position: relative;
		z-index: 1;
		transition: transform 0.3s ease;
		font-size: 1.25rem;
	}

	.portfolio-button:hover .button-arrow {
		transform: translateX(4px);
	}

	@media (max-width: 768px) {
		.welcome-content {
			gap: 2rem;
			padding: 1.5rem;
		}

		.welcome-title {
			font-size: 2rem;
		}

		.portfolio-button {
			padding: 0.875rem 2rem;
			font-size: 1rem;
		}
	}
</style>
