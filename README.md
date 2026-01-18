# 🌍 Trips Planner - React Native Expo App

A modern React Native application built with Expo Router for planning and managing trips with daily notes. Fully integrated with Supabase for backend operations and authentication.

**GitHub Repository:** https://github.com/samicavas/trips-planner

---

## � Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Key Assumptions & Trade-offs](#key-assumptions--trade-offs)
- [Known Issues & Workarounds](#known-issues--workarounds)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)

---

## ✨ Features

### Core Functionality
- 🔐 **Authentication**: Sign up, Sign in, and session management with Supabase Auth
- ✈️ **Trip Management**: Create, read, update, and delete trips
- 📍 **Destination Tracking**: Add and view destination for each trip
- 📝 **Daily Notes**: Add per-day notes for each trip with date selection
- 🗓️ **Date Range Planning**: Set start and end dates for trips
- 📱 **Responsive UI**: Beautiful, touch-optimized interface

### Technical Features
- ✅ **Form Validation**: Zod schema validation for all user inputs
- 🎨 **Centralized Styling**: Consistent design system across modules
- 🔒 **Row Level Security (RLS)**: Supabase RLS policies for data protection
- 🏗️ **Modular Architecture**: Feature-based folder structure for scalability

---

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** framework
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **Formik** - Form state management
- **Zod** - Runtime schema validation
- **React Native Bottom Sheet** - Modal dialogs
- **React Native Community DateTimePicker** - Date selection

### Backend & Services
- **Supabase** - PostgreSQL database + Authentication
- **Supabase RLS** - Row-level security policies

### Development Tools
- **ESLint** - Code linting
- **Expo Prebuild** - Native iOS/Android builds

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI**: `npm install -g expo-cli`
- **Supabase account** with a project created
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/samicavas/trips-planner.git
cd trips-planner
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 5: Run the Development Server

#### For Development (Expo Go)
```bash
npm run start
# or
expo start
```

Then:
- **iOS**: Press `i` or scan QR code with camera
- **Android**: Press `a` or scan QR code with Expo Go app

#### For Native Build (Prebuild)

⚠️ **Important Setup:**
1. Install Apple Developer tools (Xcode) for iOS
2. Install Android Studio for Android

```bash
# Clear any existing builds
eas build --platform ios --clear-cache

# Create new build
eas build --platform ios

# For local builds
npx expo prebuild --clean
npx expo run:ios
```

### Step 6: Running Tests

```bash
npm test
```

---

## 📁 Project Structure

```
trips-planner/
├── app/                                    # Expo Router pages
│   ├── _layout.tsx                        # Root layout
│   ├── index.tsx                          # Home/entry point
│   └── screens/
│       ├── SignInScreen.tsx
│       ├── SignUpScreen.tsx
│       ├── TripsScreen.tsx
│       ├── AddTripScreen.tsx
│       └── EditTripScreen.tsx
│
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── dto/                   # Data Transfer Objects
│   │   │   │   └── schemas/               # Zod validation schemas
│   │   │   ├── services/                  # Auth business logic
│   │   │   └── presentation/
│   │   │       ├── pages/
│   │   │       └── styles/
│   │   │
│   │   └── trips/
│   │       ├── data/
│   │       │   ├── dto/                   # Trip & TripNote interfaces
│   │       │   └── schemas/               # Form validation schemas
│   │       ├── services/                  # Supabase CRUD operations
│   │       └── presentation/
│   │           ├── components/
│   │           │   ├── tripCard/          # Trip card component
│   │           │   └── tripNoteCard/      # Note card component
│   │           ├── pages/
│   │           │   ├── TripsPage.tsx
│   │           │   ├── AddTripPage.tsx
│   │           │   ├── EditTripPage.tsx   # Tab-based (Details/Notes)
│   │           │   └── TripNotesPage.tsx
│   │           └── styles/                # Centralized styling
│   │
│   └── shared/
│       └── services/
│           └── supabase.ts                # Supabase client config
│
├── .env                                    # Environment variables (not in git)
├── .env.example                           # Example env template
├── package.json
├── tsconfig.json
├── app.json                               # Expo configuration
└── README.md
```

---

## 🗄️ Database Schema

### Tables Overview

#### **trips** Table
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, Default: `gen_random_uuid()` | Unique identifier |
| `user_id` | UUID | FK → auth.users(id) ON DELETE CASCADE | Owner of the trip |
| `title` | TEXT | NOT NULL | Trip name (min 3 chars) |
| `destination` | TEXT | NOT NULL | Travel destination |
| `description` | TEXT | NULLABLE | Optional trip notes |
| `start_date` | DATE | NOT NULL | Trip start date |
| `end_date` | DATE | NOT NULL | Trip end date |
| `created_at` | TIMESTAMP | Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | Default: NOW() | Last update timestamp |

**Indexes:**
- `idx_trips_user_id` - Fast user trip lookups

---

#### **trip_notes** Table
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | UUID | PK, Default: `gen_random_uuid()` | Unique identifier |
| `trip_id` | UUID | FK → trips(id) ON DELETE CASCADE | Related trip |
| `user_id` | UUID | FK → auth.users(id) ON DELETE CASCADE | Note author |
| `note_date` | DATE | NOT NULL | Date of the note |
| `title` | TEXT | NOT NULL | Note title (min 2 chars) |
| `content` | TEXT | NOT NULL | Note content |
| `created_at` | TIMESTAMP | Default: NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | Default: NOW() | Last update timestamp |
| `UNIQUE(trip_id, note_date)` | CONSTRAINT | | One note per day per trip |

**Indexes:**
- `idx_trip_notes_trip_id` - Fast trip note lookups
- `idx_trip_notes_user_id` - Fast user note lookups
- `idx_trip_notes_note_date` - Fast date-based queries

---

### Row Level Security (RLS) Summary

**All tables have RLS enabled with these policies:**

| Policy | Table | Action | Condition |
|--------|-------|--------|-----------|
| Users can view their own trips | trips | SELECT | `auth.uid() = user_id` |
| Users can insert their own trips | trips | INSERT | `auth.uid() = user_id` |
| Users can update their own trips | trips | UPDATE | `auth.uid() = user_id` |
| Users can delete their own trips | trips | DELETE | `auth.uid() = user_id` |
| Users can view their own trip notes | trip_notes | SELECT | `auth.uid() = user_id` |
| Users can insert notes for their own trips | trip_notes | INSERT | `auth.uid() = user_id` |
| Users can update their own notes | trip_notes | UPDATE | `auth.uid() = user_id` |
| Users can delete their own notes | trip_notes | DELETE | `auth.uid() = user_id` |

---

## 🔍 Key Assumptions & Trade-offs

### Assumptions

1. **User Authentication**
   - Users must create an account before using the app
   - Session persistence is handled automatically by Supabase
   - Email verification is not enforced (can be enabled in Supabase settings)

2. **Data Integrity**
   - Trip dates are always valid (end_date > start_date enforced in schema)
   - One note per date per trip (UNIQUE constraint)
   - Cascade deletion: Deleting a trip deletes all associated notes

3. **User Experience**
   - Turkish locale (`tr-TR`) is hardcoded for date formatting
   - Bottom Sheet modals for date picker (more intuitive on mobile)
   - Formik for form state management (proven, stable)

### Trade-offs

| Decision | Reason | Alternative |
|----------|--------|-------------|
| **Formik** instead of React Hook Form | Easier integration with Zod, simpler for this project | RHF is more performant for large forms |
| **Bottom Sheet Modals** for dates | Better UX on mobile devices | Native date picker (platform-specific) |
| **Centralized Styling** (StyleSheet) | Consistency across modules | CSS-in-JS libraries (less overhead) |
| **Turkish locale hardcoded** | Client requirement | Dynamic locale selection |
| **Supabase instead of custom backend** | Rapid development, built-in auth | Firebase, self-hosted backend |
| **Row-level Security (RLS)** | Secure at DB level, reduces API logic | Application-level permission checks |

---


## 📝 Validation Schemas

### Trip Validation
- **Title**: Minimum 3 characters, required
- **Destination**: Minimum 2 characters, required
- **Start Date**: Required, must be valid date
- **End Date**: Required, must be after start date
- **Description**: Optional

### Trip Note Validation
- **Title**: Minimum 2 characters, required
- **Content**: Required, any length
- **Date**: Required, must be within trip date range

---

**What's Included:**
- Authentication flow (Sign up/Sign in)
- Creating a new trip
- Adding daily notes
- Editing trip details
- Viewing all trips with destinations

---
