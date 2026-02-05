// Site Configuration
// This file contains your site's general settings
// Run `./scripts/github-sync.sh your-username` to auto-populate from GitHub

export const siteConfig = {
  // Developer profile (main identity for portfolio)
  profile: {
    name: 'Rithesh',
    username: 'Rithesh17',
    avatarUrl: "/avatar.jpg",
    bio: 'Software Developer',
    followers: 3,
    following: 2,
    location: '',
    website: '',
    linkedin: '',
    company: '',
    email: ''
  },

  // Default avatar for blog posts (uses GitHub avatar by default)
  // This path is also used when authorAvatar is not specified in blog post frontmatter
  // Note: Avatar file is located at static/avatar.jpg (synced from GitHub by github-sync.sh)
  blog: {
    defaultAuthorAvatar: "/avatar.jpg"
  },

  // Portfolio features toggle
  features: {
    showExperience: true,
    showMacScreen: false
  },

  // Site general information
  site: {
    name: 'Rithesh',
    description: "ML Researcher & Infrastructure Engineer - Portfolio showcasing projects in machine learning, AI research, and software engineering.",
    url: "https://rithesh17.github.io",
    author: "Rithesh"
  },

  // Navigation bar configuration
  navbar: {
    // Site title displayed in the navbar (null to hide)
    siteTitle: 'Rithesh',

    // Logo image URL (null for default SVG icon)
    logo: null,

    // Default navigation items (add cta: true for CTA button style)
    defaultNavItems: [
      { title: 'Home', url: '/' },
      { title: 'Portfolio', url: '/portfolio' },
      { title: 'Photography', url: '/photography' },
      { title: 'Blog', url: '/blog' }
    ]
  },

  // Contact information
  contact: {
    // Main contact email
    email: '',

    // Privacy policy related email
    privacyEmail: "rkumar45@ucsc.edu",

    // Support email
    supportEmail: "rkumar45@ucsc.edu",

    // Phone number (optional)
    phone: "+1 831-266-7201",

    // Mailing address
    address: {
      street: "516 4th Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "",
      country: "USA"
    }
  },

  // Social media links
  social: {
    twitter: '',
    github: "https://www.github.com/Rithesh17",
    linkedin: '',
    facebook: "",
    instagram: "https://www.instagram.com/a.merry.little.heart",
    youtube: "",
    // Social links imported from GitHub profile (populated by github-sync.sh)
    // Each item has: { provider: "linkedin" | "generic" | etc., url: "https://..." }
    socialLinks: []
  },

  // Legal pages specific settings
  legal: {
    // Privacy policy last updated date
    privacyPolicyLastUpdated: "2024-01-15",

    // Terms of use last updated date
    termsLastUpdated: "2024-01-15",

    // CCPA/CPRA compliance for California state
    isCaliforniaCompliant: true,

    // Do Not Sell page additional information
    doNotSell: {
      processingTime: "15 business days",
      confirmationRequired: true
    }
  },

  // Search configuration
  search: {
    // Enable/disable search functionality
    enabled: false,

    // UI options
    placeholder: 'Search...',
    noResultsText: 'No results found',

    // Search behavior
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 10,

    // Result display options
    showCategories: true,
    showDates: true,
    showExcerpts: true,
    excerptLength: 30
  },

  // SEO and meta information
  seo: {
    defaultTitle: "Rithesh - ML Researcher & Infrastructure Engineer",
    titleTemplate: "%s | Rithesh",
    defaultDescription: "Portfolio of Rithesh - ML Researcher & Infrastructure Engineer specializing in machine learning, AI research, and scalable systems.",
    keywords: ["machine learning", "ML researcher", "infrastructure engineer", "AI research", "software engineer", "portfolio", "Rithesh"],
    ogImage: "/avatar.jpg",
    twitterCard: "summary_large_image"
  }
};

// Export configuration
export default siteConfig;
