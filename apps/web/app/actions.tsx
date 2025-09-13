"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUserAuthSession } from "@/app/lib/authUser";
import { sendEmail } from "@/app/lib/awsSes";
import {
  createLinkedUserSession,
  createUserRequest,
  createUserRequestFromQuery,
  createUserSession,
  getAllUserRequestsForSession,
  getQuery,
  getSingleUserRequest,
  getUserSessions,
  updateUserRequest,
  updateUserSession,
} from "@/app/lib/gptAPI";

const byTime = (a: any, b: any) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

// ApeGPT API

export const getSessions = async () => getUserSessions();

export const createSession = async ({ name, tags }: any) => {
  const res = await createUserSession({ name, tags });
  revalidatePath("/query/[id]", "page");
  return res;
};

export const createLinkedSession = async ({
  name,
  tags,
  parentId,
  flow,
  request,
  model,
  db,
  refs,
}: any) => {
  const res = await createLinkedUserSession({
    name,
    tags,
    parentId,
    flow,
    request,
    model,
    db,
    refs,
  });
  revalidatePath("/query/[id]", "page");
  return res;
};

export const getOrCreateSession = async ({ name, tags }: any) => {
  try {
    const sessions = await getUserSessions();
    if (!sessions || sessions.length === 0) {
      const res = await createSession({ name, tags });
      revalidatePath("/", "page");
      return res;
    }
    return sessions.sort(byTime)?.[0];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateSession = async ({ sessionId, name, tags }: any) => {
  await updateUserSession({ sessionId, name, tags });
  revalidatePath("/query/[id]", "page");
};

export const createRequest = async ({
  sessionId,
  request,
  requestType,
  flow,
  model,
  refs,
  db,
  queryId,
}: any) => {
  try {
    return await createUserRequest({
      sessionId,
      request,
      requestType,
      flow,
      model,
      db,
      refs,
      queryId,
    });
  } catch (e) {
    console.error(e);
    return redirect("/login?returnTo=/?error=access_denied");
  }
};

export const createRequestFromQuery = async ({
  sessionId,
  queryId,
}: {
  sessionId: string;
  queryId: string;
}) => {
  try {
    return await createUserRequestFromQuery({
      sessionId,
      queryId,
    });
  } catch (e) {
    console.error(e);
    return redirect("/login?returnTo=/?error=access_denied");
  }
};

export const updateRequest = async ({ sessionId, requestId, data }: any) => {
  await updateUserRequest({ requestId, data });
  // revalidatePath("/", "layout");
  console.log("revalidatePath", `/query/${sessionId}`);
  revalidatePath(`/query/${sessionId}`, "page");
};

export const getSingleRequest = async ({ sessionId, seqNum }: any) => {
  const res = await getSingleUserRequest({ sessionId, seqNum });
  return res;
};

export const getAllRequests = async ({ sessionId }: any) =>
  getAllUserRequestsForSession({ sessionId });

export const requestAccess = async ({
  email,
  name,
  description,
}: {
  email: string;
  name: string;
  description: string;
}) => {
  console.log("Requesting access", email, name, description);
  const res = await sendEmail(email, name, description);
  console.log("Email sent", res);
  return res;
};

export const updatePage = async ({ sessionId }: any) => {
  console.log("refreshPage", `/query/${sessionId}`);
  revalidatePath(`/query/${sessionId}`, "page");
};

export const getUserAuth = async () => {
  console.log("get auth");
  return getUserAuthSession().then((r) => r?.user);
};

export const getQueryById = async (id: string) => getQuery({ queryId: id });
