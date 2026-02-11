# News System Design

## Architecture Overview

The news system will follow the existing application patterns:

- **Data Layer**: Supabase integration with the `news` table
- **Component Layer**: Reusable NewsList and NewsDetail components
- **Page Layer**: Next.js App Router pages under `/hotlob-news`
- **Styling**: Mobile-first responsive design with Tailwind + custom CSS

## Component Structure

```
app/hotlob-news/
├── page.tsx (News list page)
└── [slug]/
    └── page.tsx (News detail page)

components/
├── NewsList.tsx (Container for news items)
├── NewsItem.tsx (Left-right layout: image | title+excerpt+author+date)
└── NewsDetail.tsx (Full article with Editor.js content)

lib/
└── news.ts (Data fetching utilities)
```

## TypeScript Types

The news system requires the following TypeScript interfaces and types:

**Core News Types (`types/news.ts`):**

```typescript
export interface NewsArticle {
  id: string;
  title: string;
  cover_image_url: string;
  content: EditorJSContent;
  publish_date: string;
  is_published: boolean;
  excerpt?: string;
  author?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NewsListItem {
  id: string;
  title: string;
  cover_image_url: string;
  excerpt?: string;
  author?: string;
  publish_date: string;
  slug: string;
}
```

**Editor.js Types:**

```typescript
export interface EditorJSContent {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export interface EditorJSBlock {
  id: string;
  type: EditorJSBlockType;
  data: Record<string, any>;
}

export type EditorJSBlockType = 
  | 'paragraph'
  | 'header'
  | 'list'
  | 'image'
  | 'quote'
  | 'code'
  | 'delimiter'
  | 'warning'
  | 'table'
  | 'embed'
  | 'linkTool';

export interface EditorJSParagraphBlock {
  type: 'paragraph';
  data: {
    text: string;
  };
}

export interface EditorJSHeaderBlock {
  type: 'header';
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface EditorJSImageBlock {
  type: 'image';
  data: {
    file: {
      url: string;
      alt?: string;
      caption?: string;
    };
    caption?: string;
    withBorder: boolean;
    withBackground: boolean;
    stretched: boolean;
  };
}

export interface EditorJSListBlock {
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: string[];
  };
}
```

**API Response Types:**

```typescript
export interface NewsAPIResponse {
  data: NewsArticle[];
  error?: string;
}

export interface SingleNewsAPIResponse {
  data: NewsArticle | null;
  error?: string;
}
```

**Utility Types:**

```typescript
export type NewsStatus = 'published' | 'draft' | 'archived';

export interface NewsFilters {
  is_published?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'publish_date' | 'created_at';
  orderDirection?: 'asc' | 'desc';
}
```

## Database Schema

The news system uses the existing `public.news` table with the following structure:

```sql
create table public.news (
  id uuid not null default gen_random_uuid (),
  title text not null,
  cover_image_url text not null,
  content jsonb not null,
  publish_date timestamp with time zone not null,
  is_published boolean null default true,
  excerpt text null,
  author text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  slug text not null,
  constraint news_pkey primary key (id),
  constraint news_slug_key unique (slug)
) TABLESPACE pg_default;

create index IF not exists idx_news_publish_date on public.news using btree (publish_date, is_published) TABLESPACE pg_default;

create index IF not exists idx_news_published on public.news using btree (is_published) TABLESPACE pg_default;

create index IF not exists idx_news_created on public.news using btree (created_at desc) TABLESPACE pg_default;

create trigger trigger_news_updated_at BEFORE
update on news for EACH row
execute FUNCTION update_updated_at ();
```

**Key Fields:**

- `id`: UUID primary key
- `title`: Article title
- `cover_image_url`: URL to cover image
- `content`: Editor.js JSON content
- `publish_date`: When article was/will be published
- `is_published`: Publication status (defaults to true)
- `excerpt`: Short summary text
- `author`: Article author name
- `slug`: URL-friendly identifier (unique)
- `created_at`/`updated_at`: Timestamps

**Indexes:**

- `idx_news_publish_date`: Optimizes queries by publish date and status
- `idx_news_published`: Optimizes filtering by publication status
- `idx_news_created`: Optimizes ordering by creation date

## Responsive Image Sizing

News item images follow separate scaling formulas for desktop and mobile breakpoints:

**Desktop Formula (≥768px):**

- Max dimensions: 280px × 160px at 1920px viewport
- Below 1920px: Scale proportionally using clamp() with viewport-based calculations
- Formula: `clamp(min, preferred_calc, max)` where preferred_calc uses vw units

**Mobile Formula (<768px):**

- Max dimensions: 200px × 200px at 768px viewport
- Below 768px: Scale proportionally using clamp() with viewport-based calculations
- Formula: Separate clamp() calculation independent of desktop formula

This approach ensures optimal image proportions at each breakpoint rather than a single responsive formula that might compromise aspect ratios.

## Typography Scaling

News item text elements follow separate font size formulas for desktop and mobile breakpoints:

**Title:**

- Desktop (≥768px): Max 18px at 1920px viewport
- Mobile (<768px): Max 18px at 768px viewport

**Excerpt:**

- Desktop (≥768px): Max 16px at 1920px viewport
- Mobile (<768px): Max 18px at 768px viewport

**Author + Publish Date:**

- Desktop (≥768px): Max 14px at 1920px viewport
- Mobile (<768px): Max 18px at 768px viewport

Font sizes scale proportionally below their respective maximum breakpoints using clamp() functions with separate calculations for desktop and mobile ranges.

## Responsive Gap Sizing

News list items use responsive gap spacing between each item:

**Desktop Formula (≥768px):**

- Max gap: 60px at 1920px viewport
- Below 1920px: Scale proportionally using clamp() with viewport-based calculations
- Applied to grid gap or margin between news items

**Mobile Formula (<768px):**

- Max gap: 20px at 768px viewport
- Below 768px: Scale proportionally using clamp() with viewport-based calculations
- Separate clamp() calculation independent of desktop formula

This ensures appropriate spacing density at each breakpoint while maintaining visual hierarchy.

## Mobile Item Styling

News item wrappers on mobile devices include card-like styling for enhanced visual separation. The list wrapper does not have its own styling on mobile:

**Mobile Item Wrapper Styles (<768px):**

- border-radius: 20px
- background: #FFF (white)
- box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.12)

These styles create individual card appearances that improve readability and visual hierarchy on mobile devices while maintaining the clean design aesthetic.

## Desktop List Styling

The news list wrapper on desktop devices includes subtle card-like styling for visual separation. Individual news items do not have their own wrapper styling:

**Desktop List Wrapper Styles (≥768px):**

- border-radius: 6px
- background: #FFF (white)
- box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.12)

These styles provide a clean, contained appearance for the entire news list while maintaining the professional design aesthetic on larger screens.

## Desktop Item Separators

News items on desktop devices include subtle separator lines for improved visual organization:

**Desktop Separator Styles (≥768px):**

- 1px solid line between each news item
- Color: #E1E4E9

These separators provide clear visual distinction between news items while maintaining a clean, professional appearance.

## News Detail Page Layout

The news detail page follows a structured layout with specific content ordering and wrapper styling:

**Content Order (Top to Bottom):**

1. Title
2. Publish date
3. Separator line (height: 1px; background: #E1E4E9)
4. Cover image
5. News content (Editor.js rendered content)

**Content Wrapper Styling:**

- border-radius: 6px
- background: #FFF (white)
- box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.12)

This layout provides a clean, organized presentation of news articles with consistent visual styling.

## News Detail Cover Image Sizing

News detail page cover images follow separate scaling formulas for desktop and mobile breakpoints:

**Desktop Formula (≥768px):**

- Max dimensions: 900px × 420px at 1920px viewport
- Below 1920px: Scale proportionally using clamp() with viewport-based calculations
- Formula: `clamp(min, preferred_calc, max)` where preferred_calc uses vw units

**Mobile Formula (<768px):**

- Max dimensions: 690px × 320px at 768px viewport
- Below 768px: Scale proportionally using clamp() with viewport-based calculations
- Formula: Separate clamp() calculation independent of desktop formula

This approach ensures optimal image proportions for the detail view at each breakpoint.

## Data Flow

1. **News List Page**: Fetches news articles where `is_published = true`, ordered by `publish_date` DESC
2. **News Detail Page**: Fetches individual news by slug (only if `is_published = true`)
3. **Components**: Receive news data as props, handle loading/error states

## Content Rendering Strategy

The `content` field stores Editor.js JSON structure. We'll need:

- **Client-side rendering** for Editor.js content blocks
- **Block type mapping** to React components
- **Fallback handling** for unsupported block types
- **Styling integration** with existing design tokens

**Recommended Initial Supported Block Types:**

1. **Paragraph** (`paragraph`) - Basic text content with formatting
2. **Header** (`header`) - H1-H6 headings with proper semantic markup
3. **List** (`list`) - Ordered and unordered lists
4. **Image** (`image`) - Images with captions and responsive sizing
5. **Quote** (`quote`) - Blockquotes with optional captions
6. **Delimiter** (`delimiter`) - Visual separators between content sections

**Fallback Handling Strategy:**

For unsupported block types, render a generic fallback component that:
- Shows the block type name
- Displays raw text content if available
- Includes a subtle warning indicator for content editors
- Maintains document flow without breaking layout

**Block Rendering Priority:**
1. Map supported blocks to styled React components
2. Use fallback component for unknown blocks
3. Gracefully handle malformed block data
4. Preserve content accessibility and readability

## Performance Considerations

- **Static Generation**: Consider ISR for news detail pages
- **Image Optimization**: Use Next.js Image component with automatic WebP conversion and lazy loading
- **Pagination**: Implement infinite loading with 10 items per page for news lists
- **Caching**: Leverage Supabase query caching with 5-minute cache duration for published news queries

## Error Handling

- **404 Pages**: Invalid slugs show appropriate not found page
- **Loading States**: Spinner with #EA4148 color during data fetching
- **Error Boundaries**: Wrap news components with error boundaries that show user-friendly error messages
- **Error Boundaries**: Graceful degradation for content rendering failures

## SEO & Accessibility

**Meta Tags Implementation:**

For news detail pages, implement the following meta tags in the document `<head>`:

**Basic Meta Tags:**
```html
<title>{article.title} | Hotlob News</title>
<meta name="description" content="{article.excerpt or truncated content}" />
<meta name="author" content="{article.author}" />
<meta name="keywords" content="hotlob, news, {article.title keywords}" />
<meta name="robots" content="index, follow" />
```

**Open Graph Tags (Facebook/LinkedIn sharing):**
```html
<meta property="og:title" content="{article.title}" />
<meta property="og:description" content="{article.excerpt}" />
<meta property="og:image" content="{article.cover_image_url}" />
<meta property="og:url" content="https://hotlob.com/hotlob-news/{article.slug}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Hotlob" />
<meta property="article:published_time" content="{article.publish_date}" />
<meta property="article:author" content="{article.author}" />
```

**Twitter Card Tags (Twitter sharing):**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{article.title}" />
<meta name="twitter:description" content="{article.excerpt}" />
<meta name="twitter:image" content="{article.cover_image_url}" />
<meta name="twitter:site" content="@hotlob" />
```

**Structured Data (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{article.title}",
  "description": "{article.excerpt}",
  "image": ["{article.cover_image_url}"],
  "datePublished": "{article.publish_date}",
  "dateModified": "{article.updated_at}",
  "author": {
    "@type": "Person",
    "name": "{article.author}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Hotlob",
    "logo": {
      "@type": "ImageObject",
      "url": "https://hotlob.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://hotlob.com/hotlob-news/{article.slug}"
  }
}
```

**Accessibility Features:**
- **Semantic HTML**: Use proper heading hierarchy (h1, h2, etc.)
- **ARIA Labels**: `aria-label` for interactive elements
- **Alt Text**: Descriptive alt attributes for images
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader Support**: Proper heading structure and landmarks

## Future Extensibility

- **Categories/Tags**: Support for news categorization
- **Search**: Full-text search capabilities
- **RSS Feed**: Syndication support
- **Social Sharing**: Share buttons for individual articles
