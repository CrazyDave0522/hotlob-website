# API Routes

This directory contains Next.js API routes for server-side functionality.

## Cron Endpoints

Cron endpoints are automated background jobs that run on a schedule. All cron endpoints require authentication via the `CRON_SECRET` environment variable.

### Authentication

All cron endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <CRON_SECRET>
```

### Customer Reviews Sync

**Endpoint:** `GET /api/cron/customer-reviews`

Synchronizes customer reviews from Google Places API (New) for all stores that haven't been updated in the last 30 days.

#### Process Flow

1. **Authentication**: Validates `CRON_SECRET`
2. **Store Selection**: Finds stores with expired reviews (`expires_at` < current time)
3. **API Fetching**: Calls Google Places API for each store's reviews
4. **Synchronization**: Performs three-way sync (insert/update/delete) of reviews
5. **Timestamp Updates**: Updates `fetched_at` and `expires_at` timestamps

#### Response

**Success (200):**
```json
{
  "message": "Customer reviews synced successfully",
  "processed": 5,
  "inserted": 12,
  "updated": 3,
  "deleted": 1
}
```

**Error (500):**
```json
{
  "error": "Failed to sync customer reviews",
  "details": "Error message"
}
```

**Unauthorized (401):**
```json
{
  "error": "Unauthorized"
}
```

#### Database Operations

- **Insert**: New reviews from Google Places API
- **Update**: Existing reviews with changed content or rating
- **Delete**: Reviews no longer present in Google Places API

#### Environment Requirements

- `CRON_SECRET`: Secret token for authentication
- `NEXT_PUBLIC_GMAPS_API_KEY`: Google Places API key
- `NEXT_PUBLIC_SUPABASE_PROJECT_URL`: Supabase project URL
- `SUPABASE_SECRET_KEY`: Supabase service role key

### Google Places Sync

**Endpoint:** `GET /api/cron/google-places`

Synchronizes store details (rating, trading hours) from Google Places API for stores that haven't been updated in the last 30 days.

#### Process Flow

1. **Authentication**: Validates `CRON_SECRET`
2. **Store Selection**: Finds stores with expired data (`google_last_synced_at` > 30 days ago)
3. **API Fetching**: Calls Google Places API for store details
4. **Data Extraction**: Parses rating and trading hours
5. **Database Update**: Updates store records

#### Response

**Success (200):**
```json
{
  "message": "Stores synced successfully",
  "processed": 3
}
```

## Error Handling

All cron endpoints include comprehensive error handling:

- Network failures with Google Places API
- Database connection issues
- Authentication failures
- Rate limiting (automatic retry with backoff)
- Partial failures (continues processing other stores)

## Security

- All endpoints require `CRON_SECRET` authentication
- Server-side only (cannot be called from browser)
- Uses Supabase service role key for full database access
- Validates all input data before database operations