# Squadmaker V2 Pitch First Redesign

## Decision

Squadmaker V2 will use the **Pitch First** direction for the mobile app redesign.

The app should feel like a match-day manager console, not a landing page or a generic dark dashboard. The first visual signal should be football operations: formation, squad count, quarter state, and quick touch controls.

Figma file:

- https://www.figma.com/design/Ghr8HlRNijGD0pAxIXhSWq

## Reference Boundary

JoGi Soccer is used only as a reference for:

- strong sports-product contrast
- data-first credibility
- formation and lineup as a visual product signal
- mobile app confidence

Do not copy:

- JoGi's copy structure
- JoGi's landing-page hero rhythm
- JoGi's exact color pairing
- JoGi's visual hierarchy or feature-list sections

Squadmaker's identity is narrower and more practical: fast match-day squad operation for a manager standing beside the pitch.

## Visual Thesis

Dark pitch console with green tactical surfaces, compact high-contrast cards, and touch-first controls. The interface should feel calm under pressure, with the pitch board as the hero element on team screens.

## Design Tokens

Core colors:

- App background: `#08140F`
- Surface: `#0F1F17`
- Surface raised: `rgba(255,255,255,0.07)`
- Pitch base: `#166534`
- Pitch stripe: `#15803D`
- Primary action: `#22C55E`
- Primary text on action: `#052E16`
- Warning / quarter end: `#FACC15`
- Danger / departed: `#EF4444`
- Text primary: `#F8FAFC`
- Text secondary: `#8DA99B`
- Muted nav text: `#64748B`
- Bottom nav: `#020617`

Shape:

- App frame radius: mobile device visual only, 36px in Figma.
- Interactive cards: 14-16px radius.
- Pitch: 20px radius.
- Player chips: 14-15px radius.
- Bottom nav active target: 16px radius.

Touch:

- Minimum interactive height: 44px.
- Preferred primary action height: 54-62px.
- Bottom navigation height: 80px plus safe area.
- Player chips on pitch must remain tappable without text overlap.

Typography:

- Use current web font stack for implementation unless a Korean app font is introduced later.
- Headline: 24-26px, bold.
- Section labels: 11-12px, bold/medium.
- Player names on pitch: 10-12px, bold.
- Avoid viewport-scaled font sizes.

## Screens

### Participants

Purpose:

- Mark who came today.
- Show quarter and active count.
- Make `추천 배정` visually dominant so the workflow naturally moves toward the pitch.

Layout:

- Header: brand, screen title, short operational subtitle.
- Stat row: current quarter, attendance, recommendation CTA.
- Roster rows: name, attendance status, arrival order, preferred position, field count.
- Bottom tabs: 참여, A팀, B팀.

Behavior:

- Tapping a roster player still marks present or opens the player sheet.
- Roster rows remain dense but less flat than the current implementation.
- Status color should be visible without relying only on text.

### Team Formation

Purpose:

- Make the formation board the center of the app.
- Support tap-to-swap player positions.
- Keep quarter controls accessible without pushing the pitch too low.

Layout:

- Header: `A팀 라인업` or `B팀 라인업`.
- Top controls: formation, field count, quarter end.
- Pitch board: full-width, high-priority visual.
- Player chips: role pill, name, optional quarter count.
- Bench/team list can sit below the pitch as secondary information.

Behavior:

- Tapping first player selects.
- Tapping second player swaps.
- Formation switch should preserve the Pitch First hierarchy.
- GK remains a player chip, not a fixed identity.

### Player Sheet

Purpose:

- Edit attendance status and preferred position with minimum complexity.

Layout:

- Bottom sheet over dimmed content.
- Player name and current preferred position.
- Five compact preference buttons: 랜덤, 수비, 미드, 공격, GK.
- Status actions: 잠시 제외, 복귀, 오늘 이탈, 닫기.

Behavior:

- Preference choice updates in place.
- Sheet does not close after preference change.
- Status changes can close the sheet as current app behavior does.

## Implementation Notes

The redesign should be implemented mostly in CSS and small component markup changes.

Likely changes:

- Replace the current blue-teal dashboard background with the Pitch First palette.
- Refactor participants top summary into a 3-part match control strip.
- Reduce generic card feel and make roster rows more app-like.
- Give team tabs a formation control strip above the pitch.
- Make the pitch board visually cleaner and more central.
- Rework bottom nav styling with stronger active target.
- Rework action sheet into the Figma sheet layout.

Do not change assignment logic during this visual pass unless a layout issue exposes a bug.

## Testing And Verification

Automated:

- Existing Vitest suite should continue to pass.
- Add or adjust tests only if markup names or accessibility labels change.

Visual:

- Verify mobile viewport around `390x844`.
- Confirm no text overlaps in:
  - participant rows
  - top control strip
  - pitch player chips
  - player action sheet
- Confirm bottom nav does not cover critical controls.

Deployment:

- After implementation, build and deploy the static app to GitHub Pages as before.

