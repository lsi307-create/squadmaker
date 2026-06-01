import type { PlayerStatus } from "../domain/types";

interface PlayerActionSheetProps {
  playerName: string | null;
  onClose: () => void;
  onStatus: (status: Exclude<PlayerStatus, "roster">) => void;
}

export function PlayerActionSheet({ playerName, onClose, onStatus }: PlayerActionSheetProps) {
  if (!playerName) return null;

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
        </div>
        <button type="button" onClick={() => onStatus("temporarilyOut")}>
          잠시 제외
        </button>
        <button type="button" onClick={() => onStatus("active")}>
          복귀
        </button>
        <button type="button" onClick={() => onStatus("departed")}>
          오늘 이탈
        </button>
        <button className="ghost-button" type="button" onClick={onClose}>
          닫기
        </button>
      </section>
    </div>
  );
}
