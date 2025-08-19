import { Check, ContentCopy } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

import type { TChatSection } from "@/app/lib/types";

const CopyQueryUrl = ({ section }: { section: TChatSection }) => {
  const [copied, setCopied] = useState(false);
  return (
    <IconButton
      size="small"
      aria-label="copy query URL"
      onClick={(e) => {
        e.stopPropagation();
        if (typeof window === "undefined") return;

        const url = `${window.location.origin}/q/${section.query?.query_id}`;
        navigator.clipboard
          .writeText(url)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
          })
          .catch((err) => {
            // console.error("Failed to copy URL:", err);
          });
      }}
    >
      {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
    </IconButton>
  );
};

export default CopyQueryUrl;
