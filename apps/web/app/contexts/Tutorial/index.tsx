"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";

export type TStep = {
  text: string[];
  duration: number[];
  choices?: string[];
};

export const TutorialSteps: TStep[] = [
  {
    text: [
      "👋👋👋   Welcome to ApeGPT!",
      "Use natural language to explore Solana DEX data and create custom tables instantly",
      "Let's start with a simple anchor query",
    ],
    duration: [500, 2500, 1000],
    choices: [
      "List all wallets that traded between 10 and 100 times in the last 7 days",
      "List all wallets that sold more than $1000 of TRUMP token in the last two weeks",
      "Show number of unique trades per DEX for HNT token in the last 3 days",
    ],
  },
  {
    text: [
      "💭💭💭 You can keep following my instructions to learn how the interface works or start writing freeform queries at any time to skip the tutorial",
      "Click + button to add a column. Use suggested query to continue.",
    ],
    duration: [4000, 2000],
    choices: ["Add time of last trade"],
  },
  {
    text: [
      "💭💭💭 You can modify a column at any time by clicking on a header and providing your own description. ",
      "Try it now by clicking on the Last Trade column.",
    ],
    duration: [3000, 1500],
    choices: ["Show average number of trades per day"],
  },
  {
    text: [
      "💭💭💭 You can drill down on any record by highlighting a row and asking a record-specific question.",
      "Try it now.",
    ],
    duration: [3000, 750],
    choices: ["List the transactions that made up this record"],
  },
];

export type TTutorialProgress = Record<
  string,
  { sessionId: string; done?: boolean }
>;

export interface ITutorialContext {
  isActive: boolean;
  step: string | undefined;
  proceedToNextStep: () => void;
  stepInProgress: boolean;
  setStepInProgress: (inProgress: boolean) => void;
  cancelTutorial: () => void;
  currentProgressStep?:
    | [string, { sessionId: string; done?: boolean }]
    | undefined;
}

export const TutorialContext = createContext<ITutorialContext | null>(null);

export const TutorialProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const [progress, setProgress] = useLocalStorage<string>(
    "apegpt-tutorial",
    "",
  );
  const progressData = useMemo(() => {
    try {
      return JSON.parse(progress || "{}") as TTutorialProgress;
    } catch {
      return {};
    }
  }, [progress]);

  const completedCount = useMemo(
    () => Object.values(progressData).filter((p) => p.done).length,
    [progressData],
  );

  const isActive = useMemo(() => {
    const totalSteps = TutorialSteps.length;
    const hasStarted = Object.keys(progressData).length > 0;
    return hasStarted && completedCount < totalSteps;
  }, [progressData, completedCount]);

  const currentProgressStep = Object.entries(progressData).find(
    ([, value]) => !value.done,
  );

  console.log("Tutorial progress data:", currentProgressStep, isActive);
  const step = currentProgressStep?.[0];

  const stepInProgress =
    Boolean(step) &&
    typeof step === "string" &&
    progressData[step]?.done !== undefined &&
    !progressData[step]?.done === true; // Check if the current step is in progress

  useEffect(() => {
    if (!progress) {
      setProgress(
        JSON.stringify({
          "0": { sessionId: id },
        } as TTutorialProgress),
      ); // Activate tutorial by default
    }
  }, []);

  const proceedToNextStep = () => {
    const nextStep = Object.keys(progressData).length;
    if (
      nextStep < TutorialSteps.length &&
      isActive &&
      stepInProgress &&
      typeof step === "string"
    ) {
      const updatedProgress = {
        ...progressData,
        [step]: {
          ...progressData[step],
          done: true,
        },
        [`${nextStep}`]: { sessionId: id }, // Add next step with sessionId
      };
      setProgress(JSON.stringify(updatedProgress));
    } else if (nextStep >= TutorialSteps.length && typeof step === "string") {
      const updatedProgress = {
        ...progressData,
        [step]: {
          ...progressData[step],
          done: true,
        },
      };
      setProgress(JSON.stringify(updatedProgress));
    }
  };

  const setStepInProgress = (inProgress: boolean) => {
    if (!step) return; // No step to update

    const updatedProgress = {
      ...progressData,
      [step]: {
        ...progressData[step],
        done: !inProgress, // Toggle done state based on inProgress
      },
    };
    setProgress(JSON.stringify(updatedProgress));
  };

  const cancelTutorial = () => {
    // cancel the tutorial by setting sessionId as 'skipped' for non-finished steps
    const finishedSteps = Object.keys(progressData).filter(
      (key) => progressData[key]?.done,
    );
    const unfinishedSteps = Object.keys(progressData).filter(
      (key) => !progressData[key]?.done,
    );
    const allSteps = TutorialSteps.map((_, index) => `${index + 1}`);
    // set all unfinished steps to 'done' with sessionId
    // set all remaining steps to 'done' with 'skipped' sessionId
    const updatedProgress: TTutorialProgress = {
      ...progressData,
      ...unfinishedSteps.reduce((acc, step) => {
        // @ts-ignore
        acc[step] = { sessionId: id, done: true };
        return acc;
      }, {}),
      ...allSteps.reduce((acc, step) => {
        if (!finishedSteps.includes(step)) {
          // @ts-ignore
          acc[step] = { sessionId: "skipped", done: true };
        }
        return acc;
      }, {}),
    };
    setProgress(JSON.stringify(updatedProgress));
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        step,
        stepInProgress,
        setStepInProgress,
        proceedToNextStep,
        cancelTutorial,
        currentProgressStep,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): ITutorialContext => {
  const ctx = useContext(TutorialContext);
  if (!ctx)
    throw new Error("useTutorial must be used within a TutorialProvider");
  return ctx;
};
