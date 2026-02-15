# Hope in Christ - Ministry Mobile App

## Overview

This is a mobile app for "Hope in Christ for All Nations Ministries," a Christian ministry based in KwaMhlanga, Mpumalanga, South Africa. The app helps members and visitors watch sermons, donate, register for events, and participate in community chat. It's built as an Expo (React Native) app with an Express backend, designed to run on iOS, Android, and web.

Key features:
- **Home** - Welcome screen with quick actions, service schedule, and location info
- **Sermons** - Browse and view sermon details (video/audio)
- **Give/Donate** - Online giving link and EFT bank transfer details
- **Events** - View events and register for conferences
- **Community** - Chat channels for prayer requests and general fellowship
- **About** - Ministry info, departments, leadership, social links
- **Schedule** - Weekly service schedule

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, React 19
- **Routing**: expo-router v6 with file-based routing. The `app/` directory defines all routes using the `(tabs)` group for bottom tab navigation and dynamic routes like `sermon/[id]`, `event/[id]`, `chat/[channel]`, and `register/[id]`
- **State Management**: React Query (`@tanstack/react-query`) for server state. Local component state with React hooks for UI state
- **Styling**: React Native `StyleSheet` with a custom theme system (`lib/useTheme.ts`) that supports light/dark modes based on system preference
- **Fonts**: Nunito font family loaded via `@expo-google-fonts/nunito`
- **Navigation**: Bottom tabs with 5 sections (Home, Sermons, Give, Events, Community). Stack navigation for detail screens. Uses native tab components when available (expo-router unstable-native-tabs)
- **Data**: Currently uses static data defined in `lib/data.ts` for sermons, events, schedule, ministry info, and donation config. Chat messages use `AsyncStorage` for local persistence
- **UI Libraries**: expo-linear-gradient, expo-blur, expo-haptics, expo-image, react-native-gesture-handler, react-native-reanimated, react-native-safe-area-context

### Backend (Express)

- **Framework**: Express 5 running on Node.js with TypeScript (compiled via `tsx` for dev, `esbuild` for production)
- **API**: Routes registered in `server/routes.ts`, prefixed with `/api`. Currently minimal — mostly scaffolding
- **CORS**: Custom middleware that allows requests from Replit domains and localhost origins
- **Storage**: In-memory storage (`MemStorage` class in `server/storage.ts`) implementing an `IStorage` interface. This is a placeholder — designed to be swapped for database-backed storage
- **Static Serving**: In production, serves the built Expo web bundle. In development, proxies to the Expo dev server

### Database (PostgreSQL + Drizzle)

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts`. Currently has a single `users` table with `id`, `username`, and `password` fields
- **Validation**: Uses `drizzle-zod` to generate Zod schemas from Drizzle table definitions
- **Migrations**: Configured via `drizzle.config.ts`, output to `./migrations` directory
- **Push command**: `npm run db:push` to push schema changes to the database
- **Note**: The database schema is minimal. The app currently runs mostly on static data and in-memory storage. The database will need to be expanded for features like chat persistence, event registrations, and user accounts

### Shared Code

- The `shared/` directory contains code shared between frontend and backend (currently just the database schema)
- Path aliases configured: `@/*` maps to root, `@shared/*` maps to `./shared/*`

### Build & Deployment

- **Dev mode**: Two processes — `expo:dev` for the Expo bundler and `server:dev` for the Express server
- **Production build**: `expo:static:build` creates a static web bundle, `server:build` bundles the server with esbuild, `server:prod` runs the production server
- **Environment**: Uses Replit environment variables (`REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, `DATABASE_URL`) for configuration

### Design System

- **Colors**: Purple (#5B2C8E) primary, red (#C0392B) accent, blue (#2471A3) accent, gold (#D4A017) — defined in `constants/colors.ts`
- **Themes**: Full light and dark theme support with semantic color tokens (text, textSecondary, background, surface, card, border, tint)
- **Typography**: Nunito font family with weights from Regular (400) to ExtraBold (800)
- **Components**: Material Design 3 inspired — rounded cards, gradient headers, haptic feedback on interactions

## External Dependencies

- **PostgreSQL**: Database provisioned via Replit, connected through `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for schema definition, queries, and migrations
- **Expo Services**: Font loading, splash screen, haptics, image picker, location, web browser, linear gradient
- **AsyncStorage**: Used for local chat message persistence and nickname storage
- **React Query**: Server state management and API data fetching
- **Donation/Payment**: External URL-based flow (configurable via `DONATION_CONFIG` in `lib/data.ts`). No direct payment processing — redirects to external payment page or shows EFT bank details
- **Maps/Location**: Opens device maps via `Linking.openURL` for the ministry's physical address
- **Social Links**: External links to ministry social media profiles (configured in `lib/data.ts`)