# Customer Review Fetching

## Summary

Implement automated fetching and storage of customer reviews from Google Places API (New) for all Hotlob stores. Reviews will be stored in the existing `curated_reviews` table in Supabase and refreshed every 30 days to maintain up-to-date customer feedback.

## Why

Customer reviews are crucial for building trust and credibility with potential customers. Currently, the website displays only a single hardcoded review, which limits authenticity and engagement. By fetching real reviews from Google Places, we can:

- Display authentic customer testimonials across the site
- Build trust through verified review sources
- Keep content fresh with automatic updates
- Support multiple review display components
- Maintain data consistency with existing store information

This implementation leverages existing Google Places integration patterns and cron job infrastructure, ensuring reliable operation with minimal maintenance overhead.

## What Changes

### New Capabilities

- **customer-review-management** — Automated fetching, storage, and synchronization of customer reviews from Google Places API (New)

### Design Decisions

- **Database Schema**: Existing `curated_reviews` table with comprehensive indexing and constraints
- **API Integration**: Extend existing Google Places API (New) client with review fetching
- **Synchronization Strategy**: Three-way sync (insert/update/delete) with 30-day refresh cycle
- **Cron Job**: New `/api/cron/customer-reviews` endpoint following existing patterns
- **Error Handling**: Graceful failure handling with per-store error reporting

## Requirements

### Core Functionality

- Fetch all available reviews per store from Google Places API (New)
- Store reviews in the existing `curated_reviews` table with proper indexing and constraints
- Implement 30-day refresh cycle for each store's reviews
- Handle review synchronization (insert new, update changed, delete removed reviews)

### Database Schema

The `curated_reviews` table already exists with:

- Store relationship via `store_id`
- Unique constraint on `(store_id, google_review_id)`
- Review metadata (author, rating, text, timestamps)
- Automatic `updated_at` trigger
- Indexes for efficient querying

### API Integration

- Extend existing Google Places API (New) integration
- Use server-side Supabase client for database operations
- Batch processing for multiple stores
- Error handling and logging

### Scheduling

- Cron job endpoint for automated execution
- Authentication via CRON_SECRET
- Similar pattern to existing Google Places sync job

## Impact

- **Users**: See authentic, up-to-date customer reviews instead of static content
- **Performance**: Minimal impact with batched API calls and efficient database operations
- **Maintenance**: Automated refresh reduces manual content management

## Dependencies

- Existing Google Places API (New) integration (`lib/google-places.ts`)
- Supabase server client (`lib/supabaseServer.ts`)
- Cron job infrastructure (`app/api/cron/`)

## Success Criteria

- All stores have reviews fetched and stored within 30 days
- Reviews display correctly on website components
- No duplicate reviews or data inconsistencies
- API calls respect rate limits and handle errors gracefully