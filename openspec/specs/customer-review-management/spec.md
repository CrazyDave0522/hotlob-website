# customer-review-management Specification

## Purpose
TBD - created by archiving change implement-customer-review-fetching. Update Purpose after archive.
## Requirements
### Requirement: Review Storage

The system SHALL store fetched customer reviews in the `curated_reviews` table with proper data integrity constraints and freshness tracking.

#### Scenario: Store fetched reviews in database

**GIVEN** the system fetches reviews from Google Places API (New)
**WHEN** reviews are received
**THEN** they are stored in the `curated_reviews` table with all required fields
**AND** unique constraint prevents duplicate reviews per store
**AND** foreign key ensures referential integrity with stores

#### Scenario: Track review freshness

**GIVEN** reviews are stored in the database
**WHEN** a store's reviews are fetched
**THEN** `fetched_at` is set to current timestamp
**AND** `expires_at` is set to `fetched_at + 30 days`
**AND** `updated_at` trigger maintains audit trail

### Requirement: Review Synchronization

The system SHALL synchronize review data between Google Places API (New) and the database, handling insertions, updates, and deletions to maintain data consistency.

#### Scenario: Insert new reviews

**GIVEN** a review exists in Google Places API (New) but not in database
**WHEN** sync runs for the store
**THEN** the review is inserted with all metadata
**AND** `google_review_id` is stored for uniqueness

#### Scenario: Update changed reviews

**GIVEN** a review exists in both API and database
**WHEN** `review_text` or `rating` differs
**THEN** the database record is updated
**AND** `updated_at` timestamp reflects the change

#### Scenario: Remove deleted reviews

**GIVEN** a review exists in database but not in latest API fetch
**WHEN** sync runs for the store
**THEN** the review is deleted from database
**AND** data consistency is maintained

### Requirement: API Integration

The system SHALL integrate with Google Places API (New) to fetch customer reviews, handling API limitations and errors gracefully.

#### Scenario: Fetch reviews from Google Places

**GIVEN** a store has a `google_place_id`
**WHEN** the cron job processes the store
**THEN** all available reviews are fetched from Google Places API (New)
**AND** API errors are logged but don't stop processing other stores

#### Scenario: Handle API limitations

**GIVEN** Google Places API may limit the number of reviews returned per place
**WHEN** fetching reviews
**THEN** all available reviews are processed
**AND** no attempt is made to fetch beyond API limits

### Requirement: Cron Job Execution

The system SHALL provide a cron job endpoint for scheduled review synchronization with proper authentication and monitoring.

#### Scenario: Scheduled review sync

**GIVEN** stores with expired review data (`expires_at` < now)
**WHEN** cron job runs
**THEN** those stores are processed in batches
**AND** `fetched_at` and `expires_at` are updated
**AND** results are returned for monitoring

#### Scenario: Authentication required

**GIVEN** the cron endpoint is called
**WHEN** request lacks valid CRON_SECRET
**THEN** access is denied with 401 status
**AND** no processing occurs

### Requirement: Data Integrity

The system SHALL enforce data integrity constraints on review data including rating validation and required field presence.

#### Scenario: Rating validation

**GIVEN** a review has a rating value
**WHEN** storing in database
**THEN** rating is between 1 and 5 inclusive
**AND** constraint prevents invalid ratings

#### Scenario: Required fields present

**GIVEN** a review from Google Places API (New)
**WHEN** storing in database
**THEN** `store_id`, `google_review_id`, `author_name`, `rating`, `review_text`, `review_time` are required
**AND** optional fields like `author_photo_url` are stored when available

### Requirement: Performance Optimization

The system SHALL optimize database queries and API calls for efficient review management.

#### Scenario: Efficient querying

**GIVEN** reviews stored in database
**WHEN** querying by store or rating
**THEN** appropriate indexes enable fast retrieval
**AND** `text_length` generated column supports filtering

#### Scenario: Batch processing

**GIVEN** multiple stores need review sync
**WHEN** cron job runs
**THEN** stores are processed sequentially
**AND** API calls are spaced to avoid rate limits

