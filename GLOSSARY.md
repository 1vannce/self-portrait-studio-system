# Self Portrait Studio System

The operations app for OH MEDIA Studio, a self-portrait photography studio. It covers three subsystems: Booking & Reservation, Point of Sale (POS) & Billing, and Inventory & Supply Management. Source: `docs/ARCHITECTURE.md` and `src/db/schema.ts`.

## People

**Profile**:
A signed-in person's account record. Its role is admin, staff, or customer.
_Avoid_: user, account

**Customer**:
A profile with the customer role, who books sessions for themselves.
_Avoid_: client

**Guest**:
A person on a reservation who has no profile, stored by name, email, and phone.
_Avoid_: walk-in, anonymous customer

**Staff**:
The role that runs daily studio work: reservations, orders, payments, and stock.
_Avoid_: employee, cashier

**Admin**:
The role that manages the studio's setup and data on top of staff work.
_Avoid_: owner, superuser

## Booking & Reservation

**Service**:
A type of studio session the customer can reserve, with a duration, price, pax limits, and included prints and soft copies.
_Avoid_: package, session type, product

**Time slot**:
A date with a start and end time that a reservation can take.
_Avoid_: schedule, booking slot, appointment

**Reservation**:
One customer's or guest's claim on a service at a time slot. "Booking" is used only in the subsystem name.
_Avoid_: booking, appointment

**Pax**:
The number of people in a session. A service has a base pax and a max pax.
_Avoid_: headcount, party size

**Add-on**:
An extra on a reservation, such as an extra person, extra print, raw soft copies, or a USB.
_Avoid_: extra, upgrade, additional charge

**Backdrop**:
The background the customer picks for their session.
_Avoid_: theme, background (used alone)

**Soft copy**:
A digital photo file given to the customer.
_Avoid_: digital copy, file

**No-show**:
A reservation whose customer never arrived. It is a final status.
_Avoid_: cancelled (they are different statuses)

## POS & Billing

**Order**:
The bill for one customer, usually linked to a reservation. Its status is open, finalized, or voided.
_Avoid_: bill, invoice, transaction

**Order item**:
One line on an order, with a description, quantity, and price.
_Avoid_: line, product

**Payment**:
Money recorded against an order by method, such as cash, GCash, or card.
_Avoid_: transaction (used alone)

**Receipt**:
The numbered proof of payment issued for an order.
_Avoid_: invoice, OR

**Voided**:
An order that was cancelled after it was made. Voided orders are kept, not deleted.
_Avoid_: deleted, cancelled

## Inventory & Supply

**Inventory item**:
A product or supply the studio keeps in stock, such as frames or prints.
_Avoid_: product, stock (used alone)

**Supplier**:
An outside business that sells inventory items to the studio.
_Avoid_: vendor

**Stock movement**:
One recorded change to an item's quantity, with its type, before and after amounts, reason, and actor. It is never edited or deleted.
_Avoid_: stock log, inventory transaction

**Reorder level**:
The quantity at or below which an item should be restocked.
_Avoid_: reorder point, minimum stock
