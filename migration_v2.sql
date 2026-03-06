-- ============================================
-- MIGRATION: Major Platform Enhancement
-- Run this in Supabase SQL Editor AFTER the initial schema.sql
-- ============================================

-- ============================================
-- 1. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. PLATFORM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================
-- 3. ENHANCE FEEDBACK TABLE
-- ============================================
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- ============================================
-- 4. ADD CONTENT COLUMN TO LEGAL_DOCUMENTS (if missing)
-- ============================================
ALTER TABLE legal_documents ADD COLUMN IF NOT EXISTS content TEXT;

-- ============================================
-- 5. ADD SOURCES COLUMN TO MESSAGES (if missing)
-- ============================================
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sources JSONB;

-- ============================================
-- 6. RLS FOR NEW TABLES
-- ============================================
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Contact messages: anyone can insert, admin reads/updates
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read contact messages"
  ON contact_messages FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can update contact messages"
  ON contact_messages FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin can delete contact messages"
  ON contact_messages FOR DELETE
  USING (is_admin());

-- Platform settings: anyone reads, admin writes
CREATE POLICY "Anyone can read platform settings"
  ON platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin can update platform settings"
  ON platform_settings FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admin can insert platform settings"
  ON platform_settings FOR INSERT
  WITH CHECK (is_admin());

-- ============================================
-- 7. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON platform_settings(key);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON feedback(priority);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- ============================================
-- 8. SEED PLATFORM SETTINGS
-- ============================================
INSERT INTO platform_settings (key, value, description) VALUES
  ('platform_name', 'المستشار القانوني الجزائري', 'Platform display name'),
  ('platform_description', 'مساعدك القانوني الذكي المبني على القوانين الجزائرية', 'Platform description'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('chat_rate_limit', '20', 'Max chat requests per minute per user'),
  ('welcome_message', 'مرحباً! أنا مستشارك القانوني الذكي. كيف يمكنني مساعدتك؟', 'Chat welcome message'),
  ('announcement', '', 'Announcement banner text (empty = hidden)'),
  ('max_conversations', '50', 'Max conversations per user')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 9. UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
