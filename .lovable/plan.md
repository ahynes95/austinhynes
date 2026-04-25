## Animated Shader Hero — Single Static Page

A one-page, no-scroll site: full-viewport WebGL shader background with your headline, subtitle, and two CTAs centered on top. Nothing else on the page.

### What you'll get

- **Full-viewport (`100vh`), no-scroll homepage** at `/` — body overflow locked so the page is fixed to the screen
- **Animated WebGL shader background** (cosmic clouds/nebula, subtly reacts to mouse)
- **Headline:** "Technology in Business" / "simplified."
- **Subtitle:** "Managed services, Microsoft expertise, and web design in the Dallas, TX area."
- **Primary CTA "Work with me"** → opens a contact form dialog (Name, Email, Message → toast confirmation)
- **Secondary CTA "Let's build something together."** → opens the same contact form
- **No header, no footer, no other sections** — just the hero

### Implementation notes (technical)

1. Add `src/components/ui/animated-shader-hero.tsx` from the 21st.dev registry. Real prop shape: `{ headline: { line1, line2 }, subtitle, buttons?: { primary?, secondary? } }` — not the flat props from the snippet you pasted; we'll use the correct API.
2. Replace `src/routes/index.tsx` entirely (remove placeholder). Render `<Hero …>` with the content above; both buttons call `setContactOpen(true)`.
3. Lock scroll: add `overflow-hidden` to `html`/`body` while on `/` (via a small effect in the index route, cleaned up on unmount so future routes can scroll normally).
4. Contact dialog uses existing shadcn `Dialog`, `Input`, `Textarea`, `Button`, and `sonner` toast — no backend yet, just a success toast on submit.
5. Update `head()` metadata in `index.tsx`: title "Technology in Business, simplified. — Dallas IT & Web Design", matching description and og tags.
6. No new dependencies — shader is raw WebGL2, everything else already installed.

### Out of scope (can add later)

- Real form submission (email/database)
- Additional routes
