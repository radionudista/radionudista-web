# Project Context

## Purpose

**Nudista Radio Aura Glass** is a modern, multilingual web radio platform designed to deliver live streaming content with a premium user experience. The project provides:

- 24/7 live radio streaming with custom audio player featuring real-time track information and cover art
- Integrated Twitch live video streaming with privacy/ad-blocker detection and fallback
- Dynamic, multilingual content management system using Markdown files with YAML frontmatter
- Glassmorphism UI with responsive design for mobile and desktop, custom typography, and background video transitions
- Countdown teaser functionality for launches and special events
- Program-specific audio playback with individual show metadata
- Accessibility features including ARIA labels, keyboard navigation, and screen reader support

The platform is built for extensibility, allowing easy addition of new languages and content without code changes, while maintaining a seamless user experience across all devices. It serves as both a radio station website and a social experimental club for diverse voices.

## Tech Stack

### Core Framework & Build Tools

- **Vite 5.4** - Build tool and dev server with hot module replacement
- **React 18.3** - UI framework with functional components and hooks
- **TypeScript 5.5** - Type-safe development with strict mode
- **React Router DOM 6.26** - Client-side routing with language-aware routing

### UI & Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework with custom glassmorphism design system
- **Shadcn UI** - Component library built on Radix UI primitives
- **Radix UI** - Accessible, unstyled component primitives (Accordion, Dialog, Dropdown, Popover, Tabs, Toast, etc.)
- **Lucide React 0.462** - Icon library for consistent iconography
- **Class Variance Authority 0.7** - Component variant management
- **Tailwind Merge 2.5** - Utility class merging and conflict resolution
- **Tailwind Typography 0.5** - Typography plugin for prose content
- **Next Themes 0.3** - Theme management (currently using dark theme only)
- **React Helmet Async 2.0** - Document head management for SEO

### State Management & Data

- **React Context API** - Global state management (AudioContext, DebugContext, VideoContext)
- **TanStack Query (React Query) 5.56** - Server state management for API calls
- **React Hook Form 7.53** - Form state management with validation
- **Zod 3.23** - Schema validation for forms and configuration
- **Local Storage** - Persistence for audio settings and user preferences

### Internationalization

- **i18next 25.3** - Internationalization framework
- **react-i18next 15.6** - React bindings for i18next
- **i18next-browser-languagedetector 8.2** - Automatic language detection from browser settings
- Subdirectory-based routing (`/es/`, `/pt/`) for language-specific content

### Content Management

- **Gray Matter 4.0** - YAML frontmatter parsing for markdown content
- **React Markdown 10.1** - Markdown rendering with custom components
- **Fast Glob 3.3** - File system pattern matching for content discovery
- Custom Vite plugins:
  - `contentJsonGenerator` - Indexes all markdown content at build time
  - `multiLanguageBuild` - Handles language-specific builds

### Development Tools

- **ESLint 9.9** - Code linting with TypeScript support
- **TypeScript ESLint 8.0** - TypeScript-specific linting rules
- **Bun/npm** - Package management (Bun preferred for development)
- **PostCSS 8.4** - CSS processing with Autoprefixer 10.4
- **Vite Plugin React SWC 3.5** - React compilation with SWC for faster builds
- **Lovable Tagger 1.1** - Development workflow tool

### Audio & Media

- **HTML5 Audio API** - Native audio playback with custom controls
- **Twitch Player API** - Embedded live video streaming
- **Custom Audio Services** - Audio validation, error handling, and stream management
- **Date-fns 3.6** - Date manipulation for countdown and scheduling

### Additional Libraries

- **Recharts 2.12** - Charting library for data visualization
- **Embla Carousel React 8.3** - Carousel/slider functionality
- **React Resizable Panels 2.1** - Resizable panel layouts
- **Sonner 1.5** - Toast notifications
- **Vaul 0.9** - Drawer component
- **CMDK 1.0** - Command menu component

## Project Conventions

### Code Style

- **Language**: TypeScript for all source files (`.ts`, `.tsx`)
- **Formatting**:
  - 2-space indentation
  - ES2020+ syntax
  - Functional components with hooks (no class components)
  - Arrow functions preferred for component definitions
- **Naming Conventions**:
  - Components: PascalCase (e.g., `RadioPlayer.tsx`, `BackgroundVideo.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useTranslation`, `useVolumeControl`)
  - Utilities: camelCase (e.g., `contentLoader.ts`, `audioService.ts`)
  - Constants: UPPER_SNAKE_CASE for true constants, camelCase for config objects
  - Types/Interfaces: PascalCase (defined in `src/types/index.ts`)
- **File Organization**:
  - One component per file
  - Co-locate related utilities with components when appropriate
  - Shared utilities in `src/lib/` or `src/utils/`
  - Service layer in `src/services/`
  - Constants in `src/constants/`
  - Contexts in `src/contexts/`
  - Custom hooks in `src/hooks/`
- **Import Order**: External dependencies → Internal modules → Types → Styles
- **ESLint Rules**:
  - React Hooks rules enforced
  - TypeScript unused vars warnings disabled
  - React Refresh component export warnings enabled

### Architecture Patterns

#### SOLID Principles

The codebase follows SOLID principles throughout:

- **Single Responsibility Principle**: Each module has one clear purpose (e.g., `AudioContext` manages audio state, `streamService` handles stream API calls)
- **Open/Closed Principle**: Services and components are extensible through configuration and composition
- **Liskov Substitution Principle**: Interface-based design allows component substitution
- **Interface Segregation Principle**: Small, focused interfaces (e.g., `AudioPlayerState`, `AudioPlayerActions`)
- **Dependency Inversion Principle**: Depends on abstractions (services, contexts) not concrete implementations

#### Component Architecture

- **Composition over inheritance**: Build complex UIs from simple, reusable components
- **Container/Presentational pattern**: Separate data logic from presentation
- **Custom hooks**: Extract reusable stateful logic into custom hooks
- **Context providers**: Use React Context for cross-cutting concerns (audio, debug, video)
- **Service layer**: Separate business logic from UI components

#### State Management

- **Local state**: `useState` for component-specific state
- **Shared state**: React Context for app-wide state (AudioContext, DebugContext, VideoContext)
- **Server state**: TanStack Query for API data fetching and caching
- **Form state**: React Hook Form with Zod validation
- **Persistence**: LocalStorage for user preferences (volume, mute state, audio state)

#### Content Management System

- **Markdown-based**: All content stored as `.md` files in `src/content/{lang}/`
- **Frontmatter validation**: Required fields enforced via build-time validation scripts
- **Auto-indexing**: Vite plugin generates `contentIndex.json` at build time
- **Dynamic routing**: Content automatically routed based on slug and language
- **Component mapping**: Frontmatter `component` field determines which React component renders content
- **Required frontmatter fields** (for ProgramPage):
  - `language`, `title`, `slug`, `id`, `component`, `public`, `program_order`, `schedule`, `talent`, `social`, `logo`
- **Optional frontmatter fields**: `date`, `audio_source`, `description`, `menu`, `menu_position`

#### Multilingual Architecture

- **Subdirectory routing**: Language-specific routes (e.g., `/es/`, `/pt/`)
- **Automatic detection**: Browser language detection with fallback to default
- **Translation files**: JSON files in `src/lang/{lang}.json`
- **Content separation**: Separate content directories per language
- **Environment-driven**: Supported languages configured via `VITE_SUPPORTED_LANGUAGES`
- **Language detection order**: Path → LocalStorage → Navigator → HTML tag

#### Plugin System

- **Content JSON Generator** (`src/plugins/contentJsonGenerator.ts`):
  - Scans `src/content/{lang}/` directories
  - Parses frontmatter from markdown files
  - Generates `public/contentIndex.json` for runtime access
  - Validates required fields
- **Multi-Language Build** (`src/plugins/multiLanguageBuild.ts`):
  - Handles language-specific builds
  - Generates language-specific HTML files
  - Manages routing for different languages

### Testing Strategy

- **Current State**: No formal testing framework currently implemented
- **Validation**:
  - Frontmatter validation scripts (`scripts/validate-frontmatter.js`)
  - Auto-fix scripts (`scripts/fix-frontmatter.js`)
  - Pre-commit hooks for content validation
  - TypeScript type checking at build time
  - ESLint for code quality
- **Manual Testing**: Development server with hot reload for rapid iteration
- **Future Considerations**:
  - Unit tests for utilities and hooks (Vitest recommended)
  - Component tests for UI components (React Testing Library)
  - E2E tests for critical user flows (Playwright/Cypress)
  - Audio playback testing across browsers
  - Accessibility testing with screen readers

### Git Workflow

- **Branching**: Feature branches merged to main
- **Commit Conventions**: Descriptive commit messages (no strict convention enforced)
- **Pre-commit Hooks**: Frontmatter validation runs before commits
- **Build Validation**: All builds run frontmatter validation before bundling
- **Scripts**:
  - `npm run validate:frontmatter` - Validate all content frontmatter
  - `npm run fix:frontmatter` - Auto-fix frontmatter issues
  - `npm run fix:frontmatter:dry` - Preview frontmatter fixes without applying
  - `npm run build` - Production build with validation
  - `npm run build:dev` - Development build
  - `npm run build:feature` - Feature branch build
  - `npm run lint` - Run ESLint

## Domain Context

### Radio Broadcasting Domain

- **Live Streaming**: 24/7 audio stream from external radio server (BRLogic)
- **Stream Metadata**: Real-time track information, cover art, and status polling
- **Twitch Integration**: Embedded live video player with privacy/ad-blocker detection
- **Audio Controls**: Play/pause, volume control, mute, audio visualization
- **Countdown Teasers**: Launch countdowns for special events or new programs
- **Program Playback**: Individual program audio files with metadata
- **Multi-source Audio**: Switch between live radio stream and program audio

### Content Types

- **Programs**: Individual radio shows with metadata (title, description, audio, cover art, schedule, talent, social)
- **Static Pages**: About, Contact, and other informational pages
- **Dynamic Content**: Markdown-based content with frontmatter metadata
- **Navigation**: Auto-generated from content with `menu` and `menu_position` fields
- **Page Components**: `SimplePage` for static content, `ProgramPage` for radio shows

### User Experience Patterns

- **Glassmorphism Design**: Frosted glass effect with backdrop blur (flat dark design in current implementation)
- **Background Media**: Video backgrounds with smooth transitions
- **Responsive Layouts**: Mobile-first design with desktop enhancements
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, screen reader support, high contrast mode compatibility
- **Performance**: Lazy loading, code splitting, optimized assets
- **Audio Continuity**: Persistent audio playback across page navigation
- **Error Handling**: User-friendly error messages for audio playback issues

### Key Features

- **NakedTalks**: Open mic events every Thursday on social networks
- **Conceptual Events**: Parties, launches, and gatherings
- **Music Curation**: Experimental sounds, noise, distortion, and unconventional music
- **Community-driven**: Collaborative platform open to new proposals
- **No Judgment Zone**: Safe space for sharing projects, experiences, and ideas

## Important Constraints

### Technical Constraints

- **Client-side only**: Static site generation, no server-side rendering
- **Environment variables**: All config must use `VITE_` prefix to be exposed to client
- **Browser compatibility**: Modern browsers only (ES2020+)
- **Twitch embed**: Requires parent domain whitelisting via `VITE_TWITCH_STATIC_PARENTS`
- **Audio streaming**: Dependent on external radio server availability
- **Build-time content**: Content changes require rebuild and redeploy
- **CORS restrictions**: Audio files must be hosted on CORS-friendly services (not Google Drive)
- **Autoplay restrictions**: Browser autoplay policies require user interaction

### Content Constraints

- **Frontmatter requirements**: All content must have valid frontmatter with required fields
- **Language consistency**: Each language must have complete content set
- **Menu ordering**: If `menu` is set, `menu_position` is mandatory
- **Public flag**: Only `public: true` content is indexed and accessible
- **Component mapping**: Content must reference valid React component names (`SimplePage`, `ProgramPage`)
- **Audio hosting**: Program audio must be hosted on accessible, CORS-friendly services

### Performance Constraints

- **Static hosting**: Must work on CDN/static hosts (no server-side logic)
- **Asset optimization**: Images, videos, and audio must be optimized for web
- **Bundle size**: Keep JavaScript bundle size reasonable for fast loading
- **API polling**: Radio status polling interval configurable via env vars (default 10000ms)
- **Memory management**: Proper cleanup of audio instances to prevent memory leaks

### Business Constraints

- **Multilingual support**: Must support Spanish (es) and Portuguese (pt) at minimum
- **Brand consistency**: Glassmorphism design and custom typography required
- **Content flexibility**: Non-technical users should be able to add content via markdown
- **Debug mode**: Debug features must be hidden in production builds
- **Accessibility**: Must meet WCAG 2.1 Level AA standards

## External Dependencies

### Streaming Services

- **BRLogic Radio Server**:
  - Stream URL: Configured via `VITE_RADIO_STREAM_URL`
  - Status API: `VITE_RADIO_STATUS_URL`
  - Info API: `VITE_RADIO_INFO_URL` / `VITE_RADIO_INFO_API_URL`
  - Provides: Live audio stream, metadata, cover art
  - Polling interval: Configurable via `VITE_RADIO_STATUS_POLL_INTERVAL`
- **Twitch**:
  - Channel: Configured via `VITE_TWITCH_CHANNEL`
  - Embed API: Twitch Player JavaScript API
  - Parent domains: `VITE_TWITCH_STATIC_PARENTS` (comma-separated)
  - Provides: Live video streaming
  - Player size: `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT`

### CDN & Hosting

- **Static Hosting Providers**: Cloudflare Pages, Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront, Firebase Hosting
- **Asset Delivery**: Images, videos, fonts served from `/public` directory
- **Recommended Audio Hosting**: Archive.org, SoundCloud, Dropbox (with dl=1), or custom server/CDN

### Build-time Dependencies

- **Node.js/Bun**: Runtime for build scripts and development server (Node.js v18+ recommended)
- **Vite**: Build tool and dev server
- **TypeScript Compiler**: Type checking and transpilation
- **PostCSS/Autoprefixer**: CSS processing

### Third-party Libraries

- **Radix UI**: Accessible component primitives (no external API calls)
- **Lucide Icons**: Icon library (bundled, no external calls)
- **React Router**: Client-side routing (no external dependencies)

### Development Tools

- **ESLint**: Code quality and linting
- **TypeScript**: Type safety and IDE support
- **Git**: Version control
- **Package Managers**: npm or Bun for dependency management

### API Endpoints

- Radio status polling endpoint (configurable interval)
- Radio metadata/info endpoint
- No authentication required for public endpoints
- CORS must be configured on radio server for browser access

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client. Key variables:

- `VITE_APP_ENVIRONMENT`: `production`, `local`, or `feature`
- `VITE_APP_DEBUG`: Enable debug bar and logging
- `VITE_LAUNCHING_DATE`: ISO date for countdown teaser
- `VITE_DEV_LAUNCHING_SECONDS`: Override launch date for development
- `VITE_TWITCH_CHANNEL`: Twitch channel name
- `VITE_TWITCH_STATIC_PARENTS`: Comma-separated parent domains
- `VITE_STREAM_URL`: Direct Twitch stream URL
- `VITE_TWITCH_PLAYER_WINDOW_SIZE_PERCENT`: Player size percentage
- `VITE_RADIO_STREAM_URL`: Radio stream URL
- `VITE_RADIO_STATUS_URL`: Radio status API URL
- `VITE_RADIO_INFO_URL`: Radio info API URL
- `VITE_RADIO_STATUS_POLL_INTERVAL`: Poll interval in milliseconds
- `VITE_SUPPORTED_LANGUAGES`: Comma-separated language codes
- `VITE_DEFAULT_LANGUAGE`: Default language code

## Project Structure

```
/
├── dist/                   # Build output
├── docs/                   # Documentation (Markdown)
├── openspec/              # OpenSpec project documentation
├── public/                # Static assets
│   ├── audios/           # Program audio files
│   ├── images/           # Images, logos, backgrounds
│   ├── videos/           # Background videos
│   └── contentIndex.json # Auto-generated content index
├── scripts/              # Build and validation scripts
├── src/
│   ├── components/       # UI components
│   │   └── ui/          # Shadcn UI components
│   ├── config/          # Environment and i18n config
│   ├── constants/       # App-wide constants
│   ├── content/         # Markdown content per language
│   │   ├── es/         # Spanish content
│   │   └── pt/         # Portuguese content
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lang/            # Translation JSONs
│   ├── lib/             # Utility functions
│   ├── pages/           # Top-level page components
│   ├── plugins/         # Vite plugins
│   ├── services/        # Business logic services
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Miscellaneous utilities
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles
├── .env.*               # Environment variable files
├── package.json         # Project metadata and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── eslint.config.js     # ESLint configuration
```

## Key Services

- **AudioService** (`src/services/audioService.ts`): Audio validation, error handling, playback control
- **StreamService** (`src/services/streamService.ts`): Radio stream API integration
- **CoverImageService** (`src/services/coverImageService.ts`): Cover art fetching and caching
- **ContentLoader** (`src/lib/contentLoader.ts`): Dynamic content loading from contentIndex.json

## Accessibility Features

- ARIA labels and descriptions for all interactive elements
- Keyboard navigation support (Tab, Space, Enter, Escape)
- Screen reader announcements for state changes
- High contrast mode compatibility
- Focus indicators and visual feedback
- Semantic HTML structure
- WCAG 2.1 Level AA compliance
