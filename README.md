# MindTrack 🧠✨

MindTrack is a premium, full-stack mental health ecosystem built with **Next.js 14**. It empowers users to track their emotional state, manage wellness habits, and engage in AI-driven therapeutic progress tracking through a sleek, glassmorphic interface.

---

## 🚀 Key Features

### 🎭 Emotional Intelligence
- **Intelligent Mood Logging**: Log daily moods with intensity tracking and automated sentiment analysis.
- **Private Journal Vault**: A secure space for thoughts with AI summaries and theme extraction.
- **Sentiment Mapping**: Continuous emotional trend analysis powered by NLP.

### 🧘 Holistic Wellness
- **Mind Sanctuary**: Comprehensive meditation hub with session tracking and mindfulness stats.
- **Habit Architecture**: Streak-based habit tracking for consistent personal growth.
- **Gamified Progress**: XP and Level systems to maintain user engagement and milestone rewards.

### 🤖 AI-Driven Therapy
- **Virtual Therapist**: 24/7 preparation and reflection support powered by **Google Gemini**.
- **Therapeutic Modules**: Multi-day journeys covering Anxiety, Mood Disorders, Trauma, and more.
- **Dynamic Assessments**: Smart quizzes that calculate clinical severity and provide AI-generated reflections.

---

## 🛠️ Technology Catalog

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) / React 18 |
| **Language** | TypeScript |
| **Database** | SQLite + Prisma ORM |
| **Auth** | NextAuth.js |
| **AI/ML** | Google Gemini API (Gen AI SDK) |
| **Design** | Tailwind CSS (Glassmorphism) |
| **Charts** | Chart.js & react-chartjs-2 |

---

## 🏗️ Architectural Overview

MindTrack follows a modern modular architecture:

- **NextAuth Integration**: Secure profile management with Prisma adapters.
- **Service Layer**: Decoupled API logic in `/app/api` for Mood analysis, Habit tracking, and AI reflections.
- **Gamification Engine**: Centralized context provider (`GamificationProvider`) managing global user state.
- **Static Content CMS**: `lib/therapyContent.ts` serves as the centralized source for therapeutic curriculum.

---

## 📊 Database Relationships

MindTrack uses a relational data model with the **User** entity at its core:

- **1:N Relationships**: A single User owns multiple Mood logs, Journal entries, Habits, and Therapy progress records.
- **Relational Integrity**: Uses Cascade Deletes to ensure data consistency across the User profile.
- **Persistence**: Efficient data fetching via Prisma Client singletons.

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.0.0+
- **Database**: SQLite (built-in)

### Installation
1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-key"
   ```

3. **Database Spin-up**:
   ```bash
   npx prisma db push
   ```

4. **Launch Application**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── app/               # Next.js Pages & API Endpoints
├── components/        # Glassmorphic UI & Business Components
├── lib/               # Shared Utilities & Therapy Content
├── prisma/            # Relational Schema Definition
├── public/            # Static Global Assets
└── ...
```

---

> [!TIP]
> **Pro Tip**: Use the **Mind Sanctuary** daily to boost your gamification XP and unlock new mental health milestones.