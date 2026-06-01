import { ClipboardList, Shield, Swords } from "lucide-react";

export type TabKey = "participants" | "teamA" | "teamB";

interface BottomNavProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs = [
  { key: "participants" as const, label: "참여인원", icon: ClipboardList },
  { key: "teamA" as const, label: "A팀", icon: Shield },
  { key: "teamB" as const, label: "B팀", icon: Swords }
];

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="주요 화면">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          className={`bottom-nav__button ${activeTab === key ? "is-active" : ""}`}
          key={key}
          type="button"
          onClick={() => onChange(key)}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
