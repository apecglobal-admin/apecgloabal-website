-- Migration: Add slug column to services table
-- Description: Add slug field for SEO-friendly URLs

-- Add slug column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE services ADD COLUMN slug VARCHAR(255);
        
        -- Generate slugs from existing titles
        UPDATE services 
        SET slug = LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(title, '[àáạảãâầấậẩẫăằắặẳẵ]', 'a', 'g'),
                    '[èéẹẻẽêềếệểễ]', 'e', 'g'
                ),
                '[^a-z0-9]+', '-', 'g'
            )
        )
        WHERE slug IS NULL;
        
        -- Make slug unique by appending id if needed
        UPDATE services s1
        SET slug = s1.slug || '-' || s1.id
        WHERE EXISTS (
            SELECT 1 
            FROM services s2 
            WHERE s2.slug = s1.slug 
            AND s2.id < s1.id
        );
        
        -- Create unique index on slug for better performance
        CREATE UNIQUE INDEX idx_services_slug ON services(slug);
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE services ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;