import type { ReactNode } from "react";
import { BUFF_LABELS, RESOURCE_INFO } from "../data/oghuzData";
import { useI18n, type L } from "../i18n";
import type { Confidence, ResourceId, Resources } from "../types/game";

export function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  return Math.floor(n).toLocaleString("en-GB");
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-stone-700 bg-stone-900/80 p-3 ${className}`}>{children}</div>;
}

export function Button({
  children,
  onClick,
  disabled,
  tone = "gold",
  small,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "gold" | "red" | "blue" | "green" | "ghost";
  small?: boolean;
}) {
  const tones = {
    gold: "bg-kayi-gold text-stone-950 hover:brightness-110",
    red: "bg-turk-red text-white hover:brightness-110",
    blue: "bg-kayi-blue text-white hover:brightness-110",
    green: "bg-steppe-green text-stone-950 hover:brightness-110",
    ghost: "border border-stone-600 text-stone-200 hover:bg-stone-800",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${small ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"} ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function CostLine({ cost, have }: { cost: Partial<Resources>; have: Resources }) {
  const { tx } = useI18n();
  return (
    <span className="flex flex-wrap gap-x-2 text-xs">
      {Object.entries(cost).map(([k, v]) => {
        const key = k as ResourceId;
        const ok = have[key] >= (v ?? 0);
        return (
          <span key={k} className={ok ? "text-stone-300" : "text-red-400"}>
            {fmt(v ?? 0)} {tx(RESOURCE_INFO[key].label).toLowerCase()}
          </span>
        );
      })}
    </span>
  );
}

const CONF_STYLE: Record<Confidence, string> = {
  verified: "bg-steppe-green/20 text-green-300 border-steppe-green/50",
  reported: "bg-kayi-blue/25 text-sky-200 border-kayi-blue/60",
  contested: "bg-turk-red/20 text-red-300 border-turk-red/50",
};

export function Confidence({ level }: { level: Confidence }) {
  const { t } = useI18n();
  return <span className={`whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${CONF_STYLE[level]}`}>{t(level)}</span>;
}

export function buffText(b: Record<string, number | undefined>, tx: (l: L) => string): string {
  return Object.entries(b)
    .map(([k, v]) => `${(v ?? 0) > 0 ? "+" : ""}${v}% ${BUFF_LABELS[k] ? tx(BUFF_LABELS[k]) : k}`)
    .join(", ");
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-lg font-bold text-kayi-gold">{title}</h2>
      {sub && <p className="text-xs text-stone-400">{sub}</p>}
    </div>
  );
}
