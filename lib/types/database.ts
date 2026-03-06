// ============================================
// Database Types — All Supabase Tables
// ============================================

export interface Profile {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    avatar_url: string | null;
    is_active: boolean;
    last_active: string | null;
    notification_preferences: { email: boolean } | null;
    created_at: string;
    updated_at: string;
}

export interface LegalCategory {
    id: string;
    name_ar: string;
    name_en: string | null;
    description_ar: string | null;
    description_en: string | null;
    icon: string;
    display_order: number;
    document_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LegalDocument {
    id: string;
    category_id: string;
    title_ar: string;
    title_en: string | null;
    content: string | null;
    document_type: 'law' | 'decree' | 'regulation' | 'constitution' | 'amendment' | 'other';
    source: string | null;
    year: number | null;
    total_articles: number;
    status: 'active' | 'inactive' | 'draft';
    created_at: string;
    updated_at: string;
    // Joined fields
    legal_categories?: Pick<LegalCategory, 'name_ar' | 'name_en' | 'icon'>;
}

export interface LegalArticle {
    id: string;
    document_id: string;
    article_number: string | null;
    content: string;
    chunk_index: number;
    embedding: number[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Joined fields
    legal_documents?: Pick<LegalDocument, 'title_ar' | 'title_en'>;
}

export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant' | 'model';
    content: string;
    sources: MatchedArticle[] | null;
    related_articles: string[];
    created_at: string;
}

export interface Feedback {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    type: 'general' | 'suggestion' | 'complaint' | 'bug' | 'rating' | 'other';
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    rating: number | null;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    admin_response: string | null;
    screenshot_url: string | null;
    created_at: string;
    updated_at: string;
    // Joined fields
    profiles?: Pick<Profile, 'username' | 'email'>;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface PlatformSetting {
    id: string;
    key: string;
    value: string;
    description: string | null;
    updated_at: string;
    updated_by: string | null;
}

// ============================================
// RPC / View Types
// ============================================

export interface MatchedArticle {
    id: string;
    document_id: string;
    article_number: string;
    content: string;
    chunk_index: number;
    similarity: number;
    document_title_ar: string;
    document_title_en: string | null;
    category_name_ar: string;
    category_name_en: string;
}

// ============================================
// API Response Types
// ============================================

export interface AdminStats {
    totalUsers: number;
    totalDocuments: number;
    totalArticles: number;
    totalConversations: number;
    totalMessages: number;
    totalFeedback: number;
    pendingFeedback: number;
    activeCategories: number;
}

export interface DashboardData {
    username: string;
    totalConversations: number;
    totalMessages: number;
    memberSince: string;
    recentConversations: Pick<Conversation, 'id' | 'title' | 'created_at'>[];
}

export interface SearchResult {
    id: string;
    article_number: string;
    content: string;
    document_title_ar: string;
    document_title_en: string | null;
    category_name_ar: string;
    category_name_en: string;
}

export interface AnalyticsData {
    conversationsPerDay: { date: string; count: number }[];
    topTopics: { title: string; count: number }[];
    userRegistrations: { date: string; count: number }[];
    feedbackByType: { type: string; count: number }[];
    averageRating: number;
}

export interface AuditLog {
    id: string;
    admin_id: string;
    action: string;
    target_type: string;
    target_id: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
}
