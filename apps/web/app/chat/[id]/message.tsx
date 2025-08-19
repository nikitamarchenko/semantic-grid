import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import CsvTable, { parseCsv } from "@/app/chat/[id]/table";
import type { TChatMessage } from "@/app/lib/types";

export const LegacyMessage = ({ uid, text }: { uid: string; text: string }) => {
  if (text.startsWith("csv")) {
    const csv = text.slice(3);
    return <CsvTable key={`table-${uid}-${csv.slice(0, 32)}`} csvData={csv} />;
  }
  if (text.startsWith("div")) {
    const div = text
      .slice(3)
      .replace('width="100%">', 'width="100%" style="height: 50vh;">');
    return (
      <Box
        key={`iframe-${uid}-${div.slice(0, 32)}`}
        dangerouslySetInnerHTML={{
          __html: div,
        }}
      />
    );
  }
  if (text.startsWith("txt")) {
    const textBlock = text.slice(3);
    return (
      <Markdown
        key={text?.slice(0, 32)}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {textBlock}
      </Markdown>
    );
  }
  return (
    <Markdown
      key={text?.slice(0, 32)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {text}
    </Markdown>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
};

export const StructuredMessage = ({ resp }: { resp: TChatMessage }) => {
  const { uid, text, structuredResponse } = resp;
  const {
    request,
    csv,
    intro,
    outro,
    assumptions,
    chart_url: chartUrl,
  } = structuredResponse || {};
  const data = csv ? parseCsv(csv) : [];
  const hasSingleItem =
    data.length > 0 && data[0]?.length === 1 && data.length < 3;
  const chartRequested = request?.toLowerCase().includes("chart") || chartUrl;
  const [tab, setTab] = useState<string>(chartRequested ? "chart" : "table");
  return (
    <Box
      sx={{ "& p": { marginBottom: "1rem" }, "& li": { fontSize: "inherit" } }}
    >
      <Markdown
        key={assumptions?.slice(0, 32)}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {assumptions ? `Assumptions: ${assumptions}` : ""}
      </Markdown>
      <Markdown
        key={intro?.slice(0, 32)}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {intro}
      </Markdown>
      {!intro && !outro && text && !(csv && !chartUrl && hasSingleItem) && (
        <Markdown
          key={text?.slice(0, 32)}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {text}
        </Markdown>
      )}
      {csv && chartUrl && (
        <Box>
          <Tabs value={tab} centered>
            <Tab
              label="Table"
              value="table"
              onClick={(e) => {
                e.stopPropagation();
                setTab("table");
              }}
              disabled={!csv}
            />
            <Tab
              label="Chart"
              value="chart"
              onClick={(e) => {
                e.stopPropagation();
                setTab("chart");
              }}
              disabled={!chartUrl}
            />
          </Tabs>
          <CustomTabPanel value={tab} index="table">
            <CsvTable key={`table-${uid}-${csv.slice(0, 32)}`} csvData={csv} />
          </CustomTabPanel>
          <CustomTabPanel value={tab} index="chart">
            <Box sx={{ width: "100%" }}>
              <iframe
                width="100%"
                style={{ height: "50vh" }}
                frameBorder={0}
                src={chartUrl}
                title="Chart"
              />
            </Box>
          </CustomTabPanel>
        </Box>
      )}
      {csv && !chartUrl && !hasSingleItem && (
        <CsvTable key={`table-${uid}-${csv.slice(0, 32)}`} csvData={csv} />
      )}
      {csv && !chartUrl && hasSingleItem && (
        <Markdown
          key={text?.slice(0, 32)}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {text}
        </Markdown>
      )}
      {chartUrl && !csv && (
        <Box sx={{ width: "100%" }}>
          <iframe
            width="100%"
            style={{ height: "50vh" }}
            frameBorder={0}
            src={chartUrl}
            title="Chart"
          />
        </Box>
      )}
      <Markdown
        key={outro?.slice(0, 32)}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {outro}
      </Markdown>
    </Box>
  );
};
