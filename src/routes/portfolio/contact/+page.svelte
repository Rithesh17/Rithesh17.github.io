<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';

  export let data;

  $: siteConfig = data?.siteConfig;
  $: contact = data?.contact || siteConfig?.contact || {};
  $: social = data?.social || siteConfig?.social || {};
  $: profile = data?.profile || siteConfig?.profile || {};
  $: address = contact?.address || {};
  $: contactEmail = profile.email || contact.email || '';
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Contact', url: '/portfolio/contact' }
  ];
</script>

<SEO
	siteConfig={siteConfig}
	title="Contact"
	description={`Get in touch with ${profile?.name || siteConfig?.site?.name || 'me'}. ${contactEmail ? `Email: ${contactEmail}` : 'Available for opportunities and collaborations.'}`}
	keywords={['contact', 'get in touch', 'collaboration', 'opportunities', profile?.name || '']}
	type="website"
	canonical={$page.url.pathname}
/>

<StructuredData siteConfig={siteConfig} type="BreadcrumbList" {breadcrumbs} />

<div class="contact-page">
  <Particles className="absolute inset-0" refresh={true} />

  <PageHero
    title="Contact"
    description="Get in touch and connect with me"
  />

  <section class="contact-section">
    <div class="container">
      <div class="contact-grid">
        <!-- Contact Information -->
        <div class="contact-info">
          <h2 class="section-title">Get in Touch</h2>
          <p class="section-description">
            I'm always open to discussing new opportunities, interesting projects, or just having a conversation.
          </p>

          <div class="info-list">
            {#if contactEmail}
              <a href="mailto:{contactEmail}" class="info-item">
                <Mail size={20} />
                <span>{contactEmail}</span>
              </a>
            {/if}

            {#if contact.phone}
              <a href="tel:{contact.phone.replace(/[\s-]/g, '')}" class="info-item">
                <Phone size={20} />
                <span>{contact.phone}</span>
              </a>
            {/if}

            {#if address.city || address.country}
              <div class="info-item">
                <MapPin size={20} />
                <span>
                  {[address.street, address.city, address.state, address.country].filter(Boolean).join(', ')}
                </span>
              </div>
            {/if}
          </div>

          <div class="social-links">
            <h3 class="social-title">Connect</h3>
            <div class="social-icons">
              {#if social.github || profile.username}
                <a
                  href={social.github || `https://github.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
              {/if}
              {#if social.linkedin}
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              {/if}
              {#if social.twitter}
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              {/if}
              {#if profile.website || contact.website}
                <a
                  href={profile.website || contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-icon"
                  aria-label="Website"
                >
                  <Globe size={24} />
                </a>
              {/if}
            </div>
          </div>
        </div>

        <!-- Send Email CTA -->
        <div class="contact-cta-wrapper">
          <div class="cta-icon">
            <Mail size={48} />
          </div>
          <h2 class="section-title">Send a Message</h2>
          <p class="cta-description">
            Have a question, proposal, or just want to say hello? Drop me an email and I'll get back to you as soon as I can.
          </p>
          {#if contactEmail}
            <a href="mailto:{contactEmail}" class="mailto-btn">
              <Mail size={20} />
              <span>Email Me</span>
              <ExternalLink size={16} />
            </a>
            <p class="cta-email">{contactEmail}</p>
          {/if}
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .contact-page {
    min-height: 100vh;
    background: var(--color-background, #000000);
    color: var(--color-foreground, #d0d0d0);
    position: relative;
    overflow-x: hidden;
  }

  :global(.contact-page > div[aria-hidden="true"]) {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  section {
    position: relative;
    z-index: 1;
  }

  .contact-section {
    padding: 4rem 1rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem 0;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
  }

  .section-description {
    color: var(--color-muted, #8b949e);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 0 2rem 0;
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    padding: 0.75rem;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .info-item:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    transform: translateX(4px);
  }

  .social-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-foreground, #d0d0d0);
    margin: 0 0 1rem 0;
  }

  .social-icons {
    display: flex;
    gap: 1rem;
  }

  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: var(--color-foreground, #d0d0d0);
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  .social-icon:hover {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 2px rgba(255, 255, 255, 0.1) inset;
  }

  .contact-cta-wrapper {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 3rem 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cta-icon {
    color: var(--color-muted, #8b949e);
    margin-bottom: 1.5rem;
  }

  .cta-description {
    color: var(--color-muted, #8b949e);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 0 2rem 0;
    max-width: 400px;
  }

  .mailto-btn {
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

  .mailto-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .mailto-btn:hover::before {
    opacity: 1;
  }

  .mailto-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3),
                0 0 2px rgba(255, 255, 255, 0.4) inset;
  }

  .mailto-btn :global(svg),
  .mailto-btn span {
    position: relative;
    z-index: 1;
  }

  .cta-email {
    margin: 1rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-muted, #8b949e);
  }

  @media (max-width: 968px) {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
</style>
