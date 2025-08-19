import { openai } from "@ai-sdk/openai";
import { generateObject, jsonSchema } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 10 seconds
export const maxDuration = 10;
const schema = jsonSchema({
  type: "object",
  properties: {
    decision: {
      type: "string",
      enum: [
        "interactive_query",
        "linked_session",
        "general_chat",
        "data_analysis",
      ],
    },
  },
  required: ["decision"],
});

export async function POST(req: Request) {
  const { prompt, sql, rows, cols, validChoices } = await req.json();

  const system = `You are an AI assistant that helps our application decide how to proceed with the user queries.\n
    In a regular course of action, users create and then interact with a query (expressed as a valid SQL statement).\n
    Each new user message can trigger either:\n
     1. Creation / modification of the SQL based on user input, or\n
     2. An answer about the data which was returned when SQL was executed on a DB, or \n
     3. A general answer about business domain of the chat (types of data available, etc.), or \n
     4. A disambiguation response from you, in case user request is not clear and cannot be acted upon as is.\n
    \n
    Based on the provided messages and a prompt, you will determine the best course of action, \n
    expressing your decision in JSON object with a corresponding **decision** key, using the following valid choices:\n
     ${validChoices ? JSON.stringify(validChoices) : ["new_session", "linked_session", "data_analysis", "general_chat"]}\n
    \n
    Make your decision based on the following:\n
      - current SQL query: ${sql || "null"},\n
      - (optionally) selected row(s): ${rows ? JSON.stringify(rows) : "null"},\n
      - (optionally) selected column(s): ${cols ? JSON.stringify(cols) : "null"}\n
      - provided prior messages and current prompt.\n
    \n
    Important: the most intricate decision is about whether to create a new session or answer the question 
    about current data in existing one!
    `;

  try {
    const { object: decision } = await generateObject({
      model: openai("gpt-4-turbo"),
      system,
      prompt,
      schema,
      temperature: 0,
    });

    return NextResponse.json({ decision });
  } catch (error: any) {
    console.log("Error in AI decision making:", error);
    return NextResponse.json({
      error: error?.message || "An error occurred while making a decision.",
    });
  }
}
