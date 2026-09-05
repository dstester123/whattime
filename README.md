# What time is it for them?

Two cities, two clocks, one honest sentence about whether you should call. Static, no server, no analytics. Every timezone comes from the browser's own `Intl` tables.

## Deploy

```bash
npx vercel --prod
```

That is the whole deploy. It is four files: `index.html`, `styles.css`, `app.js`, `vercel.json`.

## What it does

- Split screen, one half per person (two by default, up to four). Sky colour follows real local daylight: sunrise and sunset are computed for the city's coordinates with the NOAA solar equations, so Reykjavík in December looks like Reykjavík in December.
- A sun or moon crosses each half on an arc that matches the actual hour. The moon shows its real phase.
- Drag the divider between the clocks to scrub time. Swipe the overlap strip on a phone. Arrow keys scrub too (shift for bigger steps). Release and it snaps back to now. The "What about later?" slider holds a time.
- "Find a good time" picks the best shared waking half-hour in the next 48 hours and gives you a line to paste and an `.ics` to download.
- Shareable URL: `?you=london&them=tokyo`, or `?you=Europe/London&them=Asia/Tokyo`. Add `&and=lisbon,sydney` for more people.
- "Share picture" draws a 1200x630 image in a canvas and hands it to the native share sheet, the clipboard, or a download.
- Forgiving search: "nyc", "la", "cali", "london uk", "tokyo japan", "joburg", "kl", "sf" all resolve. Falls back to every IANA zone the browser knows.
- Page title updates live. The favicon is a tiny clock showing the friend's hour.

## Sources

- Sunrise and sunset: the NOAA sunrise equation as described at https://en.wikipedia.org/wiki/Sunrise_equation and https://gml.noaa.gov/grad/solcalc/calcdetails.html
- Moon phase: synodic month of 29.530588853 days counted from the new moon of 6 January 2000 18:14 UTC.
- City coordinates: rounded to two decimals; good enough for daylight, not for navigation.
- Timezones: `Intl.supportedValuesOf("timeZone")` and `Intl.DateTimeFormat`.

## Keyboard

- Tab between fields, Enter to confirm, Esc to close the dropdown.
- Cmd/Ctrl+K focuses the search.
- Left/Right scrub 30 minutes, Shift for 3 hours, 0 or Esc returns to now.
