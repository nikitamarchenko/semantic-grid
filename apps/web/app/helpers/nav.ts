import { format } from "date-fns-tz";

import type { TChat, TChatHistory } from "@/app/lib/types";

export const groupByDay = (items: TChatHistory) =>
  items.reduce(
    (acc, item) => {
      const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
      const today = format(new Date(), "MMM d", { timeZone });
      const yesterday = format(
        new Date(Date.now() - 24 * 3600 * 1000),
        "MMM d",
        { timeZone },
      );
      // Convert the timestamp to a date string (YYYY-MM-DD format)
      let dateKey = format(new Date(item.lastUpdated), "MMM d", { timeZone });
      if (dateKey === today) {
        dateKey = "Today";
      }
      if (dateKey === yesterday) {
        dateKey = "Yesterday";
      }
      if (!acc[dateKey]) {
        acc[dateKey] = [] as TChat[];
      }
      // Add the current item to the appropriate day group
      // @ts-ignore
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, TChat[]>,
  );

export const byTime = (a: any, b: any) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

export const toChatHistoryEntry = (s: any) =>
  ({
    uid: s.session_id,
    topic: s.metadata?.summary || (s.name as string),
    lastUpdated: s.created_at as any,
    tags:
      s.tags
        ?.split(",")
        .map((t: string) => t.trim())
        .filter(Boolean) || [],
    messages: [],
    message_count: s.message_count || 0,
    parent: s.parent || undefined,
  }) as TChat;

export const toUserHistoryEntry = (s: any) =>
  ({
    uid: s.session_id,
    name: s.metadata?.summary || (s.name as string),
    lastUpdated: s.created_at as any,
    tags:
      s.tags
        ?.split(",")
        .map((t: string) => t.trim())
        .filter(Boolean) || [],
    // messages: [],
    message_count: s.message_count || 0,
    // parent: s.parent || undefined,
  }) as any;
