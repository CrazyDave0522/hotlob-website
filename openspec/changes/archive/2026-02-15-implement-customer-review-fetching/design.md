# Customer Review Fetching - Design

## Architecture Overview

The customer review fetching system extends the existing Google Places API (New) integration to fetch and store customer reviews. It follows the established patterns for cron jobs and Supabase operations while leveraging the existing `curated_reviews` database schema and introducing new API endpoints.

## Key Design Decisions

### 1. Database Schema

**Existing Table: `curated_reviews`**

- Uses UUID primary key for scalability
- Foreign key to `store` table with CASCADE delete
- Unique constraint on `(store_id, google_review_id)` prevents duplicates
- Generated column for `text_length` enables efficient filtering
- Comprehensive indexing for query performance
- Automatic `updated_at` trigger maintains audit trail

**Rationale**: The existing schema supports the 30-day refresh cycle by tracking `fetched_at` and `expires_at`. The unique constraint ensures data integrity during sync operations.

### 2. API Integration

**Google Places API (New)**

- Uses existing API key and base URL infrastructure
- Fetches reviews using place ID from store records
- Field mask includes: `reviews` with author details, ratings, and timestamps
- Rate limiting: Batch processing with delays between requests

**Rationale**: Leverages existing Google Places integration patterns. The (New) API provides structured review data with better field control.

### 3. Synchronization Strategy

**30-Day Refresh Cycle**

- Stores are processed when `expires_at` is past or null
- Fetches all available reviews per store (subject to API limitation)
- Three-way sync: insert new, update changed, delete removed reviews
- `fetched_at` and `expires_at` timestamps track sync status

**Rationale**: Balances freshness with API quota limits. The sync strategy ensures data consistency without excessive API calls.

### 4. Cron Job Implementation

**Endpoint: `/api/cron/customer-reviews`**

- Follows existing cron pattern with CRON_SECRET authentication
- Processes stores in batches to avoid timeouts
- Comprehensive error handling and logging
- Returns detailed sync results for monitoring

**Rationale**: Consistent with existing Google Places sync job. Server-side execution ensures API keys remain secure.

### 5. Error Handling

**API Failures**

- Continue processing other stores on individual failures
- Log errors but don't mark store as synced to retry later
- Exponential backoff for transient failures

**Database Errors**

- Transaction rollback on critical failures
- Partial success reporting for monitoring

**Rationale**: Robust operation ensures the system continues functioning even with intermittent issues.

## Data Flow

1. Cron job identifies stores needing review sync (`expires_at` < now)
2. For each store, fetch reviews from Google Places API (New)
3. Transform API response to database format
4. Execute three-way sync in database transaction
5. Update `fetched_at` and `expires_at` timestamps
6. Log results and continue to next store

## Security Considerations

- API keys stored as environment variables
- Server-side execution prevents client exposure
- CRON_SECRET authentication for endpoint access
- No sensitive customer data stored beyond public reviews

## Performance Considerations

- Batch processing limits concurrent API calls
- Database indexes optimize query performance
- 30-day refresh cycle minimizes API usage
- Efficient sync logic reduces database operations

## Monitoring and Maintenance

- Cron job returns detailed results for each store
- Error logging for troubleshooting
- Database constraints prevent data corruption
- Clear expiration tracking enables manual intervention if needed

## Future Extensions

- Review display components (separate implementation)
- Review analytics and insights
- Integration with other review platforms
- Customer review response workflow