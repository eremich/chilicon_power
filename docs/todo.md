# Task Plan

Style: brief tokens (chilicon-prototype-brief.md §4) + Apple HIG structure. `impeccable` only for the anti-slop review pass.
Palette from the logo (public/brand): sun #FBAB16 = brand/solar, leaf #00AA79 = ok. Battery moved to blue to stay clear of ok green.
Font: SF Pro Text (<20 pt) / SF Pro Display (≥20 pt), referenced not bundled (Apple license), Apple tracking (user request 2026-09-28).
Tab bar: floating iOS 26 glass (user request 2026-09-28, overrides brief's "no Liquid Glass"); glass only there.

Direction from references (2026-09-28):
- Tesla app: hero = illustrated house with thin leader lines, big kW value + small caps label per node; header "System ▾" + colored status line; calm icon rows below.
- Solar-Log: production bar split into "used at home" / "exported"; legend carries period totals.
- Power vs energy: power (kW) as a smooth area curve, energy (kWh) as bars.
- Dribbble concept: in-progress period bar hatched; selected bar gets a value pill; welcome with a large roof illustration.
- Not taken: pills everywhere, axis-less charts, floating glass tab bar.

## Current Task — Chilicon Power Mobile 2026, clickable prototype

Source: `chilicon-prototype-brief.md`, `chilicon-case-foundation.md` (Downloads). Stack as in brief: Vite + React + TS, Tailwind on tokens, React Router, Zustand, Lucide, Storybook, Playwright. Scaffolding (Storybook structure, shots script, theme switch) reused from `D:\patronim-prototype`.

### Phase 1 — Foundations + Storybook
- [x] Project scaffold, git init (remote: eremich/chilicon_power)
- [x] Tokens file (colors light/dark, type scale, spacing, radii) → Tailwind + CSS vars
- [x] Storybook: Introduction, Foundations (colors, type, units rules), light/dark toggle
- [x] Base components + stories (+ ScreenHeader): Button, ListRow, Segmented, Sheet, TabBar, StatusCard, HeroStat
- [x] ✋ Checkpoint: show Foundations + base components

### Phase 2 — Data viz
- [x] Mock data: daily curve, month/year, roof (installer sites come with Phase 5)
- [x] EnergyFlow: isometric house, Tesla-style callouts (battery on/off, import/export, night, offline)
- [x] BarChart, PowerCurve, RoofMap + PanelPairTile, CauseCard, SiteRow, DeviceRow
- [x] Static Storybook build passes
- [ ] ✋ Checkpoint

### Flow coverage — gaps vs brief (from Miro board + old app screens), to build in their phases
- [x] Issue: no installer linked → "Find a certified installer nearby"; installer confirms visit; loop if output still low
- [x] Energy: "Share monthly report" from the chart
- [x] Onboarding: camera denied → manual entry; existing system → accept installer invite
- [x] Energy flow: grid export shows credit earned, import shows cost (Home numbers)
- [x] Profile: My systems add, link, remove
- [x] Old app: several gateways per system ("Add another gateway" after first scan)
- [ ] Old app: daily calendar heatmap (days × months) → optional detail in Energy › Year
- Deviation: Home "today" chart is a power curve (kW), not bars — power is a rate; bars stay for kWh totals

### Phase 3 — Homeowner
- [x] Phone frame + outside controls (role, theme, scenario, battery layer, test notification)
- [x] Home, Energy (+ bar sheet), Panels (+ detail), Profile (+ rate sheet, installer access)
- [x] Storybook: every component has a story; Screens/Homeowner renders real screens by scenario
- [x] Issue flow: cause card → Contact installer (report sheet) → Remind me; push banner from desk panel
- [ ] Design review + a11y pass

### Phase 4 — Onboarding (11 steps, simulated QR + errors)
- [x] Components + stories: Logo, StepScreen, ChoiceCard, PasswordRules, QrScanner, GatewaySticker, ConnectionStatus
- [x] Welcome, Log in, Reset password (+ sent state), Sign up (inline rules), Who are you (+ company), Verify email
- [x] Add system, Accept invite, Scan (error, camera denied, add another gateway), Manual code (sticker help), Address (autocomplete + current location), Details (size, battery), Connecting (searching → online / offline + checks), Waiting → Home, first data arrives with a notification
- [x] Storybook: Screens/Onboarding (15 stories); scripts/e2e-onboarding.mjs passes

### Phase 5 — Installer (+ cross-role wiring)
- [x] Components + stories: Chip, SearchField, FleetSummary, AlertRow, ActionProgress, SlotPicker, Stepper, EmptyState, TextArea
- [x] Sites (summary as filters, search, sorted by status, empty state), Alerts (needs attention / resolved, badge)
- [x] Site detail: Overview (owner's Home compact + owner contact + system) / Technical (firmware update, devices); locked when owner shares owner view only
- [x] Device: chart vs roof average, restart (confirm → progress → back online), visit, resolve with note; offline gateway blocks remote actions
- [x] Add site: customer → scan → map roof (rows × pairs, live preview) → invite sent
- [x] Installer profile
- [x] Cross-role: owner report → installer push + alert; visit → owner push; resolve → owner push + history
- [x] Storybook Screens/Installer (11); scripts/e2e-scenario.mjs (brief §5.4) passes 12/12

### Phase 6 — Wiring + states
- [x] Cross-role store: end-to-end scenario §5.4 by clicking (done in Phase 5)
- [x] URL scenarios (`?role&scenario&theme`), all states from §6, 600 ms skeletons (now also Alerts, site detail)
- [x] Owner without installer → "Find an installer nearby" (panel detail, Profile; desk toggle)
- [x] Profile: system sheet with remove (confirm), Add a system → setup, unlink installer
- [x] scripts/e2e-states.mjs: 10 scenarios × 11 screens + deep links, 102 checks, 0 problems
- [x] Dark theme darker: near-black neutral canvas #050506 / surface #111113 (user request 2026-09-28); all text ≥ 5.6:1
- [ ] Colors: user is not fully happy with the palette — waiting for specifics
- Skipped (user agreed): daily calendar heatmap

### Phase 7 — Ship
- [x] `npm run shots` → 20 PNGs in shots/ (brief §11) + dark set in shots/dark/, no manual steps
- [x] Storybook synced: Screens/Homeowner (+ cloudy, no battery, no tariff, first data, resolved, night energy, no installer), Patterns/FindInstallerSheet
- [x] Accessibility: `npm run a11y` (axe, WCAG 2.1 AA) on 14 screens × 2 themes — 0 violations
- [x] `npm run build` (app + Storybook at /storybook) passes; production smoke test OK
- [ ] Deploy (Vercel) — waiting for the user's go-ahead
- [ ] Commit + push to eremich/chilicon_power — waiting for the user's go-ahead
- [ ] Palette: user to say what to change; then re-run `npm run shots`

## Review

**Built:** clickable iOS prototype, two roles (homeowner, installer), 11-step onboarding, 10 scenarios, light/dark, 45 DS components with stories, real screens in Storybook.
**Verified by scripts:** onboarding click-through, brief §5.4 end to end (12/12), every scenario on every screen (102 checks), axe WCAG 2.1 AA (28 screens), production build.
**Deviations from the brief (all agreed):** floating glass tab bar (iOS 26), SF Pro Text/Display, palette from the logo, Home "today" chart as a power curve (kW) instead of bars, battery blue.
**Not done:** calendar heatmap (skipped), Android, desktop dashboard (out of scope).
