# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow & Branching Strategy

### Branch Structure
- **main** - Production/stable (protected branch)
  - Only receives merges from `develop` via pull requests
  - Represents what's currently live

- **develop** - Development & testing
  - Base branch for all feature and bugfix branches
  - Where testing happens before production release
  - Merged into `main` via PR when ready to release

- **feature/\*** - New features
  - Created from: `develop`
  - Example: `feature/add-dark-mode`, `feature/improve-animations`
  - Merged back to: `develop` via PR

- **bugfix/\*** - Bug fixes
  - Can be created from `develop` for normal fixes
  - Created from `main` for critical hotfixes (e.g., `bugfix/critical-fixes`)
  - Critical fixes need to be merged back into both `main` AND `develop`

### Workflow for New Work
1. **Start from develop**: `git checkout develop && git pull origin develop`
2. **Create feature branch**: `git checkout -b feature/descriptive-name`
3. **Work locally**: Make commits, test with `npm run dev`
4. **Test thoroughly**: Run `npm run build` before pushing
5. **Push & Create PR**: `git push -u origin feature/descriptive-name`
6. **Review & Test**: Test in Vercel preview deployment
7. **Merge to develop**: After approval, merge via GitHub PR

### Workflow for Releases
1. **Ensure develop is stable**: All features tested
2. **Create PR**: develop → main
3. **Merge to main**: Marks release
4. **Tag release** (optional): `git tag -a v1.0.0`

## Project Overview

Personal portfolio website built with **Astro 4** and **TypeScript**. The site features multiple sections (hero, experience, tech stack, about), internationalization (English/Spanish), dark mode support, and scroll-based animations.

## Quick Start Commands

```bash
npm run dev          # Start local dev server (port 4321)
npm run build        # Build with type checking (astro check && astro build)
npm run preview      # Preview production build locally
npm run astro ...    # Run Astro CLI commands directly
```

## Architecture & File Structure

### Core Directories

- **`/src/pages/`** - Astro pages. Currently only `index.astro` (the main portfolio page)
- **`/src/components/`** - Reusable Astro components organized by section
  - `Header.astro` - Fixed navigation header with scroll-based effects
  - `LanguageSelector.astro` - Language switcher (EN/ES)
  - Section components: `HeroSection/`, `TechsSection/`, `ExperienceTimeLine/`, etc.
  - `SectionContainer.astro` - Wrapper for consistent section styling
- **`/src/layout/`** - Global layout wrapper and icon assets
  - `Layout.astro` - HTML structure, meta tags, GA integration
  - `icons/` - Organized SVG icon components by category (languages, databases, devtools, frameworks, libraries)
  - `Typography.astro` - Semantic typography component (h1, h2, p, etc.)
- **`/src/i18n/`** - Internationalization system
  - `index.ts` - Translation functions and type definitions
  - `en.json`, `es.json` - Translation dictionaries
- **`/src/hooks/`** - Directory exists but currently minimal usage

### Styling & Configuration

- **Tailwind CSS** for utility-first styling with custom animations (scroll, fadeIn)
- **Dark mode** via Tailwind's `dark:` prefix and `class` strategy (hard-coded to dark in Layout)
- **Google Analytics** integrated via PartyTown script
- **ViewTransitions** for client-side page animations

## Key Patterns & Conventions

### Language Handling

Language is determined by URL query parameter (`?lang=en` or `?lang=es`) or defaults to English on server, with client-side detection via `getBrowserLang()`. The `lang` prop is passed through the component hierarchy.

**Translation API** (from `src/i18n/index.ts`):
```typescript
import { t, type Lang, getBrowserLang, getAllTranslations } from '../i18n';

t(lang, 'key')              // Get translated string
getAllTranslations(lang)    // Get all translations for a language
getBrowserLang()            // Detect browser language (client-side only)
```

**i18n Module Structure**:
- `src/i18n/index.ts` - Core translation functions and `Lang` type (valid: 'en' | 'es')
- `src/i18n/en.json` - English translations with nested keys
- `src/i18n/es.json` - Spanish translations with same structure as English

**Important**: Both JSON files must have identical key structure to prevent runtime errors.

### Component Pattern

All components using translations must import from `src/i18n/` module. Standard pattern:
```astro
---
import { t, type Lang } from '../i18n';

interface Props {
  lang: Lang;
}
const { lang = 'en' } = Astro.props;
---

<div>{t(lang, 'some_key')}</div>
```

**Critical**: Must commit `src/i18n/` module files to repository. Missing this causes Vercel build failures.

### Icons

Icons are organized Astro components in `/src/layout/icons/` by category. They accept a `class` prop for Tailwind styling:
```astro
<BriefcaseIcon class="size-7 text-black dark:text-white" />
```

### Scroll-Based Animation

The Layout uses CSS `animation-timeline: scroll()` and custom animations for effects like nav blur on scroll. See `Header.astro` for example.

### Navigation Highlighting

`Header.astro` uses an Intersection Observer to highlight nav links based on which section is in view. It cleans up observers on visibility change.

## Current State (Branch: develop)

The repository is on the `develop` branch, freshly created from `main` (2026-03-08). The `bugfix/critical-fixes` branch contains recent critical fixes and i18n integration that will be merged back to develop and main.

### Recent Commits & Fixes (from bugfix/critical-fixes)

1. **Commit 1d292a5** - "docs: Update CLAUDE.md with deployment insights" ✅
   - Comprehensive documentation of deployment issues and solutions

2. **Commit 22b44d4** - "Add i18n module files" ✅
   - Added missing `src/i18n/` module files to repository
   - Resolved Vercel deployment ERROR caused by missing i18n imports
   - Deployment now **READY** and building successfully

3. **Commit ddfb6ea** - "Refactor components and fix build issues"
   - Refactored Header, ExperienceTimeLine, ExperienceItem, Hero, and TechStackSection components
   - Integrated LanguageSelector into Header component
   - Updated dependencies and astro.config.mjs

4. **Commit 7bee06b** - "Fix critical bugs in i18n feature"
   - Fixed Google Analytics: Correct GA_MEASUREMENT_ID in gtag config
   - Fixed HTML structure: Removed orphan closing `</div>` tags in Layout.astro
   - Removed invalid empty @media() block with dead CSS code
   - Removed updateHeroSection() function with incorrect DOM IDs from LanguageSelector
   - Added i18n support to AboutMeSection with server-side age calculation
   - Fixed Tailwind typo: itemss-center → items-center

### Next Steps
- Merge `bugfix/critical-fixes` into `develop` for testing
- Create feature branches from `develop` for new work
- Test thoroughly before merging to `main`

### Important: i18n Module Must Always Be Committed

⚠️ **Critical lesson learned**: The `src/i18n/` directory must be committed to the repository. Components reference i18n imports, and missing this module will cause **"Cannot find module '../i18n'"** errors during Vercel builds, even if the local build passes.

**What happened**:
- Commit ddfb6ea refactored components to use i18n but didn't include the i18n module files
- Vercel build failed with 7 TypeScript errors about missing i18n module
- Local build passed because node_modules had the previous version
- Solution: Commit 22b44d4 added the missing `src/i18n/` files, build succeeded

## Development Notes

- **Type checking** is run before builds via `astro check`
- **Build command** runs both type checking and build: `npm run build` = `astro check && astro build`
- **No testing framework** currently configured
- **Component imports** use relative paths from current directory
- **Assets** (images, fonts) should go in `/public/`
- **Local font** is imported globally: `@fontsource-variable/inter`
- **Vercel builds** run in isolated environments without previous node_modules; all source files must be committed
- **i18n module** (`src/i18n/`) is essential and must be committed to repository

## Vercel Deployment & Common Issues

### Build Process
- Vercel runs `npm run build` which executes: `astro check && astro build`
- `astro check` performs TypeScript validation on all `.astro` components
- Build fails immediately on `astro check` errors (before `astro build` starts)

### Common Errors & Solutions

**Error: "Cannot find module '../i18n'"**
- **Cause**: Components import from i18n but `src/i18n/` files not committed to repository
- **Solution**: Always commit `src/i18n/` directory when refactoring components
- **Prevention**: Remember that local builds work because node_modules cache exists; Vercel starts fresh

**Error: Orphan closing tags in Layout.astro**
- **Status**: Fixed in commit 7bee06b
- **Was causing**: HTML structure validation errors

**Mismatched DOM IDs in LanguageSelector**
- **Status**: Fixed in commit 7bee06b
- **Was causing**: updateHeroSection() function tried to update non-existent IDs

### Deployment Status
- Latest stable deployment: Commit **22b44d4** on `bugfix/critical-fixes` (2026-03-08)
- Status: **✅ READY** at `portfolio-astro-ip5307xu8-facus-projects-5d815a58.vercel.app`
- Pending merge: `bugfix/critical-fixes` → `develop` → `main`
