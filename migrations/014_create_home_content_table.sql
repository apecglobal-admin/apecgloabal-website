-- Migration: Create home_content table
-- Description: Creates table to store homepage content sections managed via CMS

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'home_content'
    ) THEN
        CREATE TABLE home_content (
            id SERIAL PRIMARY KEY,
            section VARCHAR(100) NOT NULL UNIQUE,
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_home_content_section ON home_content(section);

        -- Insert default sections
        INSERT INTO home_content (section, content) VALUES
        ('infoHighlights', '[]'::jsonb),
        ('quickFacts', '[]'::jsonb),
        ('valuePillars', '[]'::jsonb),
        ('careerBenefits', '[]'::jsonb),
        ('ctaMetrics', '[]'::jsonb),
        ('introSection', '{}'::jsonb),
        ('techShowcaseSection', '{}'::jsonb),
        ('servicesSection', '{}'::jsonb),
        ('companyOverviewSection', '{}'::jsonb),
        ('ctaSection', '{}'::jsonb)
        ON CONFLICT (section) DO NOTHING;
    END IF;
END $$;
