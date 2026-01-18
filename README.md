# Trips Planner - React Native Expo App

A modern React Native application built with Expo Router for planning and managing trips with daily notes. Fully integrated with Supabase for backend operations and authentication.

**GitHub Repository:** https://github.com/samicavas/trips-planner

---

## Features

### Core Functionality
- **Authentication**: Sign up, Sign in, and session management with Supabase Auth
- **Trip Management**: Create, read, update, and delete trips
- **Destination Tracking**: Add and view destination for each trip
- **Daily Notes**: Add per-day notes for each trip with date selection
- **Date Range Planning**: Set start and end dates for trips
- **Responsive UI**: Beautiful, touch-optimized interface

### Technical Features
- **Form Validation**: Zod schema validation for all user inputs
- **Centralized Styling**: Consistent design system across modules
- **Row Level Security (RLS)**: Supabase RLS policies for data protection
- **Modular Architecture**: Feature-based folder structure for scalability

---

## Tech Stack

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

## Setup Instructions

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

### Step 3: Run the Development Server

#### For Development (Expo Go)
```bash
npm run start
# or
expo start
```
Then:
- **iOS**: Press `i` or scan QR code with camera

#### For Native Build (Prebuild)

**Important Setup:**
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

## Project Structure

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
├── .env                                    # Environment variables
├── .env.example                           # Example env template
├── package.json
├── tsconfig.json
├── app.json                               # Expo configuration
└── README.md
```

---

## Database Schema

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
| `update_at` | TIMESTAMP | Default: NOW() | Creation timestamp |
| `UNIQUE(trip_id, note_date)` | CONSTRAINT | | One note per day per trip |
---

## Validation Schemas

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
