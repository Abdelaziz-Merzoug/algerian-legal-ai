-- ============================================
-- Algerian Legal AI — Complete Database Schema
-- ============================================
-- Run this ENTIRE file in Supabase SQL Editor:
--   1. Go to supabase.com → Your Project → SQL Editor
--   2. Click "New query"
--   3. Paste this entire file
--   4. Click "Run"
-- ============================================

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. PROFILES TABLE
--    Extends Supabase auth.users with app-specific data.
--    DO NOT store users separately — profiles REFERENCES auth.users.
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. LEGAL CATEGORIES TABLE
--    Groupings for laws (e.g., Criminal, Civil, Family...)
-- ============================================
CREATE TABLE IF NOT EXISTS legal_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT DEFAULT '📚',
  document_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. LEGAL DOCUMENTS TABLE
--    A law/decree/regulation document.
-- ============================================
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES legal_categories(id) ON DELETE RESTRICT,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  document_type TEXT NOT NULL DEFAULT 'law' CHECK (document_type IN ('law', 'decree', 'regulation', 'constitution', 'amendment', 'other')),
  source TEXT,
  year INTEGER,
  total_articles INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. LEGAL ARTICLES TABLE
--    Individual chunks of legal text with vector embeddings
--    for semantic search. 768-dim embeddings (Gemini).
-- ============================================
CREATE TABLE IF NOT EXISTS legal_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  article_number TEXT,
  content TEXT NOT NULL,
  chunk_index INTEGER DEFAULT 0,
  embedding vector(768),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. CONVERSATIONS TABLE
--    A chat session between a user and the AI.
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'محادثة جديدة',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. MESSAGES TABLE
--    Individual messages within a conversation.
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  related_articles UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 7. FEEDBACK TABLE
--    User feedback about the platform.
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'bug', 'feature', 'complaint', 'praise')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- is_admin(): checks if the current user is the admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email = 'merzougaziz800@gmail.com'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- handle_new_user(): Auto-create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- update_updated_at(): auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_legal_categories_updated_at
  BEFORE UPDATE ON legal_categories FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_legal_documents_updated_at
  BEFORE UPDATE ON legal_documents FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_legal_articles_updated_at
  BEFORE UPDATE ON legal_articles FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VECTOR SEARCH FUNCTION
-- match_articles(): semantic search using 768-dim embeddings
-- ============================================
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  article_number TEXT,
  content TEXT,
  chunk_index INTEGER,
  similarity FLOAT,
  document_title_ar TEXT,
  document_title_en TEXT,
  category_name_ar TEXT,
  category_name_en TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    la.id,
    la.document_id,
    la.article_number,
    la.content,
    la.chunk_index,
    1 - (la.embedding <=> query_embedding) AS similarity,
    ld.title_ar AS document_title_ar,
    ld.title_en AS document_title_en,
    lc.name_ar AS category_name_ar,
    lc.name_en AS category_name_en
  FROM legal_articles la
  JOIN legal_documents ld ON la.document_id = ld.id
  JOIN legal_categories lc ON ld.category_id = lc.id
  WHERE la.is_active = true
    AND ld.status = 'active'
    AND la.embedding IS NOT NULL
    AND (1 - (la.embedding <=> query_embedding)) > match_threshold
  ORDER BY la.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- --- PROFILES ---
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "System can create profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- --- LEGAL CATEGORIES ---
CREATE POLICY "Anyone can view active categories"
  ON legal_categories FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admin can insert categories"
  ON legal_categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update categories"
  ON legal_categories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete categories"
  ON legal_categories FOR DELETE
  USING (is_admin());

-- --- LEGAL DOCUMENTS ---
CREATE POLICY "Anyone can view active documents"
  ON legal_documents FOR SELECT
  USING (status = 'active' OR is_admin());

CREATE POLICY "Admin can insert documents"
  ON legal_documents FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update documents"
  ON legal_documents FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete documents"
  ON legal_documents FOR DELETE
  USING (is_admin());

-- --- LEGAL ARTICLES ---
CREATE POLICY "Anyone can view active articles"
  ON legal_articles FOR SELECT
  USING (is_active = true OR is_admin());

CREATE POLICY "Admin can insert articles"
  ON legal_articles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update articles"
  ON legal_articles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete articles"
  ON legal_articles FOR DELETE
  USING (is_admin());

-- --- CONVERSATIONS ---
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Admin can view all conversations"
  ON conversations FOR SELECT
  USING (is_admin());

-- --- MESSAGES ---
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all messages"
  ON messages FOR SELECT
  USING (is_admin());

-- --- FEEDBACK ---
CREATE POLICY "Users can view their own feedback"
  ON feedback FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all feedback"
  ON feedback FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can update feedback"
  ON feedback FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete feedback"
  ON feedback FOR DELETE
  USING (is_admin());

-- ============================================
-- INDEXES
-- ============================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_legal_categories_is_active ON legal_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_legal_documents_category ON legal_documents(category_id);
CREATE INDEX IF NOT EXISTS idx_legal_documents_status ON legal_documents(status);
CREATE INDEX IF NOT EXISTS idx_legal_documents_year ON legal_documents(year);

CREATE INDEX IF NOT EXISTS idx_legal_articles_document ON legal_articles(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_articles_is_active ON legal_articles(is_active);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- IVFFlat index for vector search (optimal for < 1M rows)
-- Note: This requires at least some rows. If empty, use HNSW instead.
-- We use HNSW which works even on empty tables:
CREATE INDEX IF NOT EXISTS idx_legal_articles_embedding
  ON legal_articles
  USING hnsw (embedding vector_cosine_ops);

-- ============================================
-- SEED DATA: 6 Arabic Legal Categories
-- ============================================
INSERT INTO legal_categories (name_ar, name_en, description_ar, description_en, icon) VALUES
  ('القانون المدني', 'Civil Law', 'القوانين المتعلقة بالعلاقات المدنية والمعاملات بين الأفراد', 'Laws related to civil relations and transactions between individuals', '⚖️'),
  ('القانون الجنائي', 'Criminal Law', 'القوانين المتعلقة بالجرائم والعقوبات', 'Laws related to crimes and penalties', '🔒'),
  ('قانون الأسرة', 'Family Law', 'القوانين المتعلقة بالزواج والطلاق والنفقة والحضانة', 'Laws related to marriage, divorce, alimony, and custody', '👨‍👩‍👧‍👦'),
  ('القانون التجاري', 'Commercial Law', 'القوانين المتعلقة بالمعاملات التجارية والشركات', 'Laws related to commercial transactions and companies', '💼'),
  ('قانون العمل', 'Labor Law', 'القوانين المتعلقة بعلاقات العمل وحقوق العمال', 'Laws related to labor relations and workers rights', '🏗️'),
  ('القانون الإداري', 'Administrative Law', 'القوانين المتعلقة بالإدارة العامة والمؤسسات الحكومية', 'Laws related to public administration and government institutions', '🏛️')
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. CONTACT MESSAGES TABLE
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
-- 9. PLATFORM SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS for new tables
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read contact messages" ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Admin can update contact messages" ON contact_messages FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete contact messages" ON contact_messages FOR DELETE USING (is_admin());

CREATE POLICY "Anyone can read platform settings" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "Admin can update platform settings" ON platform_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can insert platform settings" ON platform_settings FOR INSERT WITH CHECK (is_admin());

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_settings_key ON platform_settings(key);

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Seed platform settings
INSERT INTO platform_settings (key, value, description) VALUES
  ('platform_name', 'المستشار القانوني الجزائري', 'Platform display name'),
  ('platform_description', 'مساعدك القانوني الذكي المبني على القوانين الجزائرية', 'Platform description'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('chat_rate_limit', '20', 'Max chat requests per minute per user'),
  ('welcome_message', 'مرحباً! أنا مستشارك القانوني الذكي. كيف يمكنني مساعدتك؟', 'Chat welcome message'),
  ('announcement', '', 'Announcement banner text (empty = hidden)'),
  ('max_conversations', '50', 'Max conversations per user')
ON CONFLICT (key) DO NOTHING;

