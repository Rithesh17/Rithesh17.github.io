<script lang="ts">
	import { MapPin, Building, Github, Link, Linkedin, Twitter } from 'lucide-svelte';
	import ContributionGraph from './ContributionGraph.svelte';

	export let profile: {
		name: string;
		username: string;
		avatarUrl: string;
		bio: string;
		followers: number;
		following: number;
		location?: string;
		company?: string;
		website?: string;
		twitter?: string;
		linkedin?: string;
		email?: string;
		status?: {
			emoji: string;
			message: string;
		};
	};

	export let contributionData: {
		total: number;
		days: Array<{
			date: string;
			count: number;
			level: number;
		}>;
	} | null = null;

	// Parse text and convert @mentions to clickable GitHub links
	function parseTextWithMentions(text: string | undefined): Array<{text: string, url: string | null, suffix?: string}> {
		if (!text) return [];

		// Split by spaces but keep punctuation attached
		const parts = text.split(/(\s+)/);
		return parts.map(part => {
			// Check if this part contains an @mention
			const mentionMatch = part.match(/^(@[\w-]+)/);
			if (mentionMatch) {
				const mention = mentionMatch[1];
				const orgName = mention.slice(1);
				const rest = part.slice(mention.length);
				// Return the mention part with optional suffix (punctuation after mention)
				if (rest) {
					return { text: mention, url: `https://github.com/${orgName}`, suffix: rest };
				}
				return { text: mention, url: `https://github.com/${orgName}` };
			}
			return { text: part, url: null };
		});
	}

	$: bioParts = parseTextWithMentions(profile.bio);
	$: companyParts = parseTextWithMentions(profile.company);
</script>

<div class="sidebar-wrapper">
	<!-- Main Card Container with 3D perspective -->
	<div class="profile-card-container">
		<div class="profile-card group">
			<!-- LAYER 1 (Bottom): Contribution Map -->
			<!-- Positioned absolutely. Initially blurred and slightly dimmed. Sharpens on hover. -->
			{#if contributionData}
				<div class="contribution-layer">
					<ContributionGraph data={contributionData} username={profile.username} />
				</div>
			{/if}

			<!-- LAYER 2 (Top): Profile Content -->
			<!-- This container sits on top. On hover, elements inside move to reveal the map. -->
			<div class="profile-content-layer">
				<!-- Avatar: Slides to the LEFT on hover -->
				<div class="avatar-wrapper">
					<div class="avatar-container">
						<div class="avatar-glow"></div>
						<img
							src={profile.avatarUrl}
							alt={profile.name}
							class="avatar"
						/>
						{#if profile.status?.emoji}
							<div class="status-emoji">
								{profile.status.emoji}
							</div>
						{/if}
					</div>
				</div>

				<!-- Text Info: Fades out and slides DOWN on hover -->
				<div class="text-info-wrapper">
					<h1 class="profile-name">{profile.name}</h1>
					<h2 class="profile-username">@{profile.username}</h2>

					<p class="profile-bio">
						{#each bioParts as part}
							{#if part.url}
								<a href={part.url} target="_blank" rel="noopener noreferrer" class="mention-link">{part.text}</a>{part.suffix || ''}
							{:else}
								{part.text}
							{/if}
						{/each}
					</p>

					<div class="social-links">
						<a href="https://github.com/{profile.username}" target="_blank" rel="noopener noreferrer" class="social-btn primary">
							<Github size={16} />
							GitHub
						</a>
						{#if profile.linkedin}
							<a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" class="social-btn">
								<Linkedin size={16} />
							</a>
						{/if}
						{#if profile.twitter}
							<a href="https://twitter.com/{profile.twitter}" target="_blank" rel="noopener noreferrer" class="social-btn">
								<Twitter size={16} />
							</a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Hover Hint Label (Only visible when hovering) -->
			<div class="hover-hint">
				<span class="hint-text">Contribution activity</span>
			</div>

			<!-- Corner Details (Always visible but unobtrusive) -->
			<div class="corner-details">
				{#if profile.location}
					<div class="corner-item">
						<MapPin size={12} />
						<span>{profile.location}</span>
					</div>
				{/if}
				{#if profile.company}
					<div class="corner-item">
						<Building size={12} />
						<span>
							{#each companyParts as part}
								{#if part.url}
									<a href={part.url} target="_blank" rel="noopener noreferrer" class="org-link">{part.text}</a>{part.suffix || ''}
								{:else}
									{part.text}
								{/if}
							{/each}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.sidebar-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.profile-card-container {
		position: relative;
		width: 100%;
		height: 600px;
		perspective: 1000px;
	}

	.profile-card {
		position: relative;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 
		            0 0 1px rgba(255, 255, 255, 0.1) inset,
		            0 1px 0 rgba(255, 255, 255, 0.05) inset;
		overflow: hidden;
		transition: all 0.5s ease;
	}

	.profile-card:hover {
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 
		            0 0 2px rgba(255, 255, 255, 0.15) inset;
		border-color: rgba(255, 255, 255, 0.2);
	}

	/* LAYER 1: Contribution Map Background */
	.contribution-layer {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.2;
		filter: grayscale(100%);
		transition: all 0.7s ease-in-out;
		pointer-events: none;
	}

	.profile-card:hover .contribution-layer {
		opacity: 1;
		filter: grayscale(0%);
		transform: scale(1.05);
	}

	.contribution-layer :global(.contribution-wrapper) {
		transform: scale(0.8);
	}

	/* LAYER 2: Profile Content */
	.profile-content-layer {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		pointer-events: none;
	}

	/* Ensure meteors are behind everything */
	:global(.meteors-container) {
		z-index: 1;
	}

	/* Avatar Section */
	.avatar-wrapper {
		pointer-events: auto;
		transition: all 0.7s ease-in-out;
	}

	.profile-card:hover .avatar-wrapper {
		transform: translateX(-128px) scale(0.75) rotate(-10deg);
	}

	.avatar-container {
		position: relative;
	}

	.avatar-glow {
		position: absolute;
		inset: -2px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(147, 51, 234, 0.5));
		border-radius: 50%;
		opacity: 0.75;
		filter: blur(8px);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.75; }
		50% { opacity: 0.5; }
	}

	.avatar {
		width: 192px;
		height: 192px;
		border-radius: 50%;
		border: 4px solid var(--canvas-default, #0d1117);
		object-fit: cover;
		position: relative;
		z-index: 10;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.status-emoji {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		background: var(--canvas-overlay, #1a1a1a);
		border: 1px solid var(--border-default, #30363d);
		border-radius: 50%;
		padding: 0.5rem;
		z-index: 20;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		font-size: 1.5rem;
		transition: opacity 0.3s;
	}

	.profile-card:hover .status-emoji {
		opacity: 0;
	}

	/* Text Info Section */
	.text-info-wrapper {
		text-align: center;
		margin-top: 1.5rem;
		pointer-events: auto;
		transition: all 0.5s ease-in-out;
	}

	.profile-card:hover .text-info-wrapper {
		transform: translateY(80px);
		opacity: 0;
		filter: blur(4px);
	}

	.profile-name {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--fg-default, #e6edf3);
		margin: 0 0 0.25rem 0;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
	}

	.profile-username {
		font-size: 1.25rem;
		font-weight: 300;
		color: var(--accent-fg, #58a6ff);
		margin: 0 0 1rem 0;
	}

	.profile-bio {
		color: var(--fg-default, #c9d1d9);
		font-size: 0.875rem;
		line-height: 1.6;
		max-width: 300px;
		margin: 0 auto 1.5rem;
		padding: 0.75rem;
		background: rgba(13, 17, 23, 0.5);
		backdrop-filter: blur(8px);
		border-radius: 8px;
		border: 1px solid var(--border-default, #30363d);
	}

	.mention-link {
		color: var(--accent-fg, #58a6ff);
		text-decoration: underline;
	}

	.mention-link:hover {
		opacity: 0.8;
	}

	.social-links {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
	}

	.social-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1.5rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		background: var(--canvas-subtle, #161b22);
		color: var(--fg-default, #c9d1d9);
		border: 1px solid var(--border-default, #30363d);
	}

	.social-btn:hover {
		background: var(--canvas-overlay, #21262d);
		transform: scale(1.05);
	}

	.social-btn.primary {
		background: #fff;
		color: #000;
		border-color: #fff;
		box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
	}

	.social-btn.primary:hover {
		background: #f0f0f0;
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
	}

	/* Hover Hint Label */
	.hover-hint {
		position: absolute;
		bottom: 1rem;
		left: 1.5rem;
		z-index: 0;
		opacity: 0;
		transition: opacity 0.7s ease 0.15s;
		pointer-events: none;
	}

	.profile-card:hover .hover-hint {
		opacity: 1;
	}

	.hint-text {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--fg-muted, #8b949e);
		font-weight: 600;
		background: rgba(13, 17, 23, 0.7);
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		border: 1px solid rgba(48, 54, 61, 0.6);
		white-space: nowrap;
	}

	/* Corner Details */
	.corner-details {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		opacity: 0.5;
		transition: opacity 0.3s;
	}

	.profile-card:hover .corner-details {
		opacity: 1;
	}

	.corner-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: var(--fg-muted, #8b949e);
	}

	.org-link {
		color: var(--accent-fg, #58a6ff);
		text-decoration: underline;
	}

	.org-link:hover {
		opacity: 0.8;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.profile-card-container {
			height: 500px;
		}

		.avatar {
			width: 128px;
			height: 128px;
		}

		.profile-name {
			font-size: 2rem;
		}

		.profile-card:hover .avatar-wrapper {
			transform: translateX(-64px) scale(0.85) rotate(-5deg);
		}

		.profile-card:hover .text-info-wrapper {
			transform: translateY(60px);
		}
	}
</style>
