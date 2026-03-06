// ============================================
// Database Types — Algerian Legal AI
// ============================================

// --- Profiles ---
export interface Profile {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProfileInsert {
    id: string;
    username: string;
    email: string;
    avatar_url?: string | null;
    is_active?: boolean;
}

export interface ProfileUpdate {
    username?: string;
    avatar_url?: string | null;
    is_active?: boolean;
}

// --- Legal Categories ---
export interface LegalCategory {
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string | null;
    description_en: string | null;
    icon: string;
    document_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LegalCategoryInsert {
    name_ar: string;
    name_en: string;
    description_ar?: string | null;
    description_en?: string | null;
    icon?: string;
    document_count?: number;
    is_active?: boolean;
}

export interface LegalCategoryUpdate {
    name_ar?: string;
    name_en?: string;
    description_ar?: string | null;
    description_en?: string | null;
    icon?: string;
    document_count?: number;
    is_active?: boolean;
}

// --- Legal Documents ---
export type DocumentType = 'law' | 'decree' | 'regulation' | 'constitution' | 'amendment' | 'other';
export type DocumentStatus = 'active' | 'inactive' | 'draft';

export interface LegalDocument {
    id: string;
    category_id: string;
    title_ar: string;
    title_en: string | null;
    document_type: DocumentType;
    source: string | null;
    year: number | null;
    total_articles: number;
    status: DocumentStatus;
    created_at: string;
    updated_at: string;
    // Joined fields
    category?: LegalCategory;
}

export interface LegalDocumentInsert {
    category_id: string;
    title_ar: string;
    title_en?: string | null;
    document_type?: DocumentType;
    source?: string | null;
    year?: number | null;
    total_articles?: number;
    status?: DocumentStatus;
}

export interface LegalDocumentUpdate {
    category_id?: string;
    title_ar?: string;
    title_en?: string | null;
    document_type?: DocumentType;
    source?: string | null;
    year?: number | null;
    total_articles?: number;
    status?: DocumentStatus;
}

// --- Legal Articles ---
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
    document?: LegalDocument;
}

export interface LegalArticleInsert {
    document_id: string;
    article_number?: string | null;
    content: string;
    chunk_index?: number;
    embedding?: number[] | null;
    is_active?: boolean;
}

// --- Conversations ---
export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface ConversationInsert {
    user_id: string;
    title?: string;
    is_archived?: boolean;
}

// --- Messages ---
export type MessageRole = 'user' | 'assistant';

export interface Message {
    id: string;
    conversation_id: string;
    role: MessageRole;
    content: string;
    related_articles: string[];
    created_at: string;
}

export interface MessageInsert {
    conversation_id: string;
    role: MessageRole;
    content: string;
    related_articles?: string[];
}

// --- Feedback ---
export type FeedbackType = 'general' | 'bug' | 'feature' | 'complaint' | 'praise';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Feedback {
    id: string;
    user_id: string;
    subject: string;
    message: string;
    type: FeedbackType;
    status: FeedbackStatus;
    admin_response: string | null;
    created_at: string;
    updated_at: string;
    // Joined fields
    profile?: Profile;
}

export interface FeedbackInsert {
    user_id: string;
    subject: string;
    message: string;
    type?: FeedbackType;
}

export interface FeedbackUpdate {
    status?: FeedbackStatus;
    admin_response?: string | null;
}

// --- Vector Search Result ---
export interface MatchedArticle {
    id: string;
    document_id: string;
    article_number: string | null;
    content: string;
    chunk_index: number;
    similarity: number;
    document_title_ar: string;
    document_title_en: string | null;
    category_name_ar: string;
    category_name_en: string;
}

// --- API Response Types ---
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface PublicStats {
    totalLaws: number;
    totalUsers: number;
    totalConsultations: number;
    totalArticles: number;
}

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
