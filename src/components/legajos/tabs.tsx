"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  count?: number;
  disabled?: boolean;
}

export function Tabs({ tabs, defaultId }: { tabs: Tab[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="border-b border-[color:var(--border)] flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => !t.disabled && setActive(t.id)}
            className={cn(
              "px-3 py-2 text-sm border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5",
              active === t.id
                ? "border-[color:var(--accent)] text-text font-medium"
                : "border-transparent text-text-tertiary hover:text-text-secondary",
              t.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="font-mono tabular-nums text-[10px] rounded-full bg-[color:var(--bg-muted)] px-1.5 py-0.5 text-text-tertiary">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="pt-5">{current?.content}</div>
    </div>
  );
}

export function TabPlaceholder({ title }: { title: string }) {
  return (
    <div className="border border-dashed border-[color:var(--border-strong)] rounded-lg px-6 py-16 text-center">
      <div className="text-sm font-medium text-text">{title}</div>
      <div className="mt-1 text-xs text-text-tertiary">En construcción para fase 2 del producto.</div>
    </div>
  );
}
