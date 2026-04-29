// Platform fee percentage taken from each athlete-to-coach transaction
export const PLATFORM_FEE_PERCENT = 15;

// Derived: fee as a decimal for Stripe application_fee_amount calculations
export const PLATFORM_FEE_DECIMAL = PLATFORM_FEE_PERCENT / 100;

// Throws events supported by ShotSpot
export const THROW_EVENTS = ["shot_put", "discus", "hammer", "javelin"] as const;
export type ThrowEvent = (typeof THROW_EVENTS)[number];

// Implement weights by event (in kg)
export const SHOT_PUT_WEIGHTS = [4, 5, 6, 7.26] as const;
export const DISCUS_WEIGHTS = [1, 1.5, 1.75, 2] as const;
export const HAMMER_WEIGHTS = [3, 4, 5, 7.26] as const;
export const JAVELIN_WEIGHTS = [400, 500, 600, 800] as const; // grams

// Competitive levels
export const COMPETITIVE_LEVELS = [
  "youth",
  "high_school",
  "collegiate",
  "post_collegiate",
  "professional",
  "masters",
] as const;
export type CompetitiveLevel = (typeof COMPETITIVE_LEVELS)[number];

// Coaching offer billing cadences
export const BILLING_CADENCES = ["monthly", "weekly", "one_time"] as const;
export type BillingCadence = (typeof BILLING_CADENCES)[number];

// Intake modes
export const INTAKE_MODES = ["instant_join", "application_required"] as const;
export type IntakeMode = (typeof INTAKE_MODES)[number];

// Messaging access levels
export const MESSAGING_ACCESS = ["none", "limited", "unlimited"] as const;
export type MessagingAccess = (typeof MESSAGING_ACCESS)[number];

// Call access levels
export const CALL_ACCESS = ["none", "monthly", "biweekly", "weekly"] as const;
export type CallAccess = (typeof CALL_ACCESS)[number];
