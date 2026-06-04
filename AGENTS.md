# Squadmaker Agent Notes

## Project Memory

Use these docs before changing behavior:

- Product/admin context: `docs/guides/squadmaker-v2-admin-guide.md`
- Current update log: `docs/guides/squadmaker-v2-update-log.md`
- Compound learning store: `docs/solutions/`
- Original implementation plan: `docs/superpowers/plans/2026-06-02-squadmaker-v2-implementation.md`

## Compound Engineering Loop

After each meaningful feature, bug fix, real-use test, or deployment:

1. Add or update one focused note under `docs/solutions/`.
2. Update `docs/guides/squadmaker-v2-update-log.md` when user-facing behavior changed.
3. Keep the admin guide current if the operating workflow changed.
4. Run fresh verification before claiming completion.
5. Commit the documentation with the code change when possible.

## Product Rules To Preserve

- Mobile-first match-day operation is more important than desktop polish.
- A팀 and B팀 are current-quarter lineup boards, not permanent teams.
- GK quarters do not count as field quarters.
- Previous GKs should be favored for field placement and deprioritized for GK again.
- Managers must be able to override recommendations through simple taps.
- Avoid adding complex player metadata until real-use testing proves the need.
