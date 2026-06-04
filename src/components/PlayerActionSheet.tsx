import type { PlayerStatus, PreferredPosition } from "../domain/types";

interface PlayerActionSheetProps {
  playerName: string | null;
  preferredPosition: PreferredPosition;
  onClose: () => void;
  onStatus: (status: Exclude<PlayerStatus, "roster">) => void;
  onPreferredPosition: (position: PreferredPosition) => void;
}

const positionOptions: Array<{ value: PreferredPosition; label: string; actionLabel: string }> = [
  { value: "random", label: "랜덤", actionLabel: "랜덤 선호" },
  { value: "defense", label: "수비", actionLabel: "수비 선호" },
  { value: "midfield", label: "미드", actionLabel: "미드 선호" },
  { value: "attack", label: "공격", actionLabel: "공격 선호" },
  { value: "keeper", label: "GK", actionLabel: "GK 선호" }
];

export function PlayerActionSheet({
  playerName,
  preferredPosition,
  onClose,
  onStatus,
  onPreferredPosition
}: PlayerActionSheetProps) {
  if (!playerName) return null;
  const currentPosition = positionOptions.find((option) => option.value === preferredPosition) ?? positionOptions[0];

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section
        className="action-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`${playerName} 상태 변경`}
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <p className="sheet-label">선수 상태</p>
          <h2>{playerName}</h2>
          <p className="sheet-current-position">
            선호 <strong>{currentPosition.label}</strong>
          </p>
        </div>
        <div className="position-preference" aria-label="선호 포지션">
          {positionOptions.map((option) => (
            <button
              className={preferredPosition === option.value ? "is-active" : ""}
              key={option.value}
              type="button"
              aria-label={option.actionLabel}
              onClick={() => onPreferredPosition(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="sheet-actions">
          <button className="warning-button" type="button" onClick={() => onStatus("temporarilyOut")}>
            잠시 제외
          </button>
          <button type="button" onClick={() => onStatus("active")}>
            복귀
          </button>
          <button className="danger-button" type="button" onClick={() => onStatus("departed")}>
            오늘 이탈
          </button>
          <button className="ghost-button" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}
