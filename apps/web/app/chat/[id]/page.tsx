// import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { cache, Suspense } from "react";

import ChatContainer from "@/app/chat/[id]/chat-container";
import {
  responseToBotMessage,
  responseToHumanMessage,
} from "@/app/helpers/chat";
import { getUserAuthSession } from "@/app/lib/authUser";
import { getAllUserRequestsForSession } from "@/app/lib/gptAPI";
import type { TChat } from "@/app/lib/types";

const getChatMessages = cache(async (id: string) => {
  const currentSession = await getAllUserRequestsForSession({ sessionId: id });
  console.log("chat", id, currentSession.length);
  const sorted = currentSession.sort(
    (a: any, b: any) => a.sequence_number - b.sequence_number,
  );
  // console.log("sorted", sorted);
  return {
    // topic: session?.name as string,
    // uid: session?.session_id as string,
    // lastUpdated: Date.now(),
    messages: sorted
      .filter(Boolean)
      .flatMap((r: any) => [
        responseToHumanMessage(r),
        responseToBotMessage(r),
      ]),
  };
});

const ChatPage = async ({ params: { id } }: { params: { id: string } }) => {
  const chat = await getChatMessages(id);
  const userSession = await getUserAuthSession();
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <ChatContainer
        key={id}
        id={id}
        chat={chat as TChat}
        user={userSession?.user || null}
        // error={error}
      />
    </Suspense>
  );
};

export default ChatPage;
