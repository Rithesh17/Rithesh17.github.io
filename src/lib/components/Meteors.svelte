<script lang="ts">
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";

	export let number = 10;
	
	let meteorStyles: any = [];
	
	let changeMeteors = (num: number) => {
		meteorStyles = [];
		const styles = [...new Array(num)].map(() => ({
			top: Math.random() * 100 + "%",
			left: Math.random() * 100 + "%",
			animationDelay: Math.random() * 1 + 0.2 + "s",
			animationDuration: Math.floor(Math.random() * 8 + 2.9) + "s",
		}));
		meteorStyles = styles;
	};
	
	onMount(() => {
		changeMeteors(number);
	});
</script>

<div class="meteors-container">
	{#each meteorStyles as style, idx}
		<span
			id="meteor-{idx+1}"
			class={cn(
				"pointer-events-none absolute size-[2.4px] rotate-[35deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
			)}
			style="top: {style.top}; left: {style.left}; animation-delay: {style.animationDelay}; animation-duration: {style.animationDuration};"
		>
			<!-- Meteor Tail  -->
			<div
				class="pointer-events-none absolute top-1/2 right-0 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-l from-slate-500 via-blue-600/30 to-transparent"
			/>
		</span>
	{/each}
</div>

<style>
	.meteors-container {
		position: fixed;
		inset: 0;
		overflow: visible;
		pointer-events: none;
		z-index: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
