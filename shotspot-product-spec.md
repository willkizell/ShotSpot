# ShotSpot Product Spec

## Product Idea

ShotSpot is a marketplace and coaching platform for throwers and throws coaches.

The product has two connected sides:

1. A public marketplace where athletes can discover qualified coaches, compare coaching offers, and apply or join.
2. A coaching delivery platform where paid coach-athlete relationships turn into training plans, video review, messaging, progress tracking, and session logging.

The marketplace is the front door. The delivery platform is the product athletes and coaches use after a relationship starts.

ShotSpot should feel credible, direct, and performance-focused. The goal is not to make a generic fitness marketplace. The goal is to build a throws-specific system where the athlete profile, coach profile, offers, training plans, logging, and video review all understand shot put, discus, hammer, and javelin.

## Core Users

### Athlete

Athletes use ShotSpot to:

- Find qualified throws coaches.
- Build a free athlete profile.
- Show PRs, lifts, goals, videos, training history, and what they want in a coach.
- Apply to work with coaches or instantly join an offer.
- Pay for coaching.
- Receive training plans, video feedback, messages, and progress tracking.
- Log throwing and lifting sessions based on the exact plan assigned by their coach.

Athlete accounts should be free. An athlete should be able to sign up, build a strong profile, browse coaches, and apply without paying ShotSpot directly. Payment begins when they purchase coaching from a coach.

### Coach

Coaches use ShotSpot to:

- Create a public coach profile.
- Set their organization or coaching brand.
- Define their experience, credentials, specialties, and coaching philosophy.
- Set athlete capacity.
- Create coaching offers and packages.
- Decide whether athletes can instantly join or must apply first.
- Review athlete applications.
- Get paid cleanly through the platform.
- Deliver coaching through video review, plans, messaging, and athlete management.
- Upgrade their ShotSpot plan if they want to offer more services, support more athletes, or access more delivery capacity.

### Platform Owner

ShotSpot needs infrastructure to:

- Take a platform fee from athlete payments to coaches.
- Offer paid coach platform plans.
- Monitor marketplace quality.
- Review coaches, packages, disputes, payouts, and platform health.

## Public Marketplace

The marketplace should be browseable by anyone, signed in or not.

Visitors should be able to:

- View coach cards at a glance.
- Filter by event:
  - Shot put
  - Discus
  - Hammer
  - Javelin
- Filter by coaching experience:
  - Any
  - 5+ years
  - 10+ years
- Filter by proof:
  - Has coached elite athletes
  - Has coached collegiate athletes
  - Has coached state champions
  - Has coached beginners or youth athletes
- Filter by offer type:
  - Full coaching
  - Programming only
  - Video review only
  - One-time critique
  - In-person option
  - Remote option
- Filter by intake mode:
  - Instant join
  - Application required
- Filter by price range.
- Filter by availability:
  - Open now
  - Waitlist
  - Limited capacity

Coach cards should communicate enough for an athlete to decide whether to click:

- Coach name
- Photo
- Location or remote status
- Events coached
- Years of coaching experience
- Current role or organization
- Short headline
- Starting price
- Intake mode
- Active athlete count or capacity
- Response time
- Proof or credibility line
- Whether they have coached elite athletes

Clicking a coach opens the public coach detail page.

## Coach Detail Page

The coach detail page is the conversion page. It should help an athlete decide whether this coach is worth applying to or paying.

It should include:

- Coach profile hero
- Coach photo
- Name
- Location
- Organization or coaching brand
- Events coached
- Years of coaching experience
- Coaching philosophy
- Bio
- Credentials
- Achievements
- Athlete results
- Types of athletes they work with
- Active athlete capacity
- Response expectations
- Video turnaround expectations
- Policies
- Public reviews or testimonials later
- Offer/package selection

Offer cards should include:

- Offer name
- Description
- Price
- Billing cadence:
  - Monthly
  - Weekly
  - One-time
- What is included:
  - Training plans
  - Video reviews
  - Messaging
  - Calls
  - Technique analysis
  - Competition planning
- Athlete cap for that offer if needed
- Whether the athlete can instantly join or must apply

If the visitor is not signed in, the CTA should route them into athlete account creation before applying or paying.

## Athlete Account and Profile

Athlete signup should be free.

Athlete profile fields should include:

- Full name
- Email
- Age
- Location
- Primary event
- Secondary events
- Profile photo
- Optional background photo
- School, club, or training group
- Competitive level:
  - Youth
  - High school
  - Collegiate
  - Post-collegiate
  - Professional
  - Masters
- Training age
- Throws PRs:
  - Shot put
  - Discus
  - Hammer
  - Javelin
- Implement-specific PRs where relevant:
  - 4kg, 5kg, 6kg, 7.26kg shot
  - 1kg, 1.5kg, 1.75kg, 2kg discus
  - Hammer weights by level
  - Javelin weights by level
- Max lifts:
  - Back squat
  - Front squat
  - Bench press
  - Clean
  - Snatch
  - Deadlift
  - Other optional lifts
- Videos:
  - Training videos
  - Competition videos
  - Technical clips
- Goals:
  - Short term goals
  - Season goals
  - Long term goals
- Training setup:
  - Access to implements
  - Access to ring/runway
  - Access to gym
  - Current weekly training schedule
- Injury history, optional and sensitive
- What they are looking for in a coach, optional:
  - Technical feedback
  - Programming
  - Accountability
  - Recruiting help
  - Elite performance
  - Beginner development
  - Remote coaching
  - In-person coaching
- Budget range, optional
- Public profile settings:
  - Show PRs
  - Show lifts
  - Show videos
  - Show training consistency
  - Show progress history

The athlete profile should make applications better. A coach should be able to see enough context to decide whether the athlete is a fit.

The athlete profile can also become useful for recruiting. If an athlete chooses to make stats public, their profile can show evidence that they train consistently, complete assigned plans, upload videos, and improve over time.

## Coach Signup and Profile Builder

Coach signup should guide coaches through building their public marketplace presence.

Coach profile fields should include:

- Full name
- Email
- Organization or coaching brand
- Location
- Remote or in-person availability
- Profile photo
- Optional brand/logo
- Events coached:
  - Shot put
  - Discus
  - Hammer
  - Javelin
- Years coaching
- Years competing
- Current coaching role
- Past coaching roles
- Certifications
- Education
- Athlete levels coached:
  - Youth
  - High school
  - Collegiate
  - Post-collegiate
  - Professional
- Proof and credibility:
  - State champions coached
  - Collegiate athletes coached
  - Elite athletes coached
  - National qualifiers coached
  - PR improvements
  - Testimonials later
- Coaching philosophy
- Bio
- Who they are a good fit for
- Who they are not a good fit for
- Response time
- Video turnaround time
- General policies
- Max active athletes they want to coach
- Whether they are open to new athletes

The coach should be able to preview their marketplace card and full public profile before publishing.

## Coach Offers and Services

Coaches should design the services they sell.

Offer examples:

- Full remote coaching
- Monthly programming
- Programming plus video review
- Video critique only
- One-off technical review
- Full coaching plus lifting plan
- Competition season plan
- Recruiting support
- In-person sessions

Each offer should include:

- Offer name
- Description
- Price
- Billing cadence
- Included services
- Number of training plans per week or month
- Number of video reviews per week or month
- Messaging access:
  - None
  - Limited
  - Unlimited
- Call access:
  - None
  - Monthly
  - Bi-weekly
  - Weekly
- Program updates
- Athlete cap for that offer
- Whether the offer is public
- Intake mode:
  - Instant join
  - Application required
- Optional intake questions

If a coach chooses application required, athletes apply first and payment begins only after acceptance.

If a coach chooses instant join, the athlete can create an account, select the offer, pay, and immediately enter the athlete workspace.

## Payments and Platform Revenue

ShotSpot needs two revenue streams:

1. Platform fee on athlete payments to coaches.
2. Coach subscription upgrades.

### Athlete to Coach Payments

Athletes pay coaches through ShotSpot.

Payment flow:

- Athlete selects an offer.
- Athlete signs in or creates a free athlete account.
- If instant join, athlete pays immediately.
- If application required, athlete applies first.
- Coach accepts the application.
- Athlete receives a payment link or checkout step.
- Payment activates the coach-athlete relationship.
- Coach receives payout after platform fees.
- ShotSpot takes a fee from the transaction.

Important payment states:

- Draft checkout
- Pending application
- Accepted application
- Payment pending
- Active subscription
- Failed payment
- Paused subscription
- Cancelled subscription
- Refunded payment

### Coach Subscription Plans

Coaches should be able to use ShotSpot free at first, but paid plans unlock more delivery capacity.

Example model:

#### Free Coach Plan

- Public profile
- Limited active athletes
- Limited video reviews per week
- Limited training plan assignments
- Basic applications
- Basic messaging
- Higher platform fee

#### Pro Coach Plan

- More active athletes
- More video reviews per week
- More training plans
- Offer builder
- Lower platform fee
- Better analytics
- Priority marketplace placement later

#### Elite Coach Plan

- Highest athlete capacity
- Advanced video tools
- Advanced athlete analytics
- Team or organization support
- Lower platform fee
- More branding controls
- More automation

The exact limits should be decided later, but the product should be built so plan limits can control what coaches are allowed to offer and deliver.

## Entitlements and Access

ShotSpot must know what an athlete paid for and unlock the correct tools.

Examples:

- If the athlete paid for programming only:
  - Athlete sees training plans.
  - Athlete can log sessions.
  - Athlete may not have video upload access.
  - Athlete may not have chat access.

- If the athlete paid for video critique only:
  - Athlete can upload a limited number of videos.
  - Coach can send feedback.
  - Athlete may not receive a full training plan.

- If the athlete paid for full coaching:
  - Athlete sees plans.
  - Athlete can upload videos.
  - Athlete can message coach.
  - Coach can review logs and progress.

The offer should define access. The relationship between athlete and coach should store the purchased offer, current status, usage limits, and renewal date.

## Coaching Delivery Platform

After an athlete joins or is accepted and pays, the delivery platform begins.

### Coach Dashboard

Coach dashboard should show:

- New applications
- Active athletes
- Athlete capacity
- Monthly revenue
- Pending payouts
- Failed payments
- Athletes needing attention
- Unread messages
- Pending video reviews
- Training plans due
- Recent athlete logs
- Progress alerts

Coach sections:

- Overview
- Athlete roster
- Applications
- Offers
- Marketplace profile
- Training plans
- Video review
- Messages
- Billing and payouts
- Settings

### Athlete Roster

Each athlete under a coach should have a detailed page:

- Athlete profile
- Current offer/package
- Payment status
- Training plan
- Recent logs
- Recent videos
- PR history
- Lift history
- Consistency data
- Coach notes
- Goals
- Injury notes if shared

The coach should be able to see a more detailed analysis of each athlete under their care.

### Video Review

Video review should support:

- Athlete uploads video.
- Video appears in coach review queue.
- Coach opens video.
- Coach records feedback or writes notes.
- Coach can annotate with lines, circles, arrows, and timing markers.
- Coach can record over the video or attach voice/video feedback later.
- Coach sends reviewed video back to athlete.
- Athlete sees the coach feedback in their workspace.

Video access should depend on the purchased offer and coach plan limits.

### Training Plans

Coaches should create training plans for athletes.

Training plans may include:

- Throwing sessions
- Lifting sessions
- Mobility
- Recovery
- Competition prep
- Rest days

Plans should be assignable to:

- One athlete
- Multiple athletes
- Templates

Each session should define what the athlete needs to log.

Example throwing plan:

- Shot put session
- 7.26kg shot, 10 throws
- 8kg shot, 6 throws
- Standing throws
- Full throws
- Notes

The athlete logging form should adapt to the assigned plan. If the coach assigns both 7.26kg and 8kg shot throws, the athlete should see distance inputs for both. If the coach assigns only one implement, only that input should appear.

Example lifting plan:

- Back squat
- 5 sets of 3
- Target weight or RPE
- Bench press
- Clean pull

The athlete logging form should show the exercises, sets, reps, weight inputs, RPE, notes, and completion status based on the coach's plan.

## Athlete Workspace

Before an athlete has a coach, their workspace should focus on:

- Completing profile
- Browsing coaches
- Applications
- Saved coaches
- Videos and PRs for applications

After an athlete has an active coach relationship, their workspace should show:

- Current coach
- Active plan
- Today's session
- Session logging
- Video upload
- Video feedback
- Messages
- Progress tracking
- Billing status

Athlete progress should include:

- PR history
- Lift history
- Training consistency
- Session completion
- Video review history
- Notes from coach
- Event-specific progress

If the athlete allows it, selected progress data can appear on their public athlete profile for recruiting or future coach applications.

## Application Flow

Application-required flow:

1. Athlete browses marketplace.
2. Athlete opens coach profile.
3. Athlete selects an offer.
4. Athlete creates a free account or signs in.
5. Athlete completes or updates profile.
6. Athlete answers coach intake questions.
7. Application is submitted.
8. Coach reviews profile and answers.
9. Coach accepts or declines.
10. If accepted, athlete pays.
11. Relationship becomes active.
12. Athlete enters workspace with access based on the offer.

Instant-join flow:

1. Athlete browses marketplace.
2. Athlete opens coach profile.
3. Athlete selects an offer.
4. Athlete creates a free account or signs in.
5. Athlete pays.
6. Relationship becomes active.
7. Athlete enters workspace with access based on the offer.

## Admin and Platform Management

ShotSpot should eventually have an admin area for:

- Coach review and verification
- Marketplace moderation
- Offer review
- Payment monitoring
- Refunds and disputes
- User support
- Platform fee settings
- Coach subscription plans
- Usage limits
- Reports

## MVP Scope

The first real version should focus on the marketplace and relationship creation.

MVP should include:

- Public marketplace
- Coach cards
- Filters
- Coach detail pages
- Athlete free signup
- Athlete profile builder
- Coach signup
- Coach profile builder
- Coach offer builder
- Application vs instant join setting
- Basic application flow
- Basic payment model placeholder or Stripe-ready structure
- Basic active relationship state

Delivery platform can start simple:

- Coach dashboard overview
- Athlete roster
- Basic training plan assignment
- Basic athlete session logging
- Basic video upload queue
- Basic messaging scaffold

Advanced video annotation, detailed analytics, and coach subscription limits can come after the foundation is stable.

## Product Principles

- Marketplace first, delivery second.
- Athlete accounts are free.
- Coach profiles and offers drive the marketplace.
- Paid coach-athlete relationships unlock delivery tools.
- Access is based on the purchased offer.
- Logging forms are generated from the assigned training plan.
- Athlete data can support better applications and recruiting, but privacy controls are required.
- The product should be throws-specific from the data model up.
- Build the system in phases. Do not let the old FloorRoom app dictate the new structure.
