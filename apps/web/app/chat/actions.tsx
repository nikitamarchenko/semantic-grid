"use server";

import { cookies } from "next/headers";
import { cache } from "react";

import { getSessions } from "@/app/actions";
import {
  responseToBotMessage,
  responseToHumanMessage,
} from "@/app/helpers/chat";
import {
  createUserSession,
  getAllUserRequestsForSession,
} from "@/app/lib/gptAPI";

type TUserSession = {
  session: any;
  allSessions: any[];
};

export const getOrCreateSession = async ({
  id,
  name,
  tags,
}: any): Promise<TUserSession> => {
  const sessions = await getSessions();
  const currentSession = sessions.find((s: any) => s.session_id === id);
  if (!sessions || sessions.length === 0 || !currentSession) {
    const newSession = await createUserSession({ name, tags });
    return { session: newSession, allSessions: [] };
  }
  return { session: currentSession, allSessions: sessions };
  // return sessions
  //  .filter((s: any) => !s.tags?.includes("hidden"))
  //  .sort(byTime)?.[0];
};

export const getCurrentChat = cache(async (session: any) => {
  if (session) {
    console.log("get chat for session", session.session_id);
    const currentSession = await getAllUserRequestsForSession({
      sessionId: session?.session_id,
    });
    const sorted = currentSession.sort(
      (a: any, b: any) => a.sequence_number - b.sequence_number,
    );
    // console.log("sorted", sorted);
    return {
      topic: session?.name as string,
      uid: session?.session_id as string,
      lastUpdated: Date.now(),
      messages: sorted
        .filter((r) => Boolean(r))
        .flatMap((r: any) => [
          responseToHumanMessage(r),
          responseToBotMessage(r),
        ]),
    };
  }
  return null;
});

export async function increaseTrialCount() {
  const cookieStore = cookies();
  const freeRequests = Number(cookieStore.get("apegpt-trial")?.value || 0);

  // Increase free trial count
  cookieStore.set("apegpt-trial", (freeRequests + 1).toString(), {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  console.log("Trial count updated:", freeRequests + 1);
}
