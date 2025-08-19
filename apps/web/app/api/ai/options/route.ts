import { openai } from "@ai-sdk/openai";
import { generateObject, jsonSchema } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 10 seconds
export const maxDuration = 10;
const schema = jsonSchema({
  type: "object",
  properties: {
    options: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["options"],
});

export async function POST(req: Request) {
  const { prompt, messages, metadata, rows, cols } = await req.json();

  const system = `You are an AI assistant that helps user to continue conversation via interactive query creation and data analysis.\n
    In a regular course of action, users create, modify and then interact with a query (expressed as a valid SQL statement).\n
    Each new user message can trigger either:\n
     1. Creation / modification of the SQL based on user input, or\n
     2. An answer about the data which was returned when SQL was executed on a DB, or \n
     3. A general answer about business domain of the chat (types of data available, etc.), or \n
     4. A disambiguation response from backend system, in case user request is not clear and cannot be acted upon as is.\n
    \n
    Current state of the query is expressed as a metadata object, which contains:\n
    - **sql** - the SQL query string, \n
    - **columns** - an array of column names and descriptions, \n
    - **row_count** - the number of rows returned by the query (user only sees a subset of it), \n
    - **result** - the last response from the backend AI assistant, \n
    - **summary** - a short summary of the query, \n
    Based on the provided Query metadata, prior user messages and current selections made by user (rows or columns),\n 
    you job is to provide 2-3 recommended options for user next request (each one as a plain text) \n
    suggesting next prompts that the user could use. As such, format them as though written by user, in an assertive way.\n
    Examples: "list all trades for selected wallet", "add a new column with trade volume", "show me the top 10 trades by volume", etc.\n
    Return your recommendations in JSON object with a corresponding **options** key.\n
    Make your recommendations based on the following:\n
      - current metadata object: ${metadata ? JSON.stringify(metadata) : "null"},\n
      - (optionally) selected row(s): ${rows ? JSON.stringify(rows) : "null"},\n
      - (optionally) selected column(s): ${cols ? JSON.stringify(cols) : "null"}\n
      - previous messages.\n
    If a user has selected a row or a column, think about specific questions that could be asked about them 
    or actions to be based on them.\n
    \n
    `;

  try {
    const { object: options } = await generateObject({
      model: openai("gpt-4-turbo"),
      system,
      prompt,
      messages,
      schema,
      temperature: 0,
    });

    return NextResponse.json({ options });
  } catch (error: any) {
    console.log("Error in AI decision making:", error);
    return NextResponse.json({
      error: error?.message || "An error occurred while making a suggestion.",
    });
  }
}
