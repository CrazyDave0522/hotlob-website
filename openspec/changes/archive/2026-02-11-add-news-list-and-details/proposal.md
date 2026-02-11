# Add News List and Details Pages

## Summary

Implement a comprehensive news system for the Hotlob website by adding news list functionality to the existing `/hotlob-news` page (which currently has a hero component) and creating individual news detail pages. The news list displays published articles in a left-right layout with cover images on the left and article details (title, excerpt, author, publish date) on the right. The system supports Editor.js content rendering for detailed news pages.

## Motivation

The existing news page (`/hotlob-news`) has a hero component but lacks the actual news content and list functionality. Customers and stakeholders need a way to:

- Stay informed about Hotlob updates, promotions, and announcements
- Access detailed news articles with rich content
- Navigate through published news in an organized manner

## Scope

This change will enhance the existing `/hotlob-news` page and add:

1. **News List Component**: Displays published news articles in a left-right layout where:
   - Left side: Cover image
   - Right side: Title, excerpt, author + publish date (same line)
2. **News Details Page**: Individual pages for full news article content with Editor.js rendering
3. **Database Integration**: Connect to the existing `news` table
4. **Content Rendering**: Support for Editor.js JSON content structure

## Impact

- **User Experience**: Improved information access and engagement
- **Content Management**: Better platform for sharing updates
- **SEO**: Individual news pages improve search visibility
- **Architecture**: New page component and data fetching patterns

## Dependencies

- Existing `news` database table (already created)
- Supabase client configuration
- Editor.js content rendering capabilities

## Why

The Hotlob website currently has a news page (`/hotlob-news`) that only displays a hero component without any actual news content. This creates a poor user experience where customers expect to find news and updates but find an incomplete page. Implementing a full news system will:

- **Improve User Engagement**: Provide valuable content about Hotlob updates, promotions, and announcements
- **Enhance SEO**: Individual news pages with proper meta tags will improve search visibility
- **Complete the User Journey**: Users can now discover and read detailed news articles
- **Support Business Goals**: Better platform for sharing important updates and maintaining customer relationships

## What Changes

### Code Changes
- Add `NewsList.tsx` and `NewsItem.tsx` components with responsive design
- Add `NewsDetail.tsx` component with Editor.js content rendering
- Create dynamic route `/hotlob-news/[slug]/page.tsx` for individual articles
- Add `EditorJSRenderer.tsx` component for rich content display
- Update `/hotlob-news/page.tsx` to include news list below hero
- Add comprehensive TypeScript types in `types/news.ts`
- Implement data fetching utilities in `lib/news.ts`
- Add responsive CSS with mobile-first architecture
- Update navigation to include "Hotlob News" link

### Database/Schema Changes
- Utilize existing `news` table with columns: id, title, slug, excerpt, content, cover_image_url, author, publish_date, is_published, created_at, updated_at

### Configuration Changes
- No configuration changes required - uses existing Supabase setup

### Documentation Changes
- Add comprehensive OpenSpec documentation for news content management
- Update component documentation and TypeScript interfaces
