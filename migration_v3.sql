-- ============================================
-- Migration V3: Platform Enhancement
-- Categories enhancement, audit log, profile columns
-- ============================================

-- 1. Categories enhancement — bilingual names + display order
ALTER TABLE legal_categories ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE legal_categories ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE legal_categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Seed English names for existing categories
UPDATE legal_categories SET name_en = 'Civil Code', description_en = 'Laws related to civil relations and transactions between individuals' WHERE name_ar = 'القانون المدني';
UPDATE legal_categories SET name_en = 'Criminal Code', description_en = 'Laws related to crimes and penalties' WHERE name_ar = 'القانون الجنائي';
UPDATE legal_categories SET name_en = 'Family Code', description_en = 'Laws related to marriage, divorce, alimony, and custody' WHERE name_ar = 'قانون الأسرة';
UPDATE legal_categories SET name_en = 'Commercial Code', description_en = 'Laws related to commercial transactions and companies' WHERE name_ar = 'القانون التجاري';
UPDATE legal_categories SET name_en = 'Labor Code', description_en = 'Laws related to labor relations and workers rights' WHERE name_ar = 'قانون العمل';
UPDATE legal_categories SET name_en = 'Administrative Code', description_en = 'Laws related to public administration and government institutions' WHERE name_ar = 'القانون الإداري';

-- Set display order
UPDATE legal_categories SET display_order = 1 WHERE name_ar = 'القانون المدني';
UPDATE legal_categories SET display_order = 2 WHERE name_ar = 'القانون الجنائي';
UPDATE legal_categories SET display_order = 3 WHERE name_ar = 'قانون الأسرة';
UPDATE legal_categories SET display_order = 4 WHERE name_ar = 'القانون التجاري';
UPDATE legal_categories SET display_order = 5 WHERE name_ar = 'قانون العمل';
UPDATE legal_categories SET display_order = 6 WHERE name_ar = 'القانون الإداري';

-- 2. Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create is_admin function if not exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit log policies
DO $$ BEGIN
  CREATE POLICY "Admin can read audit log" ON audit_log FOR SELECT USING (is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admin can insert audit log" ON audit_log FOR INSERT WITH CHECK (is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Profile enhancements
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true}'::jsonb;

-- 4. Create index for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON audit_log(admin_id);

-- 5. Update display_order index for categories
CREATE INDEX IF NOT EXISTS idx_legal_categories_display_order ON legal_categories(display_order);
