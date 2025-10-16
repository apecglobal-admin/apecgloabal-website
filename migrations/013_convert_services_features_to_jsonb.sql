-- Migration: Convert services.features column to JSONB
-- Description: Ensures the features column stores structured JSON arrays

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'services'
          AND column_name = 'features'
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'services'
              AND column_name = 'features'
              AND udt_name = 'jsonb'
        ) THEN
            ALTER TABLE services
            ALTER COLUMN features TYPE jsonb
            USING COALESCE(to_jsonb(features), '[]'::jsonb);

            ALTER TABLE services
            ALTER COLUMN features SET DEFAULT '[]'::jsonb;

            UPDATE services
            SET features = '[]'::jsonb
            WHERE features IS NULL;
        END IF;
    END IF;
END $$;