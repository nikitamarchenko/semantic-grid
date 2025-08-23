"use client";

import {
  Box,
  Container,
  Paper,
  Popover,
  Slide,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import HighlightedSQL from "@/app/components/SqlView";
import { AppContext } from "@/app/contexts/App";
import { useChatSession } from "@/app/contexts/ChatSession";
import { ThemeContext } from "@/app/contexts/Theme";
import { useTutorial } from "@/app/contexts/Tutorial";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import type { TColumn } from "@/app/lib/types";
import { ChatContainer } from "@/app/query/[id]/chat-container";
import { QueryBox } from "@/app/query/[id]/query-box";
import { DataTable } from "@/app/query/[id]/table";

export interface IInteractiveDashboardProps {
  // user?: Claims | null;
  metadata?: {
    columns: TColumn[]; // Metadata columns
    id: string;
    parents?: string[];
    result?: string;
    sql?: string;
    summary?: string;
    row_count?: number;
    explanation?: any;
  };
  id?: string;
  // error?: any;
  pendingRequest?: { session_id: string; sequence_number: number } | null; // Pending message, if any
  ancestors?: { id: string; name: string }[]; // Ancestors of the current chat
  // successors?: any[]; // Children of the current chat
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pb: 0 }}>{children}</Box>}
    </Box>
  );
};

export const InteractiveDashboard = ({
  id,
  metadata,
  pendingRequest,
  ancestors = [],
}: IInteractiveDashboardProps) => {
  const {
    rows,
    sections,
    pending,
    handleClick,
    handleKeyDown,
    handleChange,
    isLoading,
    mergedSql,
    isReachingEnd,
    isValidating,
    setSize,
    scrollToBottom,
    requestId,
  } = useChatSession();
  const { mode, isLarge } = useContext(ThemeContext);
  const { tab, setTab } = useContext(AppContext);
  const [panel, setPanel] = useState(0);
  const [leftWidth, setLeftWidth] = useLocalStorage<string>(
    `apegpt-left-width-${id}`,
    "",
  );
  const [maxLeftWidth, setMaxLeftWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);
  const prevY = useRef<number | null>(null);
  const prevX = useRef<number | null>(null);
  const maxLeftWidthRef = useRef<number | null>(null);

  const [, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { currentProgressStep } = useTutorial();

  const query = useMemo(() => {
    if (!requestId || !sections || sections.length === 0) {
      return null;
    }
    return sections.find((s) => s.requestId === requestId)?.query || null;
  }, [sections, requestId]);

  useEffect(() => {
    if (currentProgressStep && currentProgressStep[1]?.sessionId) {
      if (currentProgressStep[1].sessionId !== id) {
        router.replace(`/query/${currentProgressStep[1].sessionId}`);
      }
    }
  }, []);

  const gridRef = useRef<HTMLDivElement | null>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
  };

  const hasParent = ancestors?.filter((a) => a.id !== id).length > 0;

  const hasData =
    (Boolean(metadata?.id) &&
      // Boolean(metadata?.row_count) &&
      Boolean(metadata?.sql)) ||
    hasParent;

  useEffect(() => {
    // setLeftWidth(window.innerWidth);
    // console.log("leftWidth", leftWidth);
  }, [leftWidth]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    // console.log("hasData", hasData, "leftWidth", leftWidth);
    if (!hasData) {
      setLeftWidth(""); // Reset left width if no data
    } else if (hasData && !leftWidth) {
      setLeftWidth((window.innerWidth / 3).toString()); // Default to 1/3 of the window width
    }
  }, [hasData, leftWidth]);
  // console.log("leftWidth", metadata?.id, leftWidth);

  useEffect(() => {
    maxLeftWidthRef.current = maxLeftWidth;
  }, [maxLeftWidth]);

  useEffect(() => {
    if (contentRef.current) {
      // const { scrollWidth } = contentRef.current;
      const scrollWidth = window.innerWidth - 300; // Adjust as needed
      setMaxLeftWidth(scrollWidth); // buffer if needed
    }
  }, [sections, contentRef]);

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
    prevX.current = e.clientX;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    const maxWidth = maxLeftWidthRef.current;
    if (!isDragging.current || !containerRef.current || !maxWidth) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;

    const direction =
      prevX.current !== null && e.clientX > prevX.current ? "right" : "left";
    prevX.current = e.clientX;

    const clamped = Math.max(300, offsetX);

    // Prevent stretching beyond content
    if (
      direction === "right" &&
      parseInt(leftWidth) >= maxWidth &&
      offsetX >= parseInt(leftWidth)
    ) {
      return;
    }

    if (hasData) {
      setLeftWidth(Math.min(clamped, maxWidth).toString());
    } else {
      setLeftWidth(clamped.toString());
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    prevY.current = null;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleInfiniteScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const grid = gridRef.current;
      if (!grid) return;
      const scrollable = grid.querySelector(
        ".MuiDataGrid-virtualScroller",
      ) as HTMLDivElement;
      if (
        scrollable &&
        scrollable.scrollTop + scrollable.clientHeight >=
          scrollable.scrollHeight - window.innerHeight * 1.5
      ) {
        if (!isReachingEnd && !isLoading && !isValidating) {
          console.log("Nearing the bottom, loading more data...");
          setSize((s) => s + 1);
        }
      }
    };

    if (!rows || isLoading) {
      return; // No data to attach scroll listener
    }

    const grid = gridRef.current;
    const scrollable = grid?.querySelector(".MuiDataGrid-virtualScroller");
    scrollable?.addEventListener("scroll", handleInfiniteScroll as any);
    // eslint-disable-next-line consistent-return
    return () =>
      scrollable?.removeEventListener("scroll", handleInfiniteScroll as any);
  }, [gridRef, rows, isLoading]);

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    if (pending) {
      setContextMenu(null);
    }
  }, [pending]);

  const onPanelChange = (event: React.SyntheticEvent, newValue: number) => {
    setPanel(newValue);
  };

  // we need to determine if the new query is an ancestor or a successor and set the slide direction accordingly

  return isLarge ? (
    <Box
      ref={containerRef}
      sx={{
        height: hasData ? "calc(100vh - 50px)" : "auto", // let height expand naturally
        marginTop: "50px", // padding to avoid overlap with app bar
        display: "flex",
        flexDirection: "row", // default direction
        width: "100%",
        position: "relative",
        justifyContent: "center",
        overflowX: "hidden",
        overflowY: hasData ? "auto" : "visible", // disable internal scroll
      }}
    >
      {/* Left pane - chat */}
      <Box
        sx={{
          width: hasData ? `${leftWidth}px` : "100%", // full width when standalone
          maxWidth: hasData && maxLeftWidth ? `${maxLeftWidth}px` : "100%",
          flexGrow: hasData ? 1 : 0,
          flexBasis: hasData ? leftWidth : "auto",
          overflow: "visible", // prevent clipping/scrolling
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Container
          ref={contentRef}
          maxWidth="md"
          sx={{ position: "relative", "& .MuiContainer-root": { px: 0 } }}
        >
          <ChatContainer
            id={id || ""}
            hasParent={ancestors.length > 0}
            pendingRequest={pendingRequest}
            hasData={hasData}
            metadata={metadata}
          />
        </Container>
      </Box>

      {/* Divider handle */}
      {hasData && (
        <Box
          component="div"
          // @ts-ignore
          onMouseDown={handleMouseDown}
          sx={{
            width: "3px",
            cursor: "col-resize",
            backgroundColor: mode === "light" ? "grey.200" : "grey.900",
            "&:hover": { backgroundColor: "grey.600" },
          }}
        />
      )}

      {/* Right panel -- table */}
      {hasData && (
        <Box
          sx={{
            // marginTop: "80px", // padding to avoid overlap with app bar
            overflow: "hidden",
            width: `calc(100vw - ${leftWidth}px - 3px)`,
          }}
        >
          <Container
            sx={{ position: "relative", width: "100%", marginTop: 0 }}
            maxWidth={false}
          >
            <Slide
              direction="left"
              in={hasData}
              mountOnEnter
              unmountOnExit
              timeout={400} // customize speed
            >
              <Box>
                <CustomTabPanel value={tab} index={0}>
                  <Box
                    sx={{
                      height: "calc(100vh - 50px)",
                      position: "relative",
                    }}
                    ref={gridRef}
                  >
                    <DataTable />
                    <Popover
                      open={!!contextMenu}
                      onClose={handleClose}
                      anchorReference="anchorPosition"
                      anchorPosition={
                        contextMenu !== null
                          ? {
                              top: contextMenu.mouseY,
                              left: contextMenu.mouseX,
                            }
                          : undefined
                      }
                    >
                      <Paper sx={{ width: 600, px: 3, pb: 3 }}>
                        <QueryBox
                          id={id!}
                          formRef={formRef}
                          inputRef={inputRef}
                          handleClick={handleClick(inputRef, formRef, id!)}
                          handleKeyDown={handleKeyDown(inputRef, formRef, id!)}
                          handleChange={handleChange(inputRef)}
                        />
                      </Paper>
                    </Popover>
                  </Box>
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={1}>
                  <Box
                    sx={{
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 50px)",
                    }}
                  >
                    <Box
                      sx={{
                        "& p": {
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          color: "text.secondary",
                        },
                      }}
                    >
                      <HighlightedSQL
                        code={mergedSql || "No SQL available for this query."}
                      />
                    </Box>
                  </Box>
                </CustomTabPanel>
              </Box>
            </Slide>
          </Container>
        </Box>
      )}
    </Box>
  ) : (
    <Box
      ref={containerRef}
      sx={{
        height: "calc(100vh)", // let height expand naturally
        paddingTop: "50px", // padding to avoid overlap with app bar
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Stack direction="column">
        <Tabs
          centered
          value={panel}
          aria-label="chat and data tabs"
          onChange={onPanelChange}
        >
          <Tab label="Chat" />
          <Tab label="Grid" />
          <Tab label="Query" />
        </Tabs>
        <Container
          disableGutters
          sx={{
            padding: 0.5,
            height: "calc(100vh)",
            overflow: "auto",
          }}
        >
          <CustomTabPanel value={panel} index={0}>
            <Box>
              <Container
                disableGutters
                ref={contentRef}
                maxWidth="md"
                sx={{ position: "relative", "& .MuiContainer-root": { px: 0 } }}
              >
                <ChatContainer
                  id={id || ""}
                  hasParent={ancestors.length > 0}
                  pendingRequest={pendingRequest}
                  hasData={hasData}
                  metadata={metadata}
                />
              </Container>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={panel} index={1}>
            {hasData && (
              <Box>
                <Container disableGutters maxWidth={false}>
                  <Box ref={gridRef}>
                    <DataTable />
                  </Box>
                </Container>
              </Box>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={panel} index={2}>
            <Box
              sx={{
                width: "100%",
                overflow: "auto",
              }}
            >
              <Box
                sx={{
                  "& p": {
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    color: "text.secondary",
                  },
                }}
              >
                <HighlightedSQL
                  code={mergedSql || "No SQL available for this query."}
                />
              </Box>
            </Box>
          </CustomTabPanel>
        </Container>
      </Stack>
    </Box>
  );
};
