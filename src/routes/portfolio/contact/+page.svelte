<script lang="ts">
  import { PageHero } from 'statue-ssg';
  import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Globe } from 'lucide-svelte';
  import Particles from '$lib/animations/Particles.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import StructuredData from '$lib/components/StructuredData.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: siteConfig = data?.siteConfig;
  $: contact = data?.contact || {};
  $: social = data?.social || {};
  $: profile = data?.profile || {};
  $: breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Contact', url: '/portfolio/contact' }
  ];
  
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  let formStatus = {
    submitting: false,
    success: false,
    error: ''
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    formStatus.submitting = true;
    formStatus.error = '';
    
    // For now, just show success message
    // In production, you'd send this to an API endpoint
    setTimeout(() => {
      formStatus.submitting = false;
      formStatus.success = true;
      formData = { name: '', email: '', subject: '', message: '' };
      
      setTimeout(() => {
        formStatus.success = false;
      }, 5000);
    }, 1000);
  }
</script>

<SEO
	siteConfig={siteConfig}
	title="Contact"
	description={`Get in touch with ${profile?.name || siteConfig?.site?.name || 'me'}. ${contact?.email ? `Email: ${contact.email}` : 'Available for opportunities and collaborations.'}`}
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
            {#if profile.email || contact.email}
              <a href="mailto:{profile.email || contact.email}" class="info-item">
                <Mail size={20} />
                <span>{profile.email || contact.email}</span>
              </a>
            {/if}
            
            {#if contact.phone}
              <a href="tel:{contact.phone}" class="info-item">
                <Phone size={20} />
                <span>{contact.phone}</span>
              </a>
            {/if}
            
            {#if contact.address && (contact.address.city || contact.address.country)}
              <div class="info-item">
                <MapPin size={20} />
                <span>
                  {contact.address.city}{contact.address.city && contact.address.country ? ', ' : ''}
                  {contact.address.country}
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
        
        <!-- Contact Form -->
        <div class="contact-form-wrapper">
          <h2 class="section-title">Send a Message</h2>
          {#if formStatus.success}
            <div class="form-message success">
              <p>Thank you for your message! I'll get back to you soon.</p>
            </div>
          {:else}
            <form on:submit={handleSubmit} class="contact-form">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  bind:value={formData.name}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  bind:value={formData.email}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div class="form-group">
                <label for="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  bind:value={formData.subject}
                  required
                  placeholder="What's this about?"
                />
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  bind:value={formData.message}
                  required
                  rows="6"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              {#if formStatus.error}
                <div class="form-message error">
                  <p>{formStatus.error}</p>
                </div>
              {/if}
              
              <button type="submit" class="submit-btn" disabled={formStatus.submitting}>
                {formStatus.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
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

  /* Ensure particles are behind all content */
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

  .contact-form-wrapper {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-foreground, #d0d0d0);
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    background: var(--color-background, #000000);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--color-foreground, #d0d0d0);
    font-size: 0.9rem;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 120px;
  }

  .submit-btn {
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
    color: var(--color-background, #000000);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 15px rgba(255, 255, 255, 0.2), 0 0 1px rgba(255, 255, 255, 0.3) inset;
  }

  .submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%, #f5f5f5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3), 0 0 2px rgba(255, 255, 255, 0.4) inset;
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .form-message.success {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #4ade80;
  }

  .form-message.error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
  }

  .form-message p {
    margin: 0;
    font-size: 0.9rem;
  }

  @media (max-width: 968px) {
    .contact-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
</style>
