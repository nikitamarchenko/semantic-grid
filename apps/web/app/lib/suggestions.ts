export const getSuggestions = async (
  messages: any[] | null,
  metadata?: any,
  rows?: any[] | null,
  cols?: any | null,
  prompt?: string,
) => {
  console.log("getSuggestions");
  if (messages && messages?.length > 0 && prompt) {
    throw new Error(
      "Cannot provide both messages and prompt. Please use one of them.",
    );
  }

  const resp = await fetch("/api/ai/options", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      messages,
      metadata,
      rows,
      cols,
    }),
  });
  const data = await resp.json();
  console.log("options", data?.options?.options);
  return data?.options?.options || [];
  // return ["One", "Two", "Three"];
};
