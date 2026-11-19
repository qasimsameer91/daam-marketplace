# Daam visual transformation

## Audit — 11 November 2026

Inspected the existing English desktop and English/Urdu mobile homepages and the mobile browse page in Chromium. No page errors or document-level horizontal overflow were observed in these baseline checks.

- The hero uses a flat 600×750 SVG inside a tilted rectangle; it has no actual three-dimensional geometry. The same generic illustration is reused for all sample listings and does not represent the model names. The preview notice correctly calls the images illustrative.
- Brand shortcuts use single-letter circles and a tall two-column grid on mobile, so discovery feels repetitive and takes a lot of scrolling. Brand links already point to real filtered routes.
- Product cards contain useful PTA, condition, price and location details, but the identical placeholder and dense badges make them visually repetitive. Actual seller photography is not available in this preview.
- Navigation, sell wizard, listing gallery and favourites have existing functional behavior that must be preserved. Motion is deliberately light and CSS-led for mobile performance.
- `promotions` in the current database refers to listing promotions; there is no persistent, scheduled admin banner CMS or completed production authentication/admin workflow. Do not present a mock control as a working CMS.
- The app currently uses mock listing data; real Supabase catalog data is used only when configured. The interrupted Phase 4 migration and all uncommitted backend work must remain intact.

## Design and implementation order

1. Establish an editorial ink/paper/lime visual language using the existing tokens, bilingual typography and accessible contrast.
2. Rebuild navigation and homepage hero with a code-built, pointer-responsive CSS 3D phone, approved by the user. Use static reduced-motion/touch behavior and no new dependency. Inspect desktop and mobile after the change.
3. Improve brand discovery and listing-card hierarchy while preserving their routes, filtering, badges and actions. Use honest sample imagery until real product photos are available. Inspect English and Urdu mobile/desktop.
4. Design and implement persistent admin banners only with real authorization, storage, scheduling, validation and public reads; verify them on actual Supabase before calling them complete. The real local stack has not yet been verified.
5. Extend the visual language to remaining routes, then run responsive, keyboard, reduced-motion, performance, unit and browser checks.

Before visual edits, a snapshot of project source and current uncommitted work was saved to the local temporary directory as `daam-visual-checkpoint-20261111-041539.zip`. The backup is separate from Git and should be kept until the work is reviewed.
