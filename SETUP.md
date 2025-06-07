# FlashcardAI Setup Guide

FlashcardAI is an AI-powered flashcard application for English B2/C1 level learners. This guide will help you set up the application locally.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (for Supabase local development)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd 10xCards
npm install
```

### 2. Set up Supabase Local Development

Install Supabase CLI:

```bash
npm install -g supabase
```

Start Supabase local services:

```bash
supabase start
```

This will start:

- PostgreSQL database on port 54322
- Supabase Studio on port 54323
- API server on port 54321
- Auth server
- Storage server

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update the `.env` file with your values:

```env
# Supabase Configuration (automatically set by supabase start)
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_start

# OpenRouter.ai Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your Supabase keys by running:

```bash
supabase status
```

### 4. Database Setup

The database schema and demo user are automatically created when you start Supabase. The migration includes:

- `flashcards` table with proper schema
- Row Level Security policies
- Demo user: `demo@example.com` / `demo`
- Default flashcard set (25 B2/C1 level cards)

### 5. OpenRouter.ai API Key

1. Sign up at [OpenRouter.ai](https://openrouter.ai)
2. Create an API key
3. Add it to your `.env` file

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Demo Account

You can test the application using the demo account:

- **Email:** demo@example.com
- **Password:** demopass

This account comes pre-loaded with 25 default flashcards.

## Features Available

✅ **Authentication**

- User registration and login
- Password reset
- Demo account access

✅ **Flashcard Management**

- AI-powered flashcard generation from English text
- Manual flashcard creation
- Edit and delete flashcards
- Browse flashcard collection

✅ **Quiz System**

- 4-option multiple choice quiz
- Random flashcard selection
- Immediate feedback (green/red highlighting)
- Score tracking

✅ **UI/UX**

- Dark theme optimized for learning
- Responsive design (desktop + mobile)
- Intuitive navigation between views

## Architecture

- **Frontend:** Astro 5 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + API)
- **AI:** OpenRouter.ai (OpenAI GPT-4o)
- **Styling:** Dark theme with responsive design

## API Limits

- **Text Input:** 1500 words maximum per AI generation
- **Flashcard Generation:** Up to 10 flashcards per text
- **Focus:** B2/C1 level English vocabulary

## Troubleshooting

### Supabase Issues

```bash
# Reset Supabase if needed
supabase stop
supabase start
```

### Database Issues

```bash
# Check database status
supabase db status

# View logs
supabase logs
```

### Environment Issues

- Ensure all environment variables are set correctly
- Check that Supabase is running: `supabase status`
- Verify OpenRouter.ai API key is valid

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Database Schema

The application uses a simple schema:

```sql
flashcards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  front TEXT NOT NULL,        -- English word/phrase
  back TEXT NOT NULL,         -- Polish translation
  source VARCHAR(10),         -- 'ai', 'manual', or 'default'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Support

If you encounter issues:

1. Check that all services are running with `supabase status`
2. Verify environment variables are correct
3. Check browser console for errors
4. Ensure OpenRouter.ai API key has sufficient credits
