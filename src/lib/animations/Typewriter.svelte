<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let phrases: string[] = [];
	export let typingSpeed: number = 100; // milliseconds per character
	export let deletingSpeed: number = 100; // milliseconds per character
	export let pauseDuration: number = 2000; // milliseconds to pause after typing
	export let showCursor: boolean = true;
	export let cursorChar: string = '|';
	export let cursorColor: string = 'var(--accent-fg, #58a6ff)';

	let currentPhraseIndex = 0;
	let typedText = '';
	let isDeleting = false;
	let waitCount = 0;
	let typewriterInterval: ReturnType<typeof setInterval> | null = null;

	function typeChar() {
		if (phrases.length === 0) return;
		
		const currentPhrase = phrases[currentPhraseIndex];
		
		if (!isDeleting && typedText.length < currentPhrase.length) {
			// Typing in
			typedText = currentPhrase.slice(0, typedText.length + 1);
		} else if (!isDeleting && typedText.length === currentPhrase.length) {
			// Finished typing, wait before deleting
			waitCount++;
			const pauseIterations = pauseDuration / typingSpeed;
			if (waitCount >= pauseIterations) {
				isDeleting = true;
				waitCount = 0;
				// Restart with deleting speed
				stopTypewriter();
				startTypewriter();
			}
		} else if (isDeleting && typedText.length > 0) {
			// Deleting
			typedText = typedText.slice(0, -1);
		} else if (isDeleting && typedText.length === 0) {
			// Finished deleting, move to next phrase
			isDeleting = false;
			currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
			// Restart with typing speed
			stopTypewriter();
			startTypewriter();
		}
	}

	function startTypewriter() {
		if (typewriterInterval) {
			clearInterval(typewriterInterval);
		}
		const speed = isDeleting ? deletingSpeed : typingSpeed;
		typewriterInterval = setInterval(typeChar, speed);
	}

	function stopTypewriter() {
		if (typewriterInterval) {
			clearInterval(typewriterInterval);
			typewriterInterval = null;
		}
	}

	onMount(() => {
		if (phrases.length > 0) {
			startTypewriter();
		}
	});

	onDestroy(() => {
		stopTypewriter();
	});
</script>

<span class="typewriter">
	<span class="typed-text">{typedText}</span>
	{#if showCursor}
		<span class="cursor" style="color: {cursorColor}">{cursorChar}</span>
	{/if}
</span>

<style>
	.typewriter {
		display: inline-block;
	}

	.typed-text {
		display: inline-block;
	}

	.cursor {
		display: inline-block;
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%, 50% {
			opacity: 1;
		}
		51%, 100% {
			opacity: 0;
		}
	}
</style>
