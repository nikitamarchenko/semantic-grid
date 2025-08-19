import "server-only";

// "use server";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new ChatAnthropic({
  model: process.env.LLM_MODEL,
  temperature: 0,
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([["human", "{input}"]]);
const apeChain = prompt.pipe(llm);

export const askGptApi = async ({
  query,
  sessionHash,
}: {
  query: string;
  sessionHash: string;
}) => {
  try {
    const response = await apeChain.invoke({ input: query });
    return { response: response.content, session_hash: sessionHash };
  } catch (e: any) {
    console.error(e);
    return {
      response: `Something went wrong: ${e?.message}`,
      session_hash: sessionHash,
    };
  }
};
