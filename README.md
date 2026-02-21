# RecipeRiff

A recipe management app with smart ingredient substitutions. React Native (Expo) frontend + Node.js/Express backend with SQLite.

## Features

- **Recipe CRUD** -- Create, edit, delete recipes with ingredients, directions, tags, and notes
- **Smart Substitutions** -- Tap any ingredient to find alternatives with adjusted quantities (500+ mappings across 15 categories)
- **Cook Logging** -- Log when you cook a recipe with ratings, notes, and photos
- **Stats Dashboard** -- Cooking streak, monthly meal count, most-cooked recipes, 28-day activity grid
- **Search & Sort** -- Full-text search, tag filtering, sort by most-cooked or recently-cooked
- **Auth** -- JWT-based signup/login with token refresh

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React Native + Expo (managed) |
| Navigation | React Navigation 7 (bottom tabs + native stack) |
| Backend | Node.js + Express |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (15-min access + 7-day refresh tokens) |

## Project Structure

```
recipeRiff-app/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express entry point
│   │   ├── db/
│   │   │   ├── init.js           # Schema + seed trigger
│   │   │   └── seed-substitutions.js  # 500+ substitution mappings
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification
│   │   │   └── upload.js         # Multer photo upload
│   │   ├── routes/
│   │   │   ├── auth.js           # signup, login, refresh
│   │   │   ├── recipes.js        # CRUD + search/sort/filter
│   │   │   ├── substitutions.js  # ingredient lookup
│   │   │   ├── cookLogs.js       # cook logging
│   │   │   └── stats.js          # streak, activity, top recipes
│   │   └── utils/token.js        # JWT helpers
│   └── .env
│
└── frontend/
    ├── App.js
    └── src/
        ├── api/client.js          # Axios + interceptors
        ├── context/AuthContext.js  # Auth state management
        ├── theme/index.js         # Colors, fonts, spacing
        ├── navigation/            # App + Auth navigators
        ├── screens/               # Auth, Recipes, Stats, Profile
        ├── components/            # Reusable UI components
        └── hooks/                 # API hooks
```

## Setup

### Prerequisites

- Node.js 18+
- npm
- Expo CLI (`npm install -g expo-cli`) or use `npx expo`
- Expo Go app on your phone (iOS/Android) for testing

### Backend

```bash
cd backend
npm install
npm start
```

The server starts on `http://localhost:3001`. On first run it creates a SQLite database and seeds 500+ substitution mappings.

### Frontend

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go to run on your phone.

**If testing on a physical device**, update the `BASE_URL` in `frontend/src/api/client.js` to your computer's local IP address:

```js
const BASE_URL = 'http://192.168.x.x:3001/api';
```

## API Endpoints

### Auth (public)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |

### Recipes (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/recipes` | List recipes (supports `?search=`, `?tag=`, `?sort=`) |
| GET | `/api/recipes/:id` | Get recipe with ingredients, directions, tags, stats |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |

### Substitutions (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/substitutions/lookup?ingredient=butter` | Find substitutes for an ingredient |

### Cook Logs (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/cook-logs` | Log a cook (supports photo upload) |
| GET | `/api/cook-logs?recipeId=1` | Get cook history |

### Stats (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stats` | Streak, monthly meals, most cooked, activity grid |

## Design

- **Background**: Cream (#FFF8F0)
- **Primary accent**: Amber (#F59E0B / #D97706)
- **Secondary**: Sage green (#8BAF7C / #5E8C4A)
- **Tertiary**: Clay (#C4956A / #A0724E)
- **Text**: Charcoal (#2D2926)
- **Heading font**: DM Serif Display
- **Body font**: System default

## Substitution Engine

The substitution engine includes 500+ ingredient-to-substitute mappings across 15 categories: dairy, cheese, eggs, flours, sweeteners, oils/fats, condiments/sauces, herbs/spices, proteins, produce, grains/starches, baking, nuts/seeds, alcohol, and misc.

Lookup uses a 3-tier fallback:
1. **Exact match** on ingredient name
2. **LIKE search** for partial matches
3. **Word splitting** for compound names (e.g., "all-purpose flour" falls back to "flour")

Substitutions are ephemeral -- they display in the UI only and are not persisted to the recipe.

## License

Private -- personal use.
