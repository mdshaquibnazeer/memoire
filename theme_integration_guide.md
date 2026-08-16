# Mémoire Custom Theme TSX Specification

This document outlines the strict structural, functional, and TypeScript specifications required to generate a fully compatible visual theme component (`.tsx`) for the **Mémoire** application. 

Provide the contents of this document directly to Claude to ensure any generated theme aligns 100% with the codebase's interfaces and structural expectations.

---

## 1. File Metadata & Imports Specification
Any theme component generated for the project must adhere to the following setup rules at the absolute top of the file:
1. **Client Component Directive**: The file **must** begin with the `'use client';` directive.
2. **Core Dependencies**:
   - `react` (including `useRef`, `useState`, etc., for local interaction hooks).
   - `framer-motion` (for scroll-triggered reveals, transitions, and hover states).
   - `next/image` (for responsive, optimized image elements).
   - `lucide-react` (or custom icons/SVGs for navigation or timeline indicators).

---

## 2. Strict TypeScript Interfaces
To compile successfully inside the Next.js workspace, the theme component must include and type its props using these exact interfaces:

```typescript
interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
  location: string | null;
  emoji: string | null;
  sortOrder: number;
}

interface GalleryItem {
  id: string;
  mediaUrl: string;
  mediaType: string; // 'IMAGE' | 'VIDEO'
  caption: string | null;
}

interface Project {
  title: string;
  slug: string;
  subtitle: string | null;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  backgroundMusicUrl?: string | null;
  heroConfig: {
    message?: string;
    showDate?: boolean;
    showNames?: boolean;
    [key: string]: any;
  } | null;
  endingConfig: {
    title?: string;
    message?: string;
    emoji?: string;
    [key: string]: any;
  } | null;
  memories: Memory[];
  galleryItems: GalleryItem[];
}
```

The component must be declared as a default export, accepting a single `{ project }` object of type `{ project: Project }` as its props:
```typescript
export default function ThemeName({ project }: { project: Project }) {
  // Theme logic and layouts go here...
}
```

---

## 3. Structural Layout Requirements (Within the TSX File)

To ensure consistency in storytelling, the component must be composed of the following sequential sections:

### A. Ambient Fixed Backdrop
- An absolute or fixed container rendering theme-specific aesthetics (e.g., blur spheres, particle grids, rotating gradients, or a Canvas element).
- Must have `pointer-events-none` so it does not intercept user clicks.

### B. Hero Section (`h-screen`)
- Uses `project.coverImageUrl` as a focal banner. Implement smooth parallax movement using Framer Motion's `useScroll` and `useTransform` hooks.
- Displays `project.occasion` (uppercase category label).
- Displays `project.title` in prominent, stylized headers.
- Displays joint names (`project.personOneName` and `project.personTwoName`) and the `project.subtitle` if available.
- Features a bottom-anchored animated scrolling cue (e.g. `↓` or `Scroll to begin`).

### C. Opening Chapter / Love Letter Section
- Centrally showcases `project.heroConfig.message`.
- Needs a distinct typographic scale and layout (e.g., italic fonts, ornamental borders, or typewriter/letter-opening animations).

### D. Scroll-Revealed Journey Timeline
- Iterates over `project.memories` and orders them.
- Employs Framer Motion's `useInView` or standard viewport animations to transition each memory card into view as the user scrolls.
- Each memory card displays:
  - Date (parsed elegantly: `new Date(memory.date).toLocaleDateString()`).
  - Optional `memory.imageUrl` inside a styled framework.
  - Interactive elements showing the `memory.emoji`, `memory.title`, `memory.description`, and optional location marker `memory.location`.

### E. Responsive Media Gallery (with Lightbox Modal)
- Iterates over `project.galleryItems`.
- **Media Checking**: Must check `item.mediaType`. If the type is `'VIDEO'`, render a `<video>` element with `muted`, `loop`, `playsInline` attributes. Otherwise, render a responsive Next.js `<Image>` component.
- **Lightbox Logic**: Uses a local state variable `const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);`. Clicking on any gallery item updates the state with `item.mediaUrl`.
- **AnimatePresence Modal**: Uses Framer Motion's `<AnimatePresence>` to render a beautiful, full-screen fixed backdrop displaying the enlarged media, close button (`✕`), and transition properties when `lightboxSrc` is active.

### F. Ending Section / Outro
- Displays `project.endingConfig.title` and `project.endingConfig.message` as a warm emotional closing.
- Incorporates the configured ending emoji.
- Includes a subtle final footer reading `"Made with Mémoire"` with ornamental dividers.

---

## 4. Custom Theme Generation Prompt for Claude

Copy and paste the block below directly to Claude to generate a visual theme TSX file aligned with these rules.

````markdown
You are a master Frontend Web Designer. Your goal is to design and write a fully complete, self-contained visual theme component (`.tsx`) for the "Mémoire" project using React 18, Next.js (TypeScript), Framer Motion, and Tailwind CSS.

### File Metadata & Structure Rules
1. Add `'use client';` at the absolute top of the file.
2. Define the exact TypeScript interfaces for `Memory`, `GalleryItem`, and `Project` at the top of your code.
3. Export a single React functional component as the default export.
4. Use Next.js `Image` (`next/image`) for optimized graphics.
5. Handle BOTH images and looping, muted, playsInline `<video>` elements when mapping gallery items based on `item.mediaType === 'VIDEO'`.
6. Implement a fully functional custom lightbox modal popup using `<AnimatePresence>` when any gallery card is clicked.
7. Use Tailwind CSS for standard layout structure (flex, grid, spacing, colors) and inline style declarations for specialized visual elements.

### Technical Interfaces
```typescript
interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
  location: string | null;
  emoji: string | null;
  sortOrder: number;
}

interface GalleryItem {
  id: string;
  mediaUrl: string;
  mediaType: string;
  caption: string | null;
}

interface Project {
  title: string;
  slug: string;
  subtitle: string | null;
  personOneName: string | null;
  personTwoName: string | null;
  occasion: string | null;
  startDate: string | null;
  coverImageUrl: string | null;
  backgroundMusicUrl?: string | null;
  heroConfig: {
    message?: string;
    showDate?: boolean;
    showNames?: boolean;
    [key: string]: any;
  } | null;
  endingConfig: {
    title?: string;
    message?: string;
    emoji?: string;
    [key: string]: any;
  } | null;
  memories: Memory[];
  galleryItems: GalleryItem[];
}
```

### Layout Sections to Include:
- **Fixed Ambient Backdrop**: fixed backdrop element with `pointer-events-none`.
- **Hero Section (`h-screen`)**: Parallax cover image, dynamic scroll indicator, occasion, title, joint names, and subtitle.
- **Love Letter / Opening Message**: Showcases `project.heroConfig.message` with highly visual editorial layout.
- **Scroll-Triggered Timeline**: Map out `project.memories` using scroll-triggered reveals (`framer-motion`). Displays image, dates, emojis, titles, and descriptions.
- **Responsive Media Gallery**: Map `project.galleryItems` with lightbox handlers. Supports video and image rendering.
- **Closing Page**: Emotional OUTRO text (`project.endingConfig`), ending emoji, and a watermark reading "Made with Mémoire".

### Design Guidelines
- You have complete freedom to choose the visual theme concept, styling, colors, and name.
- Keep the component 100% finished, fully typed, with all hook imports, and functional. Do not output placeholders. Output ONLY the raw TypeScript file contents.
````
