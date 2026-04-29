# ShotSpot Build Plan

## Goal

Build ShotSpot systematically from the marketplace outward.

The current FloorRoom codebase can be used as reference, but ShotSpot should have its own product structure, brand system, routes, and data model.

## Phase 1: Product Foundation

Create source-of-truth docs:

- Product spec
- Information architecture
- Design system
- Data model
- Build milestones

Define:

- Public routes
- Athlete routes
- Coach routes
- Admin routes
- Core entities
- Payment states
- Relationship states
- Offer entitlements

Output:

- Product docs are written.
- Build order is agreed on.
- Old FloorRoom code is either archived or treated as reference only.

## Phase 2: Brand and UI Foundation

Build the ShotSpot UI system before building many pages.

Foundation components:

- App shell
- Public header
- Buttons
- Inputs
- Selects
- Filter pills
- Cards
- Tables
- Modals
- Toast notifications
- Success states
- Error states
- Empty states
- Loading states
- Page transitions or micro-animations

Brand rules:

- Logo: ShotSpot mark
- Main font: Anton
- Main background: `#D7D7D7`
- Primary text and borders: black
- Accent: `#007B6F`
- Hard black lines and strong structure
- Minimal decoration
- Marketplace should feel public and browseable, not like a dashboard
- Delivery platform can feel more dashboard-like after login

Output:

- One polished marketplace layout page that acts as the visual baseline.
- Shared UI primitives that future pages reuse.

## Phase 3: Public Marketplace

Build public browsing first.

Routes:

- `/`
- `/coaches/[id]`
- `/coach-signup`
- `/athlete-signup`
- `/sign-in`

Features:

- Coach cards
- Event filters
- Experience filters
- Proof filters
- Price filters
- Intake mode filters
- Coach detail pages
- Package cards
- Account-gated apply/join CTAs

Output:

- Athletes can browse coaches without an account.
- Athletes can open coach pages.
- Athletes can see offers and understand what is included.

## Phase 4: Data Model

Define the real data model before connecting advanced flows.

Core tables/entities:

- User
- AthleteProfile
- CoachProfile
- CoachOrganization
- CoachOffer
- CoachPlanSubscription
- AthleteCoachRelationship
- Application
- Payment
- Payout
- TrainingPlan
- TrainingSession
- TrainingExercise
- AthleteSessionLog
- VideoSubmission
- VideoFeedback
- MessageThread
- Message
- Entitlement

Important concepts:

- Coach offer determines athlete access.
- Athlete-coach relationship stores the active purchased offer.
- Coach subscription plan determines what the coach can offer or how much capacity they have.
- Session logs are generated from assigned plan structure.

Output:

- Data model is written.
- Mock data follows the future schema.
- Supabase or database integration can be built cleanly.

## Phase 5: Athlete Signup and Profile

Athlete accounts are free.

Build:

- Signup
- Basic profile
- Event information
- PRs
- Max lifts
- Videos
- Goals
- What they want in a coach
- Public profile settings
- Application profile preview

Output:

- Athlete can create a useful application profile.
- Coach can review the profile in applications.

## Phase 6: Coach Signup and Profile Builder

Build:

- Coach signup
- Organization or brand setup
- Coach public profile builder
- Experience and proof fields
- Capacity settings
- Events coached
- Marketplace preview
- Publish state

Output:

- Coach can create and publish a marketplace profile.

## Phase 7: Coach Offers

Build:

- Offer builder
- Pricing
- Billing cadence
- Included services
- Messaging access
- Video review limits
- Training plan limits
- Calls
- Athlete cap
- Intake mode:
  - Instant join
  - Application required
- Intake questions

Output:

- Coach can create public packages.
- Athlete can select a package from coach profile.

## Phase 8: Application and Join Flow

Build:

- Apply flow
- Instant join flow
- Application review queue
- Accept/decline
- Payment pending state
- Active relationship state

Output:

- Athlete can apply or join.
- Coach can accept applications.
- Active coach-athlete relationships exist.

## Phase 9: Payments

Build or scaffold:

- Checkout
- Coach payouts
- Platform fee
- Subscription status
- Failed payment states
- Cancellation
- Refund state

Output:

- Athletes pay coaches through ShotSpot.
- ShotSpot can take a fee.
- Active access depends on payment status.

## Phase 10: Coach Subscription Plans

Build:

- Coach free/pro/elite plans
- Capacity limits
- Video review limits
- Training plan limits
- Platform fee differences
- Upgrade flow

Output:

- Coach plan controls what a coach can offer or deliver.

## Phase 11: Delivery Platform V1

Build the simplest useful coach and athlete workspaces.

Coach:

- Overview dashboard
- Applications
- Athlete roster
- Athlete detail
- Basic plan assignment
- Basic video queue
- Basic messages
- Billing summary

Athlete:

- Current coach
- Active offer
- Today's plan
- Session logging
- Video upload
- Messages
- Progress snapshot
- Billing status

Output:

- Paid relationships have somewhere to live.
- Coaches can deliver basic coaching.
- Athletes can receive and log basic work.

## Phase 12: Dynamic Training Logs

Build plan-driven logging.

Requirements:

- Coach creates structured training sessions.
- Each session defines required log fields.
- Athlete logging UI is generated from the assigned session.
- Throwing sessions can include multiple implements.
- Lifting sessions can include sets, reps, weights, RPE, notes.
- Coach can review logs.

Output:

- Athlete logs match the exact plan assigned by the coach.

## Phase 13: Video Review V1

Build:

- Upload
- Review queue
- Written feedback
- Timestamp notes
- Basic annotations later
- Send feedback to athlete

Later:

- Lines
- Circles
- Arrows
- Voiceover
- Recorded coach review

Output:

- Video review becomes a real delivery tool.

## Phase 14: Analytics and Recruiting Profile

Build:

- Athlete consistency metrics
- PR progress
- Lift progress
- Plan completion
- Video review history
- Coach-facing athlete analysis
- Public athlete stats if athlete opts in

Output:

- Athlete profile becomes useful for coach applications and recruiting.
- Coach gets deeper athlete insight.

## Recommended Next Step

Before building more pages, create:

1. `docs/shotspot-ia.md`
2. `docs/shotspot-design-system.md`
3. `docs/shotspot-data-model.md`

Then decide whether to:

- Clean this repo around ShotSpot, or
- Start a fresh Next app and move only the useful pieces over.
