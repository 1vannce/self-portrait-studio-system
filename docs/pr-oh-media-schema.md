# Pull Request: OH MEDIA Studio Database Schema & Seed Data

## Summary

Introduces the database schema definitions, Drizzle migrations, and seed configurations for **OH MEDIA Studio**. This establishes the data models for studio packages (Solo/Duo, Squad, Custom), add-ons (extra pax, kids, pets, prints, soft copies, USB), payment methods (including GoTyme), and guest bookings for customers coming from Facebook Messenger.

## Changes

- **Database Schema (`src/db/schema.ts`)**:
  - Added `addonType` enum (`extra_person`, `extra_kid`, `extra_pet`, `extra_print`, `raw_soft_copies`, `advance_edit`, `usb`, `other`).
  - Added `'gotyme'` to `paymentMethod` enum.
  - Added `reservation_addons` table to store chosen add-ons per booking.
  - Updated `services` with package inclusion columns (`base_pax`, `max_pax`, `included_prints`, `included_soft_copies`).
  - Updated `reservations` to support guest checkout (`profile_id` is now optional) and added policy tracking fields (`guest_email`, `total_pax`, `kids_count`, `pets_count`, `backdrop_choice`).
  - Added `insertReservationAddonSchema` and `selectReservationAddonSchema` via `drizzle-zod`.
- **Drizzle Migration (`drizzle/0001_vengeful_tomas.sql`)**:
  - Generated and reviewed SQL migration adding the new types, tables, and foreign keys.
- **OH MEDIA Business Logic & Pricing Engine (`src/db/oh-media-data.ts`)**:
  - Added exact constants for Solo/Duo (₱500 / 15m), Squad (₱1,000 / 30m), and Custom packages.
  - Added `calculateBookingEstimate()` helper enforcing studio rules (first 2 pets free, kids ≤ 5 free, 6–12 ₱100).
- **Seed Script (`src/db/seed.ts` & `package.json`)**:
  - Added seed script for packages and inventory items (USBs, 4R photo papers).
  - Added `npm run db:seed` script to `package.json`.
- **Config & Tests**:
  - Updated `drizzle.config.ts` to load `.env.local` for local migration generation.
  - Updated `src/__tests__/db/schema.test.ts` to validate the new enums and schemas.

## Type of Change

- [x] Feature
- [ ] Bug Fix
- [ ] Refactoring
- [ ] Documentation
- [x] Database
- [ ] Other:

## Testing

- **Vitest Suite (`npm run test:run`)**: All 28 tests passing (`contracts.test.ts` and `schema.test.ts`).
- **ESLint (`npm run lint`)**: Passed with 0 errors.
- **Production Build (`npm run build`)**: Compiled successfully with Next.js Turbopack.
- **Drizzle Generation (`npm run db:generate`)**: Successfully generated migration `0001_vengeful_tomas.sql`.

## Screenshots / References

Directory of changed and created files:
- `src/db/schema.ts` — Schema and Zod definitions
- `src/db/oh-media-data.ts` — Studio pricing rules and config
- `src/db/seed.ts` — Database seed runner
- `drizzle/0001_vengeful_tomas.sql` — Generated migration
- `drizzle.config.ts` — Drizzle kit config
- `package.json` — Added `db:seed` script
- `src/__tests__/db/schema.test.ts` — Unit test assertions

## Checklist

- [x] Changes have been reviewed.
- [x] Tested where applicable.
- [x] Documentation updated if necessary.
- [x] No unrelated changes included.

## Additional Notes

- `profile_id` on `reservations` is now nullable to allow guest checkout when users click "Book Now" from Facebook Messenger without requiring an immediate account registration.
- All monetary values use integer minor units (cents, e.g. `50000` for ₱500) to adhere to the project's financial precision rules.
