import { OpenInNew } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import type { ReactElement } from "react";
import React from "react";

import { isSolanaAddress } from "@/app/helpers/cell";

export const StructuredText = (str: string, visibleChars = 4): ReactElement => (
  <>
    {str.split(" ").map((word, index) => {
      const key = `${word}-${index}`; // safer in case of duplicates
      const separator = " "; // or '\u00A0' for non-breaking space

      if (isSolanaAddress(word)) {
        return (
          <React.Fragment key={key}>
            <span style={{ color: "inherit" }}>
              {`${word.slice(0, visibleChars)}...${word.slice(-visibleChars)}`}
            </span>
            <IconButton
              component="a"
              href={`https://solscan.io/account/${word}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ ml: 0 }}
              // onClick={handleLinkClick}
            >
              <Tooltip title="View on Solscan">
                <OpenInNew
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
              </Tooltip>
            </IconButton>
            {separator}
          </React.Fragment>
        );
      }

      return (
        <React.Fragment key={key}>
          <span>{word}</span>
          {separator}
        </React.Fragment>
      );
    })}
  </>
);

export const structuredText = (input: string): string =>
  input
    .split(/\b/)
    .map((word) => {
      if (isSolanaAddress(word)) {
        return `[${word.slice(0, 4)}...${word.slice(-4)}](https://solscan.io/account/${word})`; // link addresses
      }
      return word;
    })
    .join("");
