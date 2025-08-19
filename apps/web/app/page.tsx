import type { Metadata } from "next";

import ActualHomePage from "@/app/home-page";

export const metadata: Metadata = {
  title: "ApeGPT Chatbot",
  description:
    "Build custom dashboards of Solana DEX activity using natural language.",
};

const Page = async () => <ActualHomePage />;

export default Page;
