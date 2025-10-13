"use client";

import { usePathname, useRouter,useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ViewKey = "chart" | "grid" | "sql";
const VIEW_KEYS: ViewKey[] = ["chart", "grid", "sql"] as const;

export function useItemView(itemId: string | undefined, defaultView: ViewKey = "chart") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const baseUrl = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  const readHash = (): ViewKey | null => {
    if (typeof window === "undefined") return null;
    const h = window.location.hash.replace(/^#/, "");
    return VIEW_KEYS.includes(h as ViewKey) ? (h as ViewKey) : null;
  };

  const readLocal = (): ViewKey | null => {
    if (!itemId || typeof window === "undefined") return null;
    const v = window.localStorage.getItem(`itemView:${itemId}`);
    return VIEW_KEYS.includes(v as ViewKey) ? (v as ViewKey) : null;
  };

  const initial = readHash() ?? readLocal() ?? defaultView;
  const [view, setViewState] = useState<ViewKey>(initial);

  // Keep state in sync with manual hash edits or back/forward
  useEffect(() => {
    const onHash = () => {
      const h = readHash();
      if (h && h !== view) setViewState(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [view]);

  // Persist into localStorage per item
  useEffect(() => {
    if (itemId && typeof window !== "undefined") {
      window.localStorage.setItem(`itemView:${itemId}`, view);
    }
  }, [itemId, view]);

  // Cross-tab sync via storage events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!itemId) return;
      if (e.key === `itemView:${itemId}` && e.newValue) {
        const nv = e.newValue as ViewKey;
        if (VIEW_KEYS.includes(nv) && nv !== view) {
          // also push to hash so URL stays authoritative
          router.replace(`${baseUrl}#${nv}`, { scroll: false });
          setViewState(nv);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [itemId, baseUrl, router, view]);

  const setView = (next: ViewKey) => {
    if (!VIEW_KEYS.includes(next)) return;
    setViewState(next);
    router.replace(`${baseUrl}#${next}`, { scroll: false });
    if (itemId && typeof window !== "undefined") {
      window.localStorage.setItem(`itemView:${itemId}`, next);
    }
  };

  // If no hash present on mount, push the resolved view into the URL once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!readHash()) {
      router.replace(`${baseUrl}#${view}`, { scroll: false });
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [view, setView] as const;
}