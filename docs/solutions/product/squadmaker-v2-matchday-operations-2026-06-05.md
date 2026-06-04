---
title: Squadmaker V2 match-day operation rules
date: 2026-06-05
category: product
component: squadmaker-v2
tags:
  - match-day
  - lineup
  - bench
  - goalkeeper
  - mobile
source_commits:
  - 9f66979
  - fce716c
---

# Squadmaker V2 Match-Day Operation Rules

## Context

Squadmaker V2 is being shaped through iterative real-use preparation. The current product direction is a mobile-first manager console for quickly selecting attendance, recommending current-quarter lineups, adjusting formation positions, substituting bench players, and recording fair quarter participation.

The app should stay simple enough to operate beside the pitch. Recommendations help the manager, but the manager must keep final control.

## Current Operating Model

- `참여인원` is the attendance source for the day.
- A player tap marks the person present and assigns arrival order.
- A second tap opens the player sheet for status and preferred position.
- `추천 배정` generates current-quarter A/B lineup boards.
- A팀 and B팀 are not permanent squads. They represent the current quarter's lineup boards.
- Each team board uses the selected formation: `433`, `4231`, or `532`.
- The formation board is mandatory when enough players are available; players are placed into role slots.
- Extra active players appear in `대기 명단`.
- The manager can tap a lineup player and then a bench player to substitute.
- The manager can tap two lineup players to swap positions.

## Fairness Rules

The assignment recommendation favors fairness before perfect team identity.

- Only active players are assigned.
- Temporarily out or departed players are excluded.
- Field quarter count is the main fairness signal.
- Lower field-quarter players are preferred for the next recommendation.
- GK quarters are separate from field quarters.
- A player who was GK in the previous quarter gets field-priority for the next quarter.
- A player who was GK in the previous quarter is deprioritized as GK again.
- Preferred position is a soft signal, not a hard lock.

## UI Rules

- Mobile layout is the primary target.
- The pitch board should be the main team-screen visual.
- A팀 uses yellow as fixed team color.
- B팀 uses blue as fixed team color.
- Position role colors are:
  - Attack: red
  - Midfield: green
  - Defense: blue
  - GK: yellow
- Search is available on `참여인원` because long rosters are hard to scan during real use.

## Data Notes

- Current default roster uses names only.
- `김용삼1` was renamed to `김용삼`.
- Duplicate `김용삼2` was removed.
- More player metadata should wait until real-use testing proves it is needed.

## Verification Pattern

For future changes touching match-day behavior, keep tests around these flows:

- Attendance selection and search filtering.
- Auto assignment into A/B/bench.
- Formation slot placement.
- Lineup-to-lineup swap.
- Lineup-to-bench substitution.
- Quarter finish field/GK counting.
- GK field-priority and GK de-prioritization after a completed quarter.

## Related Files

- `src/domain/assignment.ts`
- `src/domain/session.ts`
- `src/domain/formations.ts`
- `src/components/ParticipantsTab.tsx`
- `src/components/TeamTab.tsx`
- `src/styles.css`
- `src/App.test.tsx`
- `docs/guides/squadmaker-v2-admin-guide.md`
- `docs/guides/squadmaker-v2-update-log.md`
