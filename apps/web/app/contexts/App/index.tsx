"use client";

import type { Dispatch, SetStateAction } from "react";
import React, { createContext, useState } from "react";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";

export type TModel = {
  label: string;
  value: string;
};

export type IAppContext = {
  model: TModel;
  setModel: Dispatch<SetStateAction<TModel>>;
  flow: TModel;
  setFlow: Dispatch<SetStateAction<TModel>>;
  db: TModel;
  setDB: Dispatch<SetStateAction<TModel>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  contextOpen: boolean;
  setContextOpen: Dispatch<SetStateAction<boolean>>;
  currentMessage: any;
  setCurrentMessage: Dispatch<SetStateAction<any>>;
  setStoredModelName?: (value: string) => void;
  setStoredFlowName?: (value: string) => void;
  setStoredDBName?: (value: string) => void;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  editMode: string;
  setEditMode: Dispatch<SetStateAction<string>>;
};

export const LegacyModels: Record<string, TModel> = {
  OpenAIMultisteps: { label: "Open AI Multistep", value: "OpenAIMultisteps" },
  OpenAISimple: { label: "Open AI", value: "OpenAISimple" },
  OpenAISimpleNWH: { label: "Open AI NWH", value: "OpenAISimpleNWH" },
  OpenAISimpleV2: { label: "Open AI V2", value: "OpenAISimpleV2" },
  GeminiMultistep: { label: "Gemini Multistep", value: "GeminiMultistep" },
  GeminiSimple: { label: "Gemini", value: "GeminiSimple" },
  GeminiSimpleNWH: { label: "Gemini NWH", value: "GeminiSimpleNWH" },
  GeminiSimpleV2: { label: "Gemini V2", value: "GeminiSimpleV2" },
  DeepseekMultistep: {
    label: "DeepSeek Multistep",
    value: "DeepseekMultistep",
  },
  DeepseekSimple: { label: "DeepSeek", value: "DeepseekSimple" },
  DeepseekSimpleNWH: { label: "DeepSeek NWH", value: "DeepseekSimpleNWH" },
  DeepseekSimpleV2: { label: "DeepSeek V2", value: "DeepseekSimpleV2" },
  AnthropicMultistep: {
    label: "Anthropic Multistep",
    value: "AnthropicMultistep",
  },
  AnthropicSimple: { label: "Anthropic", value: "AnthropicSimple" },
  AnthropicSimpleNWH: { label: "Anthropic NWH", value: "AnthropicSimpleNWH" },
  AnthropicSimpleV2: { label: "Anthropic V2", value: "AnthropicSimpleV2" },
};

export const Models: Record<string, TModel> = {
  OpenAI: { label: "OpenAI", value: "OpenAI" },
  Gemini: { label: "Gemini", value: "Gemini" },
  DeepSeek: { label: "DeepSeek", value: "Deepseek" },
  Anthropic: { label: "Anthropic", value: "Anthropic" },
};

export const DBs: Record<string, TModel> = {
  Old: { label: "Old", value: "" },
  NWH: { label: "1Hr", value: "NWH" },
  V2: { label: "V2", value: "V2" },
};

export const Flows: Record<string, TModel> = {
  Simple: { label: "Simple", value: "Simple" },
  Multistep: { label: "Multistep", value: "Multistep" },
  Interactive: { label: "Interactive", value: "Interactive" },
};

const initState: IAppContext = {
  model: Models.OpenAI as TModel,
  setModel: () => {},
  flow: Flows.Multistep as TModel,
  setFlow: () => {},
  db: DBs.Old as TModel,
  setDB: () => {},
  dialogOpen: false,
  setDialogOpen: () => {},
  navOpen: false,
  setNavOpen: () => {},
  contextOpen: false,
  setContextOpen: () => {},
  currentMessage: null,
  setCurrentMessage: () => {},
  setStoredModelName: () => {},
  tab: 0,
  setTab: () => {},
  editMode: "",
  setEditMode: () => {},
};

export const AppContext = createContext<IAppContext>(initState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedModelName, setStoredModelName] = useLocalStorage(
    "apegpt-model",
    Models.OpenAI?.value || "",
  );
  const [storedFlowName, setStoredFlowName] = useLocalStorage(
    "apegpt-flow",
    Flows.Multistep?.value || "",
  );
  const [storedDBName, setStoredDBName] = useLocalStorage(
    "apegpt-db",
    DBs.Old?.value || "",
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(initState.dialogOpen);
  const defaultModel =
    Models[storedModelName as keyof typeof Models] || initState.model;
  const defaultFlow =
    Flows[storedFlowName as keyof typeof Flows] || initState.flow;
  const defaultDB = DBs[storedDBName as keyof typeof DBs] || initState.db;

  const [model, setModel] = useState<TModel>(defaultModel);
  const [flow, setFlow] = useState<TModel>(defaultFlow);
  const [db, setDB] = useState<TModel>(defaultDB);
  const [navOpen, setNavOpen] = useState<boolean>(initState.navOpen);
  const [tab, setTab] = useState(0); // Tabs: 0 - Table, 2 - SQL
  const [contextOpen, setContextOpen] = useState<boolean>(
    initState.contextOpen,
  );
  const [editMode, setEditMode] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState(
    initState.currentMessage,
  );

  return (
    <AppContext.Provider
      value={{
        model,
        setModel,
        flow,
        setFlow,
        db,
        setDB,
        dialogOpen,
        setDialogOpen,
        navOpen,
        setNavOpen,
        contextOpen,
        setContextOpen,
        currentMessage,
        setCurrentMessage,
        setStoredModelName,
        setStoredFlowName,
        setStoredDBName,
        tab,
        setTab,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
