/**
 * OH MEDIA Studio Configuration & Seed Data
 * Brand: OH MEDIA
 * Tagline: "Timeless memories begin here."
 */

export const STUDIO_CONFIG = {
  name: "OH MEDIA",
  tagline: "Timeless memories begin here.",
  paymentPolicy:
    "Cash and e-wallets via GCash, Maya, GoTyme, and other supported platforms. Payment is collected after the session.",
  latePolicy:
    "Guests who are more than 10 minutes late may lose their reserved slot and will be accommodated based on the next available schedule.",
  noShowPolicy:
    "Rescheduling is allowed subject to availability. If the client fails to notify the studio at least 3 working days prior, full advance payment is required for their next booking.",
  maxFrameCapacity: 8,
  softCopyDeliveryHours: 24,
  photoOrientation: "Portrait orientation only",
  cameraControl: "Client uses a private remote clicker (No in-house photographer)",
} as const;

export type StudioPackage = {
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  basePax: number;
  maxPax: number;
  includedPrints: number;
  includedSoftCopies: number;
  backdropNote: string;
  selectionMinutes: number;
};

export const OH_MEDIA_PACKAGES: StudioPackage[] = [
  {
    name: "Solo/Duo",
    description: "For solo stars, sweet duos, and everything in between.",
    durationMinutes: 15,
    priceCents: 50000, // ₱500.00
    basePax: 2,
    maxPax: 2,
    includedPrints: 2, // 1 Full Layout & 1 Grid Layout
    includedSoftCopies: 5,
    backdropNote: "1 backdrop color",
    selectionMinutes: 10,
  },
  {
    name: "Squad",
    description: "Your favorite people, your best angles, one fun session.",
    durationMinutes: 30,
    priceCents: 100000, // ₱1,000.00
    basePax: 4,
    maxPax: 8,
    includedPrints: 4, // 2 Full Layout & 2 Grid Layout
    includedSoftCopies: 10,
    backdropNote: "Unlimited backdrop color",
    selectionMinutes: 20,
  },
  {
    name: "Custom Package",
    description: "Customize your session exactly the way you want it.",
    durationMinutes: 60,
    priceCents: 150000, // ₱1,500.00 base
    basePax: 6,
    maxPax: 15,
    includedPrints: 6,
    includedSoftCopies: 15,
    backdropNote: "Unlimited backdrop color",
    selectionMinutes: 30,
  },
];

export type AddonDefinition = {
  type:
    | "extra_person"
    | "extra_kid"
    | "extra_pet"
    | "extra_print"
    | "raw_soft_copies"
    | "advance_edit"
    | "usb";
  label: string;
  description: string;
  unitPriceCents: number;
  freeCount?: number;
  unitLabel?: string;
};

export const OH_MEDIA_ADDONS: Record<string, AddonDefinition> = {
  extra_person: {
    type: "extra_person",
    label: "Extra Person",
    description: "Includes +1 Photo print",
    unitPriceCents: 15000, // ₱150
    unitLabel: "person",
  },
  extra_kid: {
    type: "extra_kid",
    label: "Extra Kid (Ages 6–12)",
    description: "Ages 6 to 12 years old (5 years old & below are FREE)",
    unitPriceCents: 10000, // ₱100
    unitLabel: "kid",
  },
  extra_pet: {
    type: "extra_pet",
    label: "Extra Pet",
    description: "First 2 pets are FREE (must be potty-trained / wear diapers)",
    unitPriceCents: 10000, // ₱100
    freeCount: 2,
    unitLabel: "pet",
  },
  extra_print: {
    type: "extra_print",
    label: "Extra Photo Print",
    description: "Includes +1 Photo print",
    unitPriceCents: 4000, // ₱40
    unitLabel: "print",
  },
  raw_soft_copies: {
    type: "raw_soft_copies",
    label: "All Session Soft Copies",
    description: "All raw / unedited soft copies from your session",
    unitPriceCents: 25000, // ₱250
    unitLabel: "session",
  },
  advance_edit: {
    type: "advance_edit",
    label: "Advance Photo Edit",
    description: "3 days delivery via email",
    unitPriceCents: 10000, // ₱100 per photo
    unitLabel: "photo",
  },
  usb: {
    type: "usb",
    label: "Flash Drive (USB)",
    description: "Physical storage delivery for all your photos",
    unitPriceCents: 25000, // ₱250
    unitLabel: "unit",
  },
};

/**
 * Calculates total booking estimate based on OH MEDIA pricing logic
 */
export function calculateBookingEstimate(params: {
  packagePriceCents: number;
  extraPaxCount: number;
  kidsCount: number; // 6-12 yrs old
  petsCount: number; // total pets
  extraPrintsCount: number;
  allRawSoftCopies: boolean;
  advanceEditsCount: number;
  usbCount: number;
}): {
  subtotalCents: number;
  breakdown: Array<{ label: string; amountCents: number }>;
} {
  const breakdown: Array<{ label: string; amountCents: number }> = [
    { label: "Studio Package", amountCents: params.packagePriceCents },
  ];

  let subtotal = params.packagePriceCents;

  if (params.extraPaxCount > 0) {
    const cost = params.extraPaxCount * OH_MEDIA_ADDONS.extra_person.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: `Extra Person (${params.extraPaxCount}x)`,
      amountCents: cost,
    });
  }

  if (params.kidsCount > 0) {
    const cost = params.kidsCount * OH_MEDIA_ADDONS.extra_kid.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: `Extra Kid (${params.kidsCount}x)`,
      amountCents: cost,
    });
  }

  // First 2 pets are free
  const billablePets = Math.max(0, params.petsCount - 2);
  if (billablePets > 0) {
    const cost = billablePets * OH_MEDIA_ADDONS.extra_pet.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: `Extra Pets (${billablePets} billable)`,
      amountCents: cost,
    });
  }

  if (params.extraPrintsCount > 0) {
    const cost = params.extraPrintsCount * OH_MEDIA_ADDONS.extra_print.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: `Extra Photo Prints (${params.extraPrintsCount}x)`,
      amountCents: cost,
    });
  }

  if (params.allRawSoftCopies) {
    const cost = OH_MEDIA_ADDONS.raw_soft_copies.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: "All Session Soft Copies",
      amountCents: cost,
    });
  }

  if (params.advanceEditsCount > 0) {
    const cost = params.advanceEditsCount * OH_MEDIA_ADDONS.advance_edit.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: `Advance Photo Edit (${params.advanceEditsCount}x)`,
      amountCents: cost,
    });
  }

  if (params.usbCount > 0) {
    const cost = params.usbCount * OH_MEDIA_ADDONS.usb.unitPriceCents;
    subtotal += cost;
    breakdown.push({
      label: `Flash Drive (USB) (${params.usbCount}x)`,
      amountCents: cost,
    });
  }

  return { subtotalCents: subtotal, breakdown };
}
