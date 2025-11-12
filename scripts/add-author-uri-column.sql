-- Add author_uri column to curated_reviews table
ALTER TABLE curated_reviews ADD COLUMN IF NOT EXISTS author_uri TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_curated_reviews_author_uri ON curated_reviews(author_uri);
