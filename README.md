# ⚖️ المستشار القانوني الجزائري — Algerian Legal AI Assistant

> 🇩🇿 Smart AI-powered legal consultations based on real Algerian legal texts

A full-stack bilingual (Arabic/English) web application that provides instant legal consultations based on Algerian law, powered by Google Gemini AI and Retrieval-Augmented Generation (RAG).

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat** | Conversational legal advisor powered by Gemini 2.5 Flash |
| 📚 **RAG Pipeline** | Vector search over legal articles using pgvector + embeddings |
| 🌐 **Bilingual** | Full Arabic (RTL) and English (LTR) support |
| 🔐 **Auth** | Supabase Auth with email/password, email verification, password reset |
| 👤 **Profile** | Account management, usage stats, change password |
| 📊 **Admin Dashboard** | Manage categories, laws, users, feedback |
| 💬 **Feedback System** | Users submit feedback; admins review and respond |
| 🎨 **Premium UI** | Navy/gold theme with glassmorphism, animations, and responsive design |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Google Gemini 2.5 Flash + text-embedding-004
- **State**: Zustand
- **Font**: Cairo (Arabic + Latin)
- **Deployment**: Vercel

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/           # Login, Register, Forgot/Reset Password, Verify Email
│   ├── admin/            # Admin Dashboard, Categories, Laws, Users, Feedback
│   ├── api/
│   │   ├── admin/        # Admin APIs (stats, categories, laws, users, feedback, process)
│   │   ├── auth/         # Auth callback
│   │   ├── chat/         # Chat API with RAG pipeline
│   │   ├── conversations/# Conversation CRUD + messages
│   │   ├── feedback/     # User feedback submission
│   │   ├── profile/      # Profile GET/PUT
│   │   └── stats/        # Public statistics
│   ├── chat/             # AI Chat page
│   ├── profile/          # User profile page
│   ├── layout.tsx        # Root layout with i18n
│   ├── page.tsx          # Landing page
│   ├── not-found.tsx     # Custom 404
│   ├── error.tsx         # Error boundary
│   └── loading.tsx       # Loading spinner
├── components/
│   ├── chat/             # ChatSidebar, ChatMessage, ChatInput, WelcomeScreen
│   ├── landing/          # Hero, Features, HowItWorks, Stats, CTA sections
│   ├── layout/           # Navbar, Footer, LanguageToggle, ProfileDropdown
│   └── ui/               # Button, Input, Modal, Card, Badge, DataTable, etc.
├── hooks/                # useAuth, useToast, useDebounce
├── lib/
│   ├── gemini/           # Gemini AI client, chat streaming, embeddings
│   ├── i18n/             # Translations (ar/en) + useTranslation hook
│   ├── supabase/         # Supabase clients (browser, server, admin)
│   └── utils/            # Article chunking for RAG
├── stores/               # Zustand stores (language, chat, toast)
├── schema.sql            # Complete database schema with RLS
└── middleware.ts         # Auth protection + admin check
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
ADMIN_EMAIL=your-admin-email@example.com
```

### 3. Set Up Database

1. Open your Supabase project → **SQL Editor**
2. Paste the contents of `schema.sql`
3. Click **Run**
4. Verify: **Table Editor** should show 7 tables + 6 seeded categories

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 How the RAG Pipeline Works

```
1. User asks a legal question
2. Question → Gemini text-embedding-004 → 768-dim vector
3. Vector → match_articles() RPC → cosine similarity search in pgvector
4. Top 5 matching legal articles returned as context
5. Context + question → Gemini 2.5 Flash → streamed response via SSE
6. Response saved to database with source references
```

### Processing Legal Documents

1. **Admin** adds a legal document via the admin dashboard
2. **Admin** clicks "Process" → `/api/admin/process`
3. Document text is chunked by article pattern (المادة/Article)
4. Each chunk gets a 768-dim embedding via Gemini
5. Chunks + embeddings stored in `legal_articles` table
6. Ready for semantic search!

---

## 🔑 Admin Access

The admin email is set in `.env.local` as `ADMIN_EMAIL`. Register with that email to get admin access.

Admin can:
- 📊 View dashboard statistics
- 📁 Manage legal categories (CRUD)
- 📚 Manage legal documents (CRUD + process embeddings)
- 👥 Activate/deactivate users
- 💬 Review and respond to feedback

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set the same environment variables in Vercel dashboard → **Settings** → **Environment Variables**.

---

## 📄 License

This project is for educational purposes. Built with ❤️ for Algeria 🇩🇿.
