## Change

In `src/components/ui/animated-shader-hero.tsx`, update the second headline span (currently a white→white/60 gradient) so "simplified." renders in a vibrant accent color that contrasts the dark blue/purple shader.

**Color choice**: warm amber-to-orange gradient (`from-amber-300 via-orange-400 to-amber-500`) with a subtle glow via `drop-shadow`. This complements the cool tones of the shader background and reads as a clear focal point.

### Edit

Replace the `line2` span classes:

```tsx
<span className="block animate-fade-in-up animation-delay-400 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(251,146,60,0.3)]">
  {headline.line2}
</span>
```

No other files change.

---

Tip: small visual tweaks like color/text changes can be done instantly (and free) via **Visual Edits** — click the Edit button in the chat box, select the element, and change the color directly.