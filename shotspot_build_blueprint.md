# ShotSpot — Build Blueprint
*Generated: April 28, 2026*
*For use with Claude Code — read all three sections before asking clarifying questions.*

---

# SECTION 1: VISION

## What It Is

ShotSpot is a marketplace and coaching delivery platform built exclusively for the throws world — shot put, discus, hammer, and javelin. On one side, athletes browse qualified coaches, compare packages, and either apply or pay to start a coaching relationship. On the other side, coaches build a public profile, set their offers, manage their athlete roster, and deliver real coaching through training plans, video review with annotations and voiceover, and in-app messaging. The marketplace is the front door. The delivery platform is what keeps athletes and coaches coming back every week.

This is not a generic fitness marketplace. Everything about ShotSpot — the athlete profile fields, the training log inputs, the video review system, the filtering logic — is built around how throws athletes and coaches actually think and work. A shot put coach doesn't want to see "cardio" as a session type. An athlete logging a training day needs fields for implement weight, distance, throw count, and technique notes — not generic reps and sets.

## Who It's For

**Athletes:** Competitive throws athletes at any level — high school, collegiate, post-collegiate, masters — who want qualified coaching but don't have access to an elite program, or who want remote coaching on top of what they already get. Athletes who are serious enough to track PRs by implement weight, log sessions consistently, and submit video for feedback.

**Coaches:** Experienced throws coaches who want to monetize their expertise online, build a roster of remote athletes, and have real delivery tools (not just a Venmo and a Google Doc). Coaches who can articulate their philosophy, prove their results, and deliver structured coaching week over week.

## The Feel

The public marketplace should feel like a credible, browseable directory — not a SaaS dashboard, not a social feed. Think the structure of Contra or Toptal but for a sport: clean coach cards, strong typography, obvious filters, immediate signal about who a coach is and what they cost. Athletes should be able to scan a page of coach cards and immediately understand who is worth clicking on.

The delivery platform — the coach dashboard and athlete workspace — can feel more like a dashboard after login. Structured, focused, task-oriented. A coach should open their dashboard and immediately see what needs their attention: pending applications, unreviewed videos, athletes who haven't logged in a week.

Visually: Anton as the headline font, `#D7D7D7` background, black for structure and borders, `#007B6F` as the accent. Hard edges, minimal decoration, strong hierarchy. Performance-focused without being aggressive. The brand should feel like something a D1 throws coach would take seriously.

## Branding

- **Name:** ShotSpot
- **Logo:** ShotSpot mark (defined separately)
- **Primary font:** Anton (headlines, labels, filters)
- **Body font:** System sans-serif or Inter
- **Background:** `#D7D7D7`
- **Primary text/borders:** Black (`#000000`)
- **Accent:** `#007B6F`
- **Style:** Hard black lines, strong structure, minimal decoration

## Success Definition

ShotSpot is a real product when: a coach can sign up, build a profile, publish an offer, and receive a paid athlete — all without William touching anything. And that athlete can log their first session, upload a video, and receive annotated video feedback with voiceover from the coach, also without any manual intervention.

That's the loop. Everything before it is setup. Everything after it is growth.

## Out of Scope for v1

- Mobile app (iOS/Android) — web only at launch
- Coach subscription tiers (free/pro/elite limits) — all coaches get full access in v1, tier logic scaffolded but not enforced
- Recruiting profile / public athlete analytics
- Push notifications / email notification system
- Admin dashboard
- Reviews and testimonials
- Competition planning tools
- Team or organization-level accounts
- Advanced AI features
- Waitlist or capacity management automation

---

# SECTION 2: BUILD PLAN

## Phase 1: Foundation

**Goal:** Get a working Next.js + Supabase project scaffolded, connected, and deployable.

**Why this phase comes here:**
Nothing else can be built without a repo, a database, an environment config, and a deployment pipeline. This phase has no dependencies and everything else depends on it.

**Tasks:**
- [ ] Initialize Next.js 14 app with App Router (`/app` directory)
- [ ] Set up Supabase project (auth, database, storage buckets)
- [ ] Configure `.env.local` with Supabase URL, anon key, service role key
- [ ] Set up Mux account and add Mux API keys to env
- [ ] Set up Stripe account, get API keys, add to env
- [ ] Configure ESLint, Prettier, TypeScript strict mode
- [ ] Set up Tailwind CSS with ShotSpot design tokens (colors, fonts)
- [ ] Create `/docs` folder with product spec, build plan, data model stubs
- [ ] Deploy to Vercel, confirm environment variables are live
- [ ] Set up a basic health check route (`/api/health`) that returns 200

**Success Criteria:**
Visiting the deployed URL shows a placeholder page. `/api/health` returns 200. Supabase connection is confirmed. Mux and Stripe keys are in env and accessible server-side. No TypeScript errors on build.

**Watch out for:**
- Mux requires a webhook endpoint later — stub `/api/webhooks/mux` early even if it does nothing
- Stripe Connect requires a redirect URL for OAuth — register it in Stripe dashboard before Phase 6
- App Router vs Pages Router: commit to App Router now, don't mix

---

## Phase 2: Auth + User Model

**Goal:** Athletes and coaches can create accounts, sign in, and be recognized as the correct role throughout the app.

**Why this phase comes here:**
Auth is the foundation for every feature that touches user data. Getting it wrong — especially role-based access — is painful to refactor later. Build it once, build it correctly, and every subsequent phase builds on top of it cleanly.

**Tasks:**
- [ ] Configure Supabase Auth with email/password, Google OAuth, Apple OAuth
- [ ] Create `users` table extending Supabase `auth.users`:
  - `id` (uuid, FK to auth.users)
  - `role` (enum: `athlete` | `coach` | `admin`)
  - `email`
  - `full_name`
  - `avatar_url`
  - `created_at`
  - `onboarding_complete` (boolean)
- [ ] Create `/sign-in` page with all three auth methods
- [ ] Create `/athlete-signup` route — creates user with role: athlete
- [ ] Create `/coach-signup` route — creates user with role: coach
- [ ] Set up Supabase RLS (Row Level Security) policies on `users` table
- [ ] Create auth middleware that protects dashboard routes
- [ ] Create `useUser()` hook that returns current user + role
- [ ] Set up redirect logic: after login, route to correct dashboard by role
- [ ] Create basic account settings page (`/settings`)

**Success Criteria:**
A user can sign up as athlete or coach via Google, Apple, or email. After login, they land on a role-appropriate page. Signing in as a coach doesn't give athlete-level access and vice versa. RLS prevents users from reading each other's private data.

**Watch out for:**
- Apple Sign-In requires an Apple Developer account and specific callback URL configuration — do this early
- Google OAuth needs verified domain for production — use localhost redirect in dev
- RLS must be enabled per table — don't skip this, it's hard to add safely later
- `role` should be set at signup time and stored in the `users` table, not just in JWT claims

---

## Phase 3: Brand + UI System

**Goal:** Build the shared component library that every future page reuses, anchored to one polished reference page.

**Why this phase comes here:**
Building UI components ad-hoc per page creates inconsistency and debt fast. Doing this before the marketplace means every page from Phase 4 onward uses real components, not one-offs. The reference page also gives a visual baseline to pressure-test the brand before it's everywhere.

**Tasks:**
- [ ] Set up Anton font via Google Fonts or local
- [ ] Define Tailwind config with ShotSpot tokens:
  - `shotspot-bg`: `#D7D7D7`
  - `shotspot-accent`: `#007B6F`
  - `shotspot-black`: `#000000`
- [ ] Build core components:
  - `<Button>` (primary, secondary, ghost, destructive)
  - `<Input>` (text, number, textarea)
  - `<Select>` and `<MultiSelect>`
  - `<FilterPill>` (active/inactive states)
  - `<CoachCard>` (marketplace card component)
  - `<PackageCard>` (offer display component)
  - `<Modal>` with backdrop + close
  - `<Toast>` notification system
  - `<Badge>` (event tags, status labels)
  - `<EmptyState>` with icon + CTA
  - `<LoadingSpinner>` and skeleton loaders
  - `<Avatar>` with fallback initials
  - `<PageHeader>` with breadcrumb support
- [ ] Build `<AppShell>` — public header, authenticated sidebar, footer
- [ ] Build public `<Header>` with nav links + auth CTAs
- [ ] Build coach dashboard sidebar nav
- [ ] Build athlete dashboard sidebar nav
- [ ] Create one polished reference page: the public marketplace index (`/`)
- [ ] Confirm `<CoachCard>` renders correctly with mock data on the reference page

**Success Criteria:**
The marketplace index (`/`) is visually polished, brand-correct, and built entirely from reusable components. No inline styles. All components are in `/components/ui`. A new developer could build any new page by composing these components without inventing new patterns.

**Watch out for:**
- Anton as a display font works for headlines and labels — don't use it for body text, it'll be unreadable at small sizes
- Build components mobile-responsive from the start even though mobile app is out of scope — the web app must work on mobile browsers
- `<CoachCard>` will be rendered in a grid — make sure it handles variable-length text (coach names, headlines) gracefully

---

## Phase 4: Public Marketplace

**Goal:** Anyone can browse coaches, filter by event/price/proof/intake, and view a full coach detail page — without an account.

**Why this phase comes here:**
The marketplace is the hook. It needs to exist and feel real before you build accounts, onboarding, or payment. Athletes should be able to discover ShotSpot through a coach's shared profile URL and immediately understand the product without being forced to sign up.

**Tasks:**
- [ ] Create `coach_profiles` table (see Data Model section)
- [ ] Seed mock coach profiles (minimum 5, with real throws-world data)
- [ ] Build `/` marketplace index:
  - Coach card grid
  - Filter sidebar or filter pill row
  - Event filters (shot put, discus, hammer, javelin)
  - Experience filters (5+ years, 10+ years)
  - Proof filters (elite athletes, collegiate athletes, state champions, beginners/youth)
  - Offer type filters (full coaching, programming only, video review only, one-time critique, in-person, remote)
  - Intake mode filters (instant join, application required)
  - Price range filter
  - Availability filter (open now, waitlist, limited)
- [ ] Build `/coaches/[id]` coach detail page:
  - Hero section (photo, name, location, org, events, headline)
  - Bio + coaching philosophy
  - Credentials + proof section
  - Athlete results
  - Capacity and response expectations
  - Policies
  - Offer/package cards
  - Account-gated apply/join CTA (routes to signup if not authenticated)
- [ ] Build `/coach-signup` and `/athlete-signup` public landing pages
- [ ] Build `/sign-in` page
- [ ] Implement coach profile publish state (draft vs. live) — only live profiles appear in marketplace
- [ ] Add SEO metadata to coach pages (`generateMetadata`)

**Success Criteria:**
An unauthenticated visitor can land on the marketplace, filter by discus + remote + instant join, click a coach card, read their full profile, view their offers, and be routed to signup when they try to apply or join. Coach pages have proper meta titles for sharing.

**Watch out for:**
- Filter state should live in URL params (`?event=discus&intake=instant`) so pages are shareable and SEO-friendly
- Coach detail page at `/coaches/[id]` should be statically generated where possible (`generateStaticParams`) and revalidated on publish
- Empty state when filters return no coaches must look intentional, not broken

---

## Phase 5: Athlete Profile Builder

**Goal:** Athletes can create a free account and build a detailed throws-specific profile that coaches can use to evaluate applications.

**Why this phase comes here:**
The athlete profile has to exist before the application flow (Phase 7) can work. Coaches reviewing applications need to see something real. Building it here also gives athletes something to do after signup — the profile becomes their home base.

**Tasks:**
- [ ] Create `athlete_profiles` table (see Data Model)
- [ ] Build multi-step athlete onboarding flow after signup:
  - Step 1: Basic info (name, age, location, photo)
  - Step 2: Event info (primary event, secondary events, competitive level, school/club)
  - Step 3: PRs by implement weight (shot put by kg, discus by kg, hammer, javelin)
  - Step 4: Max lifts (squat, bench, clean, snatch, deadlift + optional)
  - Step 5: Goals (short term, season, long term)
  - Step 6: Training setup (implements, ring access, gym access, weekly schedule)
  - Step 7: What they want in a coach (optional)
  - Step 8: Privacy settings (what to show publicly)
- [ ] Build `/athlete/profile` edit page (same fields, post-onboarding)
- [ ] Build athlete profile preview (what a coach sees when reviewing an application)
- [ ] Build `/athlete/dashboard` pre-coach state:
  - Profile completion prompt
  - Browse coaches CTA
  - Saved coaches
  - Active applications

**Success Criteria:**
An athlete can complete onboarding in under 5 minutes. Their profile shows implement-specific PRs correctly (e.g., 4kg shot separate from 7.26kg shot). Profile preview matches what a coach would see. Privacy settings prevent hidden fields from appearing publicly.

**Watch out for:**
- PR fields by implement weight need careful UX — don't make athletes fill 12 empty fields, use progressive disclosure
- Injury history field must be optional and clearly labeled as private/visible-to-coach-only
- Save progress between steps in case athlete drops off mid-onboarding

---

## Phase 6: Coach Onboarding + Offer Builder

**Goal:** A coach can sign up, build their public profile, create one or more offers, set their intake mode, and publish to the marketplace.

**Why this phase comes here:**
Coaches are the supply side. No coaches = no marketplace. This has to exist before any athlete can apply or join, and the offer builder defines exactly what athletes are buying — which drives the payment and entitlement system in Phase 7.

**Tasks:**
- [ ] Create `coach_profiles` table fully (see Data Model)
- [ ] Create `coach_offers` table (see Data Model)
- [ ] Build multi-step coach onboarding:
  - Step 1: Basic info (name, photo, location, org/brand, remote/in-person)
  - Step 2: Events coached, years coaching, years competing
  - Step 3: Credentials, certifications, education
  - Step 4: Proof + credibility (athlete levels, state champs, elite athletes coached)
  - Step 5: Coaching philosophy + bio
  - Step 6: Who they're a good fit for / not a good fit for
  - Step 7: Response time, video turnaround, policies
  - Step 8: Athlete capacity + intake mode (instant join vs. application required — set at profile level)
- [ ] Build offer builder at `/coach/offers/new`:
  - Offer name + description
  - Price + billing cadence (monthly / weekly / one-time)
  - Included services checklist (training plans, video reviews, messaging, calls, technique analysis)
  - Video review limit per week/month
  - Training plan frequency
  - Messaging access (none / limited / unlimited)
  - Call access (none / monthly / bi-weekly / weekly)
  - Athlete cap per offer
- [ ] Build marketplace card preview and full profile preview
- [ ] Build publish/unpublish toggle
- [ ] Build `/coach/dashboard` overview stub (real data comes in Phase 9)
- [ ] Build `/coach/offers` management page (list, edit, pause, delete)

**Success Criteria:**
A coach can complete onboarding, create at least one offer, preview how their card and profile look in the marketplace, and publish. Their profile appears in the marketplace immediately after publish. Offer details correctly reflect what they configured.

**Watch out for:**
- Intake mode is at the profile level (not offer level) — one coach is either "application required" for all offers or "instant join" for all
- Coach should see a preview of their marketplace card before publishing — this is a trust moment
- Offers need a `status` field (active / paused / deleted) — coaches need to pause offers without deleting them

---

## Phase 7: Application + Instant Join + Stripe Connect Payments

**Goal:** An athlete can either apply to a coach or instantly join an offer, and payment activates the coach-athlete relationship via Stripe Connect with automatic platform fee.

**Why this phase comes here:**
This is the transaction layer — the moment ShotSpot becomes a real business. It requires auth (Phase 2), athlete profiles (Phase 5), and coach offers (Phase 6) to already exist. Stripe Connect setup is complex enough that it deserves its own phase rather than being bolted onto delivery.

**Tasks:**
- [ ] Set up Stripe Connect (Express accounts for coaches)
- [ ] Build `/api/stripe/connect` — coach onboards to Stripe, ShotSpot gets platform access
- [ ] Add Stripe account ID to `coach_profiles`
- [ ] Create `applications` table (see Data Model)
- [ ] Create `athlete_coach_relationships` table (see Data Model)
- [ ] Build instant join flow:
  - Athlete selects offer → clicks Join
  - If not signed in → route to athlete signup → return to offer
  - Stripe Checkout session created with `application_fee_amount`
  - On success → create relationship record → activate entitlements
  - On cancel → return to coach profile
- [ ] Build application flow:
  - Athlete selects offer → clicks Apply
  - Athlete completes/confirms profile
  - Athlete answers intake questions (if coach has set any)
  - Application submitted → status: pending
  - Coach sees application in dashboard
  - Coach accepts → athlete gets payment link
  - Coach declines → athlete notified
  - Athlete pays → relationship activated
- [ ] Create `entitlements` table derived from purchased offer
- [ ] Build payment state machine:
  - `draft_checkout` → `payment_pending` → `active`
  - `active` → `failed_payment` → `paused`
  - `active` → `cancelled`
  - `active` → `refunded`
- [ ] Build Stripe webhook handler (`/api/webhooks/stripe`):
  - `checkout.session.completed` → activate relationship
  - `invoice.payment_failed` → flag relationship
  - `customer.subscription.deleted` → deactivate relationship
- [ ] Build application review queue in coach dashboard (`/coach/applications`)

**Success Criteria:**
An athlete can complete an instant join on a test offer and the relationship activates. An athlete can submit an application, the coach can accept it, the athlete pays, and the relationship activates. Platform fee is taken automatically. Coach receives payout. Stripe dashboard confirms the transaction split.

**Watch out for:**
- Stripe Connect Express onboarding has several steps and redirect flows — test this end-to-end in test mode before touching real accounts
- `application_fee_amount` is set in cents at checkout session creation — define the platform fee percentage as a constant and document it
- Subscription billing (monthly) vs. one-time offers need different Stripe product/price configurations — build for both from the start
- Failed payment handling: relationship should be flagged, not immediately deleted — give athlete a grace window

---

## Phase 8: Delivery Platform V1 — Coach Dashboard + Athlete Workspace

**Goal:** Active coach-athlete relationships have a working home. Coaches can assign training plans and log athlete activity. Athletes can see their plan, log sessions, and view their workspace.

**Why this phase comes here:**
Payment is useless without delivery. Once a relationship is active, both coach and athlete need somewhere to go. This phase builds the minimum useful workspace — not everything, but enough that a real coaching relationship could start.

**Tasks:**

**Coach Dashboard:**
- [ ] Build `/coach/dashboard` overview:
  - Active athletes count
  - Pending applications count
  - Unreviewed videos count
  - Unread messages count
  - Recent athlete logs
  - Monthly revenue (from Stripe)
- [ ] Build `/coach/athletes` roster page (cards with athlete name, offer, last activity, status)
- [ ] Build `/coach/athletes/[id]` athlete detail page:
  - Athlete profile summary
  - Current offer + payment status
  - Training plan assigned
  - Recent logs
  - Recent videos
  - PR history
  - Coach notes (private)
- [ ] Build training plan builder (`/coach/plans/new`):
  - Plan name + description
  - Assign to athlete(s)
  - Add sessions (throwing / lifting / mobility / recovery / rest)
  - Throwing session: implement type, implement weight, throw count, technique focus
  - Lifting session: exercises with sets/reps/weight target or RPE
  - Each session generates the logging fields athlete sees
- [ ] Build plan assignment flow

**Athlete Workspace:**
- [ ] Build `/athlete/dashboard` active state (coach assigned):
  - Current coach card
  - Active offer
  - Today's session
  - Quick log CTA
  - Messages preview
  - Video upload CTA
- [ ] Build session log form (generated from assigned plan):
  - Throwing log: implement weight fields, distance per throw, notes
  - Lifting log: exercise rows with sets/reps/weight/RPE/completion
  - Auto-saves on field change
- [ ] Build `/athlete/progress` — PR history, lift history, session streak

**Success Criteria:**
A coach can assign a throwing session plan to an athlete. The athlete sees it in their workspace. The athlete logs distances for the correct implement weights. The coach can see the completed log on the athlete detail page. Both sides have a functional home.

**Watch out for:**
- Training log forms must be generated from the session schema — don't hardcode log fields, the structure must be dynamic
- Throwing session logs need to handle multiple implements in one session (e.g., 7.26kg + 8kg in the same workout)
- Coach notes on athlete detail page must be private (athlete cannot see them) — enforce with RLS

---

## Phase 9: Messaging

**Goal:** Athletes and coaches can send and receive messages inside the platform, with access gated by the purchased offer.

**Why this phase comes here:**
Messaging is a delivery feature, not a marketplace feature. It only makes sense once a relationship exists. Building it after the delivery platform means message threads can be properly attached to relationships and entitlement-checked.

**Tasks:**
- [ ] Create `message_threads` and `messages` tables (see Data Model)
- [ ] Build real-time messaging using Supabase Realtime subscriptions
- [ ] Build `/messages` page for both coach and athlete:
  - Thread list (sidebar)
  - Message view (main)
  - Compose input
  - Read receipts
- [ ] Gate messaging access based on offer entitlement (messaging: none / limited / unlimited)
- [ ] Show message access status to athlete if their offer doesn't include messaging

**Success Criteria:**
A coach sends a message to an athlete. The athlete receives it in real time without refreshing. A second athlete on a "no messaging" offer sees a locked state instead of a compose input. Thread history persists across sessions.

**Watch out for:**
- Supabase Realtime requires the `messages` table to have RLS enabled with correct policies or it won't broadcast
- Message limits (for "limited" messaging) need a counter per billing period — define this in the entitlements system

---

## Phase 10: Video Review with Annotations and Voiceover

**Goal:** Athletes upload video via Mux. Coaches review it, draw annotations (lines, circles, arrows), record voiceover, and send feedback back to the athlete.

**Why this phase comes here:**
This is the most technically complex phase in the build. It's placed after everything else is stable so it doesn't block core functionality. The messaging and delivery platform must exist first — video feedback is sent through a feedback object that lives alongside messaging.

**Tasks:**

**Upload Pipeline:**
- [ ] Build Mux direct upload flow:
  - Athlete requests upload URL from `/api/mux/upload`
  - Client uploads directly to Mux
  - Mux fires webhook on `video.asset.ready`
  - `/api/webhooks/mux` updates `video_submissions` table with Mux asset ID + playback ID
- [ ] Create `video_submissions` table (see Data Model)
- [ ] Build `/athlete/videos` upload page:
  - Upload button
  - Video title + description
  - Submit to coach toggle
  - Upload progress indicator
  - Processing state (while Mux transcodes)
  - Playback once ready

**Coach Review Interface:**
- [ ] Build video review queue at `/coach/videos`:
  - List of pending submissions per athlete
  - Submitted date, athlete name, video title
- [ ] Build `/coach/videos/[id]` review page:
  - Mux player via `@mux/mux-player-react`
  - Canvas overlay on top of video for annotations
  - Drawing tools: line, circle, arrow (using Konva.js or Fabric.js)
  - Timestamp marker: pause video, draw annotation, it's attached to that timestamp
  - Written feedback text area
  - Voiceover recording: MediaRecorder API, record audio while video plays, upload to Supabase Storage
  - Send feedback button → creates `video_feedback` record

**Athlete Feedback View:**
- [ ] Build feedback viewer in athlete workspace:
  - Mux player with coach's voiceover synced
  - Annotation overlay displayed at correct timestamps during playback
  - Written feedback below video
  - Coach reply threading

**Success Criteria:**
Athlete uploads a throw video. Coach opens it, draws an arrow on a frame at a timestamp, records 30 seconds of voiceover commentary, adds written notes, and sends it. Athlete opens feedback: video plays with the voiceover audio, the arrow appears at the correct timestamp, written notes are visible. End to end works without dropping any data.

**Watch out for:**
- Mux webhook must fire before the coach can review — build a "processing" state that blocks access until `video.asset.ready`
- Annotation data must be serialized (JSON: shape type, coordinates, timestamp, color) and stored in the database — not just rendered client-side
- Voiceover audio synced to video playback is tricky: store the voiceover as a separate audio file, play it with `AudioContext` synchronized to the Mux player's `currentTime`
- Canvas annotations over a Mux player require careful z-index management and pointer event handling
- This phase will likely take 2-3 weeks. Do not rush it. Get upload → playback → annotation → voiceover each working in isolation before combining.

---

# SECTION 3: TECH STACK

## Full Stack Summary

| Category | Choice | Notes |
|----------|--------|-------|
| Framework | Next.js 14 (App Router) | Web-first, SSR for marketplace SEO, API routes for backend |
| Database | Supabase (Postgres) | Auth + DB + Realtime + Storage in one |
| Auth | Supabase Auth | Email/password, Google OAuth, Apple OAuth |
| Styling | Tailwind CSS | ShotSpot design tokens configured in tailwind.config |
| UI Components | Custom component library | Built in Phase 3, no third-party UI lib dependency |
| Payments | Stripe Connect (Express) | Automated payouts to coaches, platform fee at checkout |
| Video Hosting | Mux | Upload, transcode, stream — purpose-built for this |
| Video Annotations | Konva.js | Canvas-based drawing library, works well with React |
| Voiceover | Web MediaRecorder API + Supabase Storage | Record in browser, store as audio file |
| Real-time Messaging | Supabase Realtime | Postgres changes broadcast to subscribed clients |
| Deployment | Vercel | Native Next.js hosting, instant deploys from GitHub |
| CI/CD | GitHub + Vercel auto-deploy | Push to main = deploy |
| Analytics | To be decided post-v1 | Posthog or Vercel Analytics are good candidates |

---

## Phase 1: Foundation — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 App Router | Industry standard, great DX, Vercel native |
| Database | Supabase | Instant Postgres + auth + storage + realtime |
| Video | Mux | API keys set up early, webhooks stubbed early |
| Payments | Stripe | Keys in env from day one |
| Deployment | Vercel | One-click GitHub integration |
| Linting | ESLint + Prettier + TypeScript strict | Catches errors before Claude Code makes them |

**Setup notes:** Create the Supabase project first, get the URL and keys, then scaffold the Next.js app. Use `create-next-app` with TypeScript and Tailwind. Commit `.env.example` with all required keys listed but no values.

**Alternatives considered:** PlanetScale + Prisma (more complex, less integrated), Railway (fine but Vercel + Supabase is simpler), Neon (Supabase is more feature-complete for this use case).

---

## Phase 2: Auth + User Model — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Auth | Supabase Auth | Built into the stack, handles OAuth providers, session management |
| Google OAuth | Supabase + Google Cloud Console | Standard setup |
| Apple OAuth | Supabase + Apple Developer Account | Required for any product with Apple Sign-In |
| Session management | Supabase SSR helpers (`@supabase/ssr`) | Handles cookies correctly in App Router |
| Role storage | Postgres `users` table | Role lives in DB, not just JWT, for RLS enforcement |

**Setup notes:** Use `@supabase/ssr` not the deprecated `@supabase/auth-helpers-nextjs`. Middleware must call `supabase.auth.getSession()` on every protected route. Apple Sign-In requires a Services ID and private key in Apple Developer Console — do this before building the UI.

**Alternatives considered:** NextAuth.js (more flexible but more setup, not worth it when Supabase Auth already handles everything needed).

---

## Phase 3: Brand + UI System — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Styling | Tailwind CSS | Utility-first, fast iteration, configured with ShotSpot tokens |
| Font | Anton via Google Fonts | Defined in `layout.tsx` with `next/font/google` |
| Icons | Lucide React | Clean, consistent, tree-shakeable |
| Animation | Framer Motion (optional) | Page transitions and micro-animations if needed |
| Component structure | `/components/ui` folder | All shared primitives in one place |

**Setup notes:** Define the Tailwind config extension before building any components so tokens are available everywhere. Use CSS variables for the accent color so it can be easily updated. Do not use shadcn/ui — build the components from scratch to match the ShotSpot brand exactly.

---

## Phase 4: Public Marketplace — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Rendering | Next.js ISR (Incremental Static Regeneration) | Coach pages are statically generated, revalidated on publish |
| Data fetching | Supabase server client in Server Components | No waterfall, data fetched server-side |
| URL state | `nuqs` (URL query string state) | Filter state lives in URL, shareable, SEO-friendly |
| SEO | `generateMetadata` per route | Coach pages get proper meta titles, OG images |

**Setup notes:** Use `nuqs` for filter state management — it syncs filter pills to URL params cleanly in App Router. Coach profile pages at `/coaches/[id]` should use `generateStaticParams` for known published coaches and fall back to dynamic for new ones.

---

## Phase 5: Athlete Profile — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Forms | React Hook Form + Zod | Validation, multi-step state, error handling |
| Multi-step state | `useState` or `useReducer` in a form context | Keep it simple, no need for a library |
| Image upload | Supabase Storage | Profile photos uploaded directly to Supabase bucket |
| Partial save | Supabase upsert on each step | Athlete can drop off and resume |

**Setup notes:** Each onboarding step should upsert to `athlete_profiles` independently so progress is saved even if the athlete doesn't finish. PR fields by implement weight are a JSON column in Postgres — define the schema carefully.

---

## Phase 6: Coach Onboarding + Offer Builder — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Forms | React Hook Form + Zod | Same pattern as athlete onboarding |
| Image upload | Supabase Storage | Coach photo + optional brand logo |
| Offer builder | Controlled form with dynamic fields | Offers have variable included services |
| Preview | Live preview component fed by form state | Coach sees card + profile preview in real time |

**Setup notes:** The offer builder is a form, not a separate tool. Drive the preview component directly from `watch()` in React Hook Form so changes appear live without saving.

---

## Phase 7: Payments — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Payments | Stripe Connect (Express) | Automated payouts, platform fee, minimal compliance burden vs. Custom |
| Checkout | Stripe Checkout Sessions | Hosted payment page, handles all card UI and 3DS |
| Webhooks | `/api/webhooks/stripe` | Stripe signs webhooks — verify signature on every event |
| Subscription billing | Stripe Subscriptions | Monthly/weekly recurring offers |
| One-time billing | Stripe Payment Intents | One-time critique or session offers |
| Fee | `application_fee_amount` on Checkout Session | Platform fee taken automatically at charge time |

**Setup notes:** Store `stripe_customer_id` on the `users` table and `stripe_account_id` on `coach_profiles` from day one. The platform fee percentage should be a single constant defined in `/lib/constants.ts`. Use Stripe test mode until Phase 7 is complete and tested end-to-end.

---

## Phase 8: Delivery Platform — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Data | Supabase server components | Dashboard data fetched server-side per request |
| Training plan schema | JSONB columns in Postgres | Flexible session structure without rigid table-per-sport schema |
| Log form generation | Dynamic form built from session schema | Form fields rendered from the plan's session definition |
| Real-time log updates | Supabase Realtime (optional) | Coach can see logs update live on athlete detail page |

**Setup notes:** Training session schema stored as JSONB allows throwing sessions and lifting sessions to have different field structures without separate tables. Define a TypeScript type for `SessionSchema` and `LogEntry` early and use them everywhere.

---

## Phase 9: Messaging — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Real-time | Supabase Realtime (`postgres_changes`) | Messages broadcast to both participants instantly |
| Storage | `messages` table in Postgres | Full message history persisted |
| Entitlement check | Server-side middleware on `/messages` routes | No client-side gate that can be bypassed |

**Setup notes:** Subscribe to `postgres_changes` on the `messages` table filtered by `thread_id`. This requires RLS to be correctly set up — only thread participants can subscribe. Test with two browser windows open simultaneously.

---

## Phase 10: Video Review — Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Video hosting | Mux | Upload → transcode → stream, purpose-built |
| Video player | `@mux/mux-player-react` | Official Mux React component, handles adaptive streaming |
| Upload | Mux Direct Upload API | Client uploads directly to Mux, no server proxy needed |
| Annotations | Konva.js (`react-konva`) | Canvas drawing library with React bindings, handles shapes well |
| Voiceover | MediaRecorder API | Browser-native audio recording |
| Voiceover storage | Supabase Storage | Audio file uploaded after recording, URL stored in feedback record |
| Annotation storage | JSONB in `video_feedback` table | Serialize all annotation shapes + timestamps as JSON |

**Setup notes:** The annotation canvas must sit in a React ref that exactly overlays the Mux player. Use `position: absolute` on the canvas with the same dimensions as the player. Konva stages are sized in pixels — get the player's rendered dimensions via `ResizeObserver` and keep the canvas synced. For voiceover sync: store `recording_start_offset` (seconds into video when recording started) alongside the audio file so playback can be synchronized correctly.

**Alternatives considered:** Cloudinary for video (Mux is better for sports video with adaptive streaming and webhooks), Video.js for player (Mux's own player handles their streaming format natively), Fabric.js for annotations (Konva has better React integration with `react-konva`).

---

# HANDOFF NOTES FOR CLAUDE CODE

You are receiving a build blueprint for **ShotSpot** — a throws coaching marketplace and delivery platform. Before writing any code:

1. Read all three sections above fully
2. Ask clarifying questions about anything that seems underspecified before starting
3. Do not skip phases or reorder them — the sequencing is intentional and each phase has dependencies on the previous
4. Do not add features not listed in VISION or BUILD_PLAN without asking first
5. At the start of each phase, confirm with me what you're about to do before doing it
6. Reference `/docs/shotspot-product-spec.md` for domain-specific details (field names, event types, offer structures)

**Known decisions — do not re-litigate:**
- Next.js 14 App Router (not Pages Router, not Remix, not anything else)
- Supabase for auth, database, storage, and realtime (not Firebase, not PlanetScale)
- Mux for video (not Cloudinary, not S3 direct, not Vimeo API)
- Stripe Connect Express for payments (not Stripe Standard, not PayPal)
- Konva.js (`react-konva`) for video annotations (not Fabric.js, not plain canvas)
- Intake mode is set at the coach profile level, not per offer
- Coach subscription tiers are out of scope for v1 — do not build plan limit enforcement

**Open questions to resolve during the build:**
- Platform fee percentage (define in `/lib/constants.ts` before Phase 7 — ask William what percentage before building checkout)
- Exact Stripe Connect fee split (decide before Phase 7: e.g. 10% platform fee)
- Whether to use `nuqs` or a simpler custom hook for URL filter state (confirm before Phase 4)
- Whether voiceover is recorded in the browser and uploaded, or streamed live (current plan: recorded then uploaded — confirm before Phase 10)
- Admin dashboard scope and timing (out of v1, but stub an `/admin` route with auth guard early so it's not forgotten)
