# Surface brief — flow (whole app)

## Scope and mode

Every screen in the app: the day page (tasks), habits list and habit detail, money
(records, weekly report, monthly report), settings, and the sheets that create and
edit entries. Visitor mode: **Operate**. One person, on a phone, several times a
day, offline; they are completing a small task, not being persuaded.

## Audience, job, action, constraints

The maintainer themself. Job: capture a task in seconds, tick today's habits, log a
purchase and check the month's balance. Constraints: touch targets ≥44px, two
languages (en/zh) at the same density, light and dark from the same tokens, no
network, all state in localStorage, existing behaviour and data formats unchanged.

## Direction contract

**THESIS** — flow is a dated register: the day is the page header and every entry is
a ruled line in it. Refused: stacked cards, hero metrics, icon pills, colour used as
decoration.

**OWN-WORLD** — cool ledger paper (#eceee7 ground, #f6f7f2 page), blue-black ink
(#15191a), hairline rules (#d1d6ca) and a 2px ink masthead rule; square 1–2px
corners, no card shadows; Archivo for interface text, Bitter for dates, counts and
amounts; one marking-pen red (#a8382a) reserved for today, overdue, current
position and destructive actions.

**STORY** — the visitor opens the app, sees today's date set large, and reads what is
due as lines to tick; habits are a seven-day punch strip; money is a ledger with
income and spending columns and a run of dated entries. They believe the record is
theirs, local, and quiet.

**FIRST VIEWPORT** — weekday label; 52px Bitter day number with month-year beside it;
counts line; 2px ink rule carrying a 40px red segment; then the tag index strip and
the ruled task sections, with a square ink stamp for adding.

**FORM** — "the register", second of seven ordered candidates (daybook, register,
index card, timetable, almanac, passbook, field notebook). `seed: none (unavailable)`
— the engine was offline this session, so the direction was authored from the brief
and the product's own world rather than a scripted roll.

**FINISH** — unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance
