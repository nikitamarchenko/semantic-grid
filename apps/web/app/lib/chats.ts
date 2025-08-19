import "server-only";

// import { getAccessToken } from "@auth0/nextjs-auth0";
import type { TChatHistory } from "@/app/lib/types";

const chatHistory: TChatHistory = [
  {
    uid: "Chataaaa1111",
    topic: "Test chat",
    lastUpdated: Date.now() - 1000 * 60 * 60 * 24,
    tags: ["test"],
    messages: [
      { isBot: false, text: "Was it something i asked?", uid: "aaaa1111" },
      { isBot: true, text: "Was it something i said?", uid: "bbbb2222" },
    ],
  },
];

export const getChatHistory = async (): Promise<TChatHistory> =>
  // const session = await getSession();
  // const accessToken = await getAccessToken();
  // console.log("accessToken", accessToken);
  chatHistory;
