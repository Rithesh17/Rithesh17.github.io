# Website Design Document

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Route Structure](#route-structure)
4. [Component Architecture](#component-architecture)
5. [Data Structure](#data-structure)
6. [Design System](#design-system)
7. [Content Strategy](#content-strategy)
8. [Implementation Phases](#implementation-phases)
9. [Technical Specifications](#technical-specifications)
10. [Future Extensibility](#future-extensibility)

---

## Overview

### Purpose

This document outlines the design and architecture for transforming the current personal portfolio website into a comprehensive, multi-section website with three main areas: **Portfolio**, **Photography**, and **Blog**.

### Goals

1. **Create a structured portfolio section** with detailed subsections for Experience, Education, Projects, Skills, and Contact
2. **Establish placeholder sections** for Photography and Blog (to be developed later)
3. **Leverage statue-ssg capabilities** to their fullest extent
4. **Maintain consistency** with existing design and components
5. **Ensure extensibility** for future features and sections

### Current State

- **Framework**: statue-ssg (SvelteKit-based static site generator)
- **Current Routes**: Homepage, About, Repositories, Timeline, Resume, Mac Desktop
- **Existing Components**: Sidebar, RepoCard, ContributionGraph, TimelineWidget, MacWindow
- **Data Sources**: JSON files (repositories.json, contributions.json), site.config.js

### Target State

- **Three Main Sections**: Portfolio, Photography (under development), Blog (under development)
- **Portfolio Hub**: Central portfolio page with 5 subsections
- **Rich Content**: Experience timelines, education history, project showcases, skills matrix, contact information
- **Seamless Navigation**: Clear hierarchy and intuitive user flow

---

## Architecture

### Technology Stack

- **Framework**: SvelteKit with statue-ssg
- **Styling**: Tailwind CSS (via statue-ssg) + Custom CSS
- **Content**: Markdown (for blog/projects) + JSON (for structured data)
- **Search**: Pagefind (statue-ssg integration, optional)
- **Build**: Static site generation for GitHub Pages deployment

### Design Philosophy

1. **Component Reusability**: Maximize use of existing components and statue-ssg library
2. **Data-Driven**: Separate content from presentation using JSON and Markdown
3. **Progressive Enhancement**: Start with core functionality, enhance with animations and interactions
4. **Accessibility First**: Ensure all components are accessible and keyboard navigable
5. **Performance**: Optimize for fast load times and smooth interactions

### File Organization

```
src/
├── routes/
│   ├── +layout.svelte (global layout)
│   ├── +page.svelte (homepage)
│   ├── portfolio/
│   │   ├── +page.svelte (portfolio overview)
│   │   ├── +page.server.js (portfolio data loader)
│   │   ├── experience/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.js
│   │   ├── education/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.js
│   │   ├── projects/
│   │   │   ├── +page.svelte (projects listing)
│   │   │   ├── +page.server.js
│   │   │   └── [slug]/
│   │   │       ├── +page.svelte (project detail)
│   │   │       └── +page.server.js
│   │   ├── skills/
│   │   │   ├── +page.svelte
│   │   │   └── +page.server.js
│   │   └── contact/
│   │       ├── +page.svelte
│   │       └── +page.server.js
│   ├── photography/
│   │   └── +page.svelte (under development)
│   └── blog/
│       └── +page.svelte (under development)
├── lib/
│   └── components/
│       ├── portfolio/ (new portfolio-specific components)
│       │   ├── PortfolioHero.svelte
│       │   ├── SectionCard.svelte
│       │   ├── ExperienceTimeline.svelte
│       │   ├── EducationTimeline.svelte
│       │   ├── ProjectGrid.svelte
│       │   ├── ProjectCard.svelte
│       │   ├── SkillsMatrix.svelte
│       │   └── ContactForm.svelte
│       └── UnderDevelopment.svelte
static/
├── portfolio/
│   ├── experience.json
│   ├── education.json
│   ├── projects.json
│   └── skills.json
└── assets/
    └── portfolio/ (images, logos, etc.)
content/
└── portfolio/
    └── projects/ (markdown files for detailed project descriptions)
```

---

## Route Structure

### Main Routes

```
/                          → Homepage (existing)
/portfolio                 → Portfolio overview hub
/portfolio/experience      → Experience timeline
/portfolio/education       → Education history
/portfolio/projects        → Projects listing
/portfolio/projects/[slug] → Individual project detail
/portfolio/skills          → Skills matrix
/portfolio/contact         → Contact information and form
/photography               → Under development placeholder
/blog                      → Under development placeholder
```

### Navigation Hierarchy

#### Primary Navigation (Global)
- Home
- Portfolio
- Photography (with "Coming Soon" badge)
- Blog (with "Coming Soon" badge)

#### Secondary Navigation (Portfolio Section)
- Overview
- Experience
- Education
- Projects
- Skills
- Contact Me

### Route Behavior

1. **Portfolio Overview** (`/portfolio`)
   - Displays all sections as cards
   - Quick preview of each section
   - Stats/metrics summary
   - Navigation to individual sections

2. **Section Pages** (`/portfolio/[section]`)
   - Full-page dedicated content
   - Breadcrumb navigation
   - Related sections links
   - Back to portfolio overview

3. **Under Development Pages** (`/photography`, `/blog`)
   - Hero section with "Coming Soon" message
   - Animated placeholder
   - Optional: Email notification signup
   - Optional: Estimated timeline

---

## Component Architecture

### Existing Components (Reuse)

#### Sidebar.svelte
- **Usage**: Profile card on homepage
- **Status**: Keep as-is
- **Location**: `src/lib/components/Sidebar.svelte`

#### RepoCard.svelte
- **Usage**: Adapt for project cards
- **Modifications**: Update props to match project data structure
- **Location**: `src/lib/components/RepoCard.svelte`

#### ContributionGraph.svelte
- **Usage**: GitHub activity on homepage
- **Status**: Keep as-is
- **Location**: `src/lib/components/ContributionGraph.svelte`

#### TimelineWidget.svelte
- **Usage**: Enhance for experience/education timelines
- **Modifications**: Make more flexible for different timeline types
- **Location**: `src/lib/components/TimelineWidget.svelte`

### New Portfolio Components

#### PortfolioHero.svelte
- **Purpose**: Hero section for `/portfolio` page
- **Props**:
  - `title: string` - Main heading
  - `subtitle: string` - Subheading/description
  - `stats: Array<{label: string, value: string}>` - Key metrics
- **Features**:
  - Animated background (optional)
  - Stats counter animation
  - Call-to-action button
- **Uses**: statue-ssg `Hero` component as base

#### SectionCard.svelte
- **Purpose**: Clickable cards for portfolio sections
- **Props**:
  - `title: string` - Section name
  - `description: string` - Brief description
  - `icon: string` - Icon identifier or SVG
  - `href: string` - Link to section page
  - `count?: number` - Optional item count (e.g., "5 Projects")
  - `featured?: boolean` - Highlight featured sections
- **Features**:
  - Hover animations
  - View transition effects
  - Icon illustrations
  - Gradient backgrounds

#### ExperienceTimeline.svelte
- **Purpose**: Display work experience chronologically
- **Props**:
  - `experiences: Experience[]` - Array of experience objects
  - `showDetails?: boolean` - Expandable details
- **Features**:
  - Vertical timeline layout
  - Company logos
  - Expandable entries
  - Technology tags
  - Achievement badges
- **Uses**: Enhanced version of `TimelineWidget.svelte`

#### EducationTimeline.svelte
- **Purpose**: Display education history
- **Props**:
  - `education: Education[]` - Array of education objects
- **Features**:
  - Similar to ExperienceTimeline
  - Institution logos
  - GPA and honors display
  - Relevant courses list
  - Degree icons

#### ProjectGrid.svelte
- **Purpose**: Grid layout for projects listing
- **Props**:
  - `projects: Project[]` - Array of project objects
  - `filterable?: boolean` - Enable filtering
  - `sortable?: boolean` - Enable sorting
- **Features**:
  - Responsive grid (1-3 columns)
  - Filter by technology/category
  - Search functionality
  - Featured projects highlight
- **Uses**: statue-ssg `BlogGrid` as inspiration

#### ProjectCard.svelte
- **Purpose**: Individual project card
- **Props**:
  - `project: Project` - Project object
  - `size?: 'small' | 'medium' | 'large'` - Card size variant
- **Features**:
  - Project image/thumbnail
  - Technology tags
  - Live demo and GitHub links
  - Hover effects
  - View transition to detail page
- **Uses**: Adapted from `RepoCard.svelte`

#### SkillsMatrix.svelte
- **Purpose**: Visual skills display
- **Props**:
  - `skills: SkillsData` - Skills data structure
  - `layout?: 'grid' | 'tree' | 'matrix'` - Display layout
- **Features**:
  - Category grouping
  - Proficiency levels
  - Technology icons
  - Interactive hover states
  - Filter by category
- **Uses**: statue-ssg `CollapsibleTree` for tree layout

#### ContactForm.svelte
- **Purpose**: Contact form component
- **Props**:
  - `email: string` - Contact email
  - `socialLinks: SocialLink[]` - Social media links
- **Features**:
  - Form validation
  - Email integration (via form service or API)
  - Social links display
  - Contact information display
  - Success/error states

### Utility Components

#### UnderDevelopment.svelte
- **Purpose**: Placeholder for photography and blog sections
- **Props**:
  - `sectionName: string` - Name of the section
  - `estimatedDate?: string` - Optional launch date
  - `showSignup?: boolean` - Show email signup
- **Features**:
  - Animated "Coming Soon" message
  - Section-specific messaging
  - Optional email notification signup
  - Link back to main navigation

### statue-ssg Components to Leverage

#### PageHero
- **Usage**: Section headers for all portfolio pages
- **Props**: `title`, `description`
- **Location**: Import from `statue-ssg`

#### Stats
- **Usage**: Portfolio metrics on overview page
- **Props**: Array of stat objects
- **Location**: Import from `statue-ssg`

#### WhyChooseUs
- **Usage**: Skills highlights or key strengths
- **Props**: Array of feature objects
- **Location**: Import from `statue-ssg`

#### CTA
- **Usage**: Call-to-action sections
- **Props**: Title, description, buttons
- **Location**: Import from `statue-ssg`

#### ImageCarousel
- **Usage**: Project image galleries
- **Props**: Array of images
- **Location**: Import from `statue-ssg`

#### CollapsibleTree
- **Usage**: Skills categorization
- **Props**: Tree structure data
- **Location**: Import from `statue-ssg`

#### ContentHeader & ContentBody
- **Usage**: Markdown project descriptions
- **Props**: Title, content HTML
- **Location**: Import from `statue-ssg`

#### TableOfContents
- **Usage**: Long project descriptions
- **Props**: Content HTML
- **Location**: Import from `statue-ssg`

---

## Data Structure

### JSON Data Files

All portfolio data stored in `static/portfolio/` directory as JSON files.

#### Experience Data (`experience.json`)

```json
[
  {
    "id": "exp-1",
    "title": "Software Engineer",
    "company": "Company Name",
    "location": "City, Country",
    "startDate": "2023-01",
    "endDate": "2024-12",
    "current": true,
    "type": "full-time",
    "description": "Brief role description",
    "achievements": [
      "Led development of feature X",
      "Improved performance by Y%"
    ],
    "technologies": ["React", "TypeScript", "Node.js"],
    "logo": "/assets/portfolio/companies/company-logo.png",
    "url": "https://company.com"
  }
]
```

**TypeScript Interface**:
```typescript
interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string; // YYYY-MM format
  endDate: string | null; // YYYY-MM format, null if current
  current: boolean;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
  url?: string;
}
```

#### Education Data (`education.json`)

```json
[
  {
    "id": "edu-1",
    "degree": "Bachelor of Science",
    "field": "Computer Science",
    "institution": "University Name",
    "location": "City, Country",
    "startDate": "2019-09",
    "endDate": "2023-05",
    "gpa": "3.8",
    "gpaScale": "4.0",
    "honors": ["Dean's List", "Summa Cum Laude"],
    "relevantCourses": [
      "Data Structures and Algorithms",
      "Database Systems",
      "Software Engineering"
    ],
    "logo": "/assets/portfolio/education/university-logo.png",
    "url": "https://university.edu"
  }
]
```

**TypeScript Interface**:
```typescript
interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string; // YYYY-MM format
  endDate: string; // YYYY-MM format
  gpa?: string;
  gpaScale?: string;
  honors?: string[];
  relevantCourses?: string[];
  logo?: string;
  url?: string;
}
```

#### Projects Data (`projects.json`)

```json
[
  {
    "id": "proj-1",
    "title": "Project Name",
    "description": "Short description for cards",
    "longDescription": "Detailed markdown description (or reference to markdown file)",
    "category": "Web Development",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "image": "/assets/portfolio/projects/project-image.jpg",
    "gallery": [
      "/assets/portfolio/projects/img1.jpg",
      "/assets/portfolio/projects/img2.jpg"
    ],
    "liveUrl": "https://example.com",
    "githubUrl": "https://github.com/user/repo",
    "featured": true,
    "date": "2024-01",
    "tags": ["frontend", "fullstack", "open-source"],
    "markdownPath": "portfolio/projects/project-name.md"
  }
]
```

**TypeScript Interface**:
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies: string[];
  image: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  date: string; // YYYY-MM format
  tags: string[];
  markdownPath?: string; // Path to markdown file in content/
}
```

#### Skills Data (`skills.json`)

```json
{
  "categories": [
    {
      "name": "Programming Languages",
      "skills": [
        {
          "name": "JavaScript",
          "level": "expert",
          "years": 5,
          "icon": "javascript",
          "description": "ES6+, TypeScript, Node.js"
        },
        {
          "name": "Python",
          "level": "advanced",
          "years": 3,
          "icon": "python"
        }
      ]
    },
    {
      "name": "Frameworks & Libraries",
      "skills": [
        {
          "name": "React",
          "level": "expert",
          "years": 4,
          "icon": "react"
        }
      ]
    },
    {
      "name": "Tools & Technologies",
      "skills": [
        {
          "name": "Git",
          "level": "expert",
          "years": 6,
          "icon": "git"
        }
      ]
    }
  ]
}
```

**TypeScript Interface**:
```typescript
interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years: number;
  icon?: string;
  description?: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface SkillsData {
  categories: SkillCategory[];
}
```

### Contact Data

Contact information stored in `site.config.js` under `contact` section (already exists).

**Additional Contact Data Structure**:
```typescript
interface ContactInfo {
  email: string;
  phone?: string;
  location?: string;
  socialLinks: SocialLink[];
  availability?: {
    status: 'available' | 'busy' | 'unavailable';
    message?: string;
  };
}
```

### Markdown Content

Project detailed descriptions stored in `content/portfolio/projects/` as markdown files.

**Frontmatter Structure**:
```yaml
---
title: "Project Name"
description: "Project description"
date: "2024-01-15"
technologies:
  - React
  - Node.js
category: "Web Development"
featured: true
liveUrl: "https://example.com"
githubUrl: "https://github.com/user/repo"
images:
  - /assets/portfolio/projects/img1.jpg
  - /assets/portfolio/projects/img2.jpg
---
```

---

## Design System

### Color Palette

Extend existing CSS variables with portfolio-specific colors:

```css
:root {
  /* Existing theme variables */
  --color-primary: /* existing */;
  --color-secondary: /* existing */;
  --color-background: /* existing */;
  --color-foreground: /* existing */;
  
  /* Portfolio-specific variables */
  --portfolio-primary: var(--color-primary);
  --portfolio-accent: /* accent color */;
  --section-card-bg: var(--color-card);
  --section-card-hover: /* hover state */;
  --timeline-color: var(--color-primary);
  --timeline-dot: var(--color-primary);
  --skill-level-beginner: /* color */;
  --skill-level-intermediate: /* color */;
  --skill-level-advanced: /* color */;
  --skill-level-expert: /* color */;
}
```

### Typography

- **Headings**: Use existing heading styles
- **Body**: Use existing body text styles
- **Portfolio-specific**: 
  - Section titles: Larger, bold
  - Card titles: Medium, semi-bold
  - Descriptions: Regular, readable

### Spacing

- **Section padding**: Consistent vertical rhythm
- **Card gaps**: Responsive (1rem mobile, 2rem desktop)
- **Content width**: Max-width containers (1200px for content, 1400px for grids)

### Components Styling

#### Section Cards
- **Size**: Responsive (full-width mobile, 2-column tablet, 4-column desktop)
- **Padding**: 2rem
- **Border radius**: 12px
- **Shadow**: Subtle on hover
- **Transition**: 0.3s ease

#### Timeline
- **Line**: Vertical, 2px width
- **Dots**: 12px circle, colored
- **Cards**: Left-aligned, with connecting line
- **Spacing**: 2rem between entries

#### Project Cards
- **Aspect ratio**: 16:9 for images
- **Overlay**: On hover, show actions
- **Tags**: Small, rounded, colored
- **Links**: Icon buttons

#### Skills Matrix
- **Grid**: Responsive (2-4 columns)
- **Level indicators**: Progress bars or badges
- **Icons**: 32px, colored
- **Categories**: Collapsible sections

### Animations

#### View Transitions
- **Page transitions**: Use View Transitions API (already implemented)
- **Section navigation**: Smooth fade/slide
- **Card hover**: Scale and shadow increase

#### Scroll Animations
- **Fade in**: On scroll into viewport
- **Stagger**: For grid items
- **Timeline**: Progressive reveal

#### Micro-interactions
- **Button hover**: Color transition
- **Link hover**: Underline animation
- **Card hover**: Lift effect
- **Icon hover**: Scale and color change

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

---

## Content Strategy

### Content Types

1. **Structured Data (JSON)**
   - Experience entries
   - Education history
   - Projects metadata
   - Skills data
   - Fast to load, easy to update

2. **Markdown Content**
   - Detailed project descriptions
   - Blog posts (future)
   - Photography descriptions (future)
   - SEO-friendly, version-controlled

3. **Static Assets**
   - Images (projects, companies, institutions)
   - Logos
   - Icons
   - Optimized for web

### Content Management

#### Adding New Experience
1. Edit `static/portfolio/experience.json`
2. Add entry with required fields
3. Add company logo to `static/assets/portfolio/companies/`
4. Rebuild site

#### Adding New Project
1. Add metadata to `static/portfolio/projects.json`
2. Create markdown file in `content/portfolio/projects/`
3. Add images to `static/assets/portfolio/projects/`
4. Rebuild site

#### Updating Skills
1. Edit `static/portfolio/skills.json`
2. Update categories or skill levels
3. Rebuild site

### SEO Strategy

#### Meta Tags
- **Title**: `{Section} | Portfolio | {Site Name}`
- **Description**: Section-specific descriptions
- **Keywords**: Relevant keywords per section
- **OG Image**: Section-specific images

#### Structured Data (JSON-LD)
- **Person**: Profile information
- **Organization**: Work experience
- **Educational Credential**: Education entries
- **Project**: Individual projects

#### Sitemap
- Include all portfolio routes
- Update on build
- Submit to search engines

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goals**: Establish route structure and data foundation

**Tasks**:
1. Create route directories
   - `/portfolio` and subdirectories
   - `/photography` and `/blog` placeholders
2. Create data structure
   - JSON schema files
   - Sample data files
   - TypeScript interfaces
3. Create UnderDevelopment component
   - Reusable placeholder component
   - Add to photography and blog routes
4. Update navigation
   - Add Portfolio, Photography, Blog to main nav
   - Update `site.config.js` navbar config
5. Update build configuration
   - Add routes to `svelte.config.js` prerender entries

**Deliverables**:
- Route structure in place
- Data files with sample content
- Under development pages functional
- Navigation updated

### Phase 2: Portfolio Overview (Week 2)

**Goals**: Build portfolio hub page

**Tasks**:
1. Create PortfolioHero component
   - Hero section with title and stats
   - Use statue-ssg `Hero` as base
2. Create SectionCard component
   - Reusable card component
   - Hover animations
   - View transitions
3. Build portfolio overview page
   - Hero section
   - Section cards grid
   - Stats section (using statue-ssg `Stats`)
   - Featured projects preview
4. Create portfolio data loader
   - `+page.server.js` for portfolio route
   - Load all portfolio data
5. Add portfolio sub-navigation
   - Breadcrumbs or sidebar
   - Active state handling

**Deliverables**:
- Portfolio overview page functional
- Section cards linking to subsections
- Data loading working
- Navigation complete

### Phase 3: Experience & Education (Week 3)

**Goals**: Build experience and education pages

**Tasks**:
1. Enhance TimelineWidget or create ExperienceTimeline
   - Support for experience data structure
   - Company logos
   - Technology tags
   - Expandable details
2. Create Experience page
   - Use PageHero for header
   - Timeline layout
   - Filter/sort options (optional)
3. Create EducationTimeline component
   - Similar to ExperienceTimeline
   - Education-specific features
4. Create Education page
   - Timeline layout
   - GPA and honors display
   - Courses list
5. Add data loaders
   - `+page.server.js` for each section

**Deliverables**:
- Experience page with timeline
- Education page with timeline
- Data loading and display working
- Responsive design

### Phase 4: Projects (Week 4)

**Goals**: Build projects showcase

**Tasks**:
1. Create ProjectCard component
   - Adapt from RepoCard
   - Project-specific features
   - Image display
   - Technology tags
2. Create ProjectGrid component
   - Responsive grid layout
   - Filter by technology/category
   - Search functionality
   - Featured projects highlight
3. Build projects listing page
   - Grid layout
   - Filter and search
   - Sort options
4. Create project detail pages
   - Dynamic route `[slug]`
   - Markdown content rendering
   - Image carousel
   - Live demo and GitHub links
5. Set up markdown content
   - Create `content/portfolio/projects/` directory
   - Sample project markdown files
   - Frontmatter structure

**Deliverables**:
- Projects listing page
- Individual project pages
- Markdown integration working
- Filter and search functional

### Phase 5: Skills (Week 5)

**Goals**: Build skills matrix page

**Tasks**:
1. Create SkillsMatrix component
   - Multiple layout options (grid, tree, matrix)
   - Category grouping
   - Proficiency level indicators
   - Technology icons
2. Build skills page
   - Use PageHero for header
   - Skills matrix display
   - Filter by category
   - Search functionality
3. Add skill level visualization
   - Progress bars
   - Color coding
   - Years of experience
4. Integrate CollapsibleTree
   - Use statue-ssg component for tree layout
   - Collapsible categories

**Deliverables**:
- Skills page functional
- Multiple layout options
- Visual proficiency indicators
- Responsive design

### Phase 6: Contact (Week 6)

**Goals**: Build contact page

**Tasks**:
1. Create ContactForm component
   - Form validation
   - Email integration
   - Success/error states
2. Build contact page
   - Contact information display
   - Social links
   - Contact form
   - Map (optional)
3. Add contact data
   - Update `site.config.js`
   - Add social links
   - Add availability status
4. Integrate form service
   - Email service (Formspree, Netlify Forms, etc.)
   - Or API endpoint

**Deliverables**:
- Contact page functional
- Form working
- Social links displayed
- Contact information complete

### Phase 7: Polish & Enhancement (Week 7)

**Goals**: Refine and enhance

**Tasks**:
1. Animations and transitions
   - View Transitions for navigation
   - Scroll animations
   - Hover effects
   - Loading states
2. SEO optimization
   - Meta tags for all pages
   - Structured data (JSON-LD)
   - Sitemap updates
   - Open Graph images
3. Performance optimization
   - Image optimization
   - Lazy loading
   - Code splitting
   - Bundle size optimization
4. Accessibility
   - Keyboard navigation
   - Screen reader support
   - ARIA labels
   - Color contrast
5. Testing
   - Cross-browser testing
   - Mobile responsiveness
   - Performance testing
   - Accessibility testing

**Deliverables**:
- Polished user experience
- Optimized performance
- SEO-ready
- Accessible

---

## Technical Specifications

### Build Configuration

#### svelte.config.js Updates

```javascript
prerender: {
  crawl: true,
  entries: [
    '/',
    '/portfolio',
    '/portfolio/experience',
    '/portfolio/education',
    '/portfolio/projects',
    '/portfolio/skills',
    '/portfolio/contact',
    '/photography',
    '/blog'
  ],
  handleHttpError: 'warn',
  handleUnseenRoutes: 'ignore' // Important for dynamic routes
}
```

### Server-Side Data Loading

#### Portfolio Layout Loader (`portfolio/+layout.server.js`)

```javascript
export async function load() {
  // Load all portfolio data
  const experience = loadJSON('static/portfolio/experience.json');
  const education = loadJSON('static/portfolio/education.json');
  const projects = loadJSON('static/portfolio/projects.json');
  const skills = loadJSON('static/portfolio/skills.json');
  
  return {
    experience,
    education,
    projects,
    skills
  };
}
```

#### Section Page Loaders

Each section page has its own `+page.server.js`:
- Load specific section data
- Load related data (e.g., projects for experience)
- Handle errors gracefully

### Type Safety

#### TypeScript Interfaces

Create `src/lib/types/portfolio.ts`:
- Experience interface
- Education interface
- Project interface
- Skills interfaces
- Contact interface

#### Type Usage

- Type all component props
- Type server load functions
- Type data loaders
- Enable strict TypeScript checking

### Image Optimization

#### Image Requirements

- **Format**: WebP with JPEG fallback
- **Sizes**: Multiple sizes for responsive images
- **Lazy loading**: Implement for all images
- **Alt text**: Required for accessibility

#### Image Organization

```
static/assets/portfolio/
├── companies/
│   └── [company-name].png
├── education/
│   └── [institution-name].png
└── projects/
    └── [project-name]/
        ├── thumbnail.jpg
        └── gallery/
            ├── img1.jpg
            └── img2.jpg
```

### Search Integration

#### Enable Search

Update `site.config.js`:
```javascript
search: {
  enabled: true,
  placeholder: 'Search portfolio...',
  // ... other config
}
```

#### Search Indexing

- Index portfolio content
- Include project descriptions
- Include experience and education
- Update on build

### Analytics (Optional)

#### Implementation

- Google Analytics
- Plausible Analytics
- Or custom analytics

#### Tracking

- Page views
- Section navigation
- Project clicks
- Contact form submissions

---

## Future Extensibility

### Photography Section

#### Planned Features

1. **Gallery Component**
   - Grid layout
   - Lightbox for full-size images
   - Category filtering
   - Tag system

2. **Image Display**
   - Responsive images
   - Lazy loading
   - EXIF data display
   - Image metadata

3. **Content Structure**
   - Albums/collections
   - Individual photo pages
   - Markdown descriptions
   - Date and location

#### Data Structure

```json
{
  "albums": [
    {
      "id": "album-1",
      "title": "Nature Photography",
      "description": "Collection of nature photos",
      "coverImage": "/assets/photography/albums/nature/cover.jpg",
      "photos": [...],
      "date": "2024-01",
      "tags": ["nature", "landscape"]
    }
  ]
}
```

### Blog Section

#### Planned Features

1. **Blog System**
   - Use statue-ssg markdown blog
   - Blog listing page
   - Individual post pages
   - Category/tag filtering

2. **Content Features**
   - RSS feed
   - Related posts
   - Author information
   - Reading time

3. **Integration**
   - Comments (optional)
   - Social sharing
   - Newsletter signup

#### Content Structure

- Markdown files in `content/blog/`
- Frontmatter for metadata
- Categories and tags
- Featured posts

### Additional Portfolio Sections

#### Potential Additions

1. **Certifications**
   - Certification timeline
   - Badges and credentials
   - Verification links

2. **Publications**
   - Articles and papers
   - Conference presentations
   - Research work

3. **Awards**
   - Awards and recognition
   - Timeline display
   - Details and links

### Enhanced Features

#### Interactive Elements

1. **Project Filtering**
   - Advanced filters
   - Technology tags
   - Date ranges
   - Category filters

2. **Skills Visualization**
   - Interactive skill tree
   - Skill comparison
   - Learning path

3. **Timeline Enhancements**
   - Interactive timeline
   - Filter by type
   - Search functionality

---

## Conclusion

This design document provides a comprehensive blueprint for transforming the current portfolio website into a full-featured, multi-section website. The design emphasizes:

1. **Structure**: Clear route hierarchy and navigation
2. **Reusability**: Maximum use of existing components and statue-ssg library
3. **Extensibility**: Easy to add new sections and features
4. **Performance**: Optimized for fast load times
5. **User Experience**: Intuitive navigation and interactions

The phased implementation approach allows for incremental development and testing, ensuring each phase is complete before moving to the next.

---

## Appendix

### A. Component Dependency Graph

```
Portfolio Overview
├── PortfolioHero
├── SectionCard (x5)
├── Stats (statue-ssg)
└── ProjectGrid (preview)

Experience Page
├── PageHero (statue-ssg)
├── ExperienceTimeline
└── Navigation

Education Page
├── PageHero (statue-ssg)
├── EducationTimeline
└── Navigation

Projects Page
├── PageHero (statue-ssg)
├── ProjectGrid
│   └── ProjectCard (xN)
└── Navigation

Project Detail
├── ContentHeader (statue-ssg)
├── ImageCarousel (statue-ssg)
├── ContentBody (statue-ssg)
└── TableOfContents (statue-ssg)

Skills Page
├── PageHero (statue-ssg)
├── SkillsMatrix
│   └── CollapsibleTree (statue-ssg)
└── Navigation

Contact Page
├── PageHero (statue-ssg)
├── ContactForm
└── Social Links
```

### B. Data Flow Diagram

```
User Request
    ↓
Route Handler
    ↓
+page.server.js
    ↓
Load JSON/Markdown
    ↓
Process Data
    ↓
Pass to Component
    ↓
Render Page
```

### C. File Naming Conventions

- **Components**: PascalCase (e.g., `PortfolioHero.svelte`)
- **Routes**: kebab-case (e.g., `portfolio/experience/`)
- **Data files**: kebab-case (e.g., `experience.json`)
- **Images**: kebab-case (e.g., `company-logo.png`)
- **Markdown**: kebab-case (e.g., `project-name.md`)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Planning Phase
