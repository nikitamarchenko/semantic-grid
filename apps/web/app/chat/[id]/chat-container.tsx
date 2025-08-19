"use client";

import type { Claims } from "@auth0/nextjs-auth0";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  alpha,
  Avatar,
  Box,
  Button,
  darken,
  Fab,
  Grid,
  IconButton,
  lighten,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { createRequest, updateRequest } from "@/app/actions";
import { LegacyMessage, StructuredMessage } from "@/app/chat/[id]/message";
import { ConstantMain, Main } from "@/app/chat/[id]/responsive-main";
import { increaseTrialCount } from "@/app/chat/actions";
import { contextDrawerWidth, drawerWidth } from "@/app/chat/app-bar";
import DialogSlider from "@/app/chat/dialog";
import { StatusIndicator } from "@/app/components/dancing-balls";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import {
  examples,
  internalErrorMessage,
  newPendingMessage,
  pollForResponse,
  responseToPendingBotMessage,
} from "@/app/helpers/chat";
import { useAppUser } from "@/app/hooks/useAppUser";
import { useUserSessions } from "@/app/hooks/useUserSessions";
import type { TChat, TChatMessage } from "@/app/lib/types";

const splitText = (input: string) => {
  // Regular expression to match ```csv...``` blocks and <div>...</div> blocks
  const regex = /```csv([\s\S]*?)```|```text([\s\S]*?)```|<div>(.*?)<\/div>/g;

  const result: string[] = [];
  let lastIndex = 0;

  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(input)) !== null) {
    // Add the text before the matched block
    if (match.index > lastIndex) {
      result.push(input.slice(lastIndex, match.index).trim());
    }

    if (match[1] !== undefined) {
      // CSV block
      result.push(`csv${match[1]}`.trim());
    } else if (match[2] !== undefined) {
      // TEXT block
      result.push(`txt${match[2]}`.trim());
    } else if (match[3] !== undefined) {
      // <div> block
      result.push(`div${match[3]}`.trim());
    }

    // Update lastIndex to the end of the matched block
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < input.length) {
    result.push(input.slice(lastIndex).trim());
  }

  return result;
};

export interface IChatContainerProps {
  user: Claims | null;
  chat: TChat | null;
  // session?: any;
  id?: string;
  error?: any;
}

const ChatContainer = ({ id, error, chat, user }: IChatContainerProps) => {
  const theme = useTheme();
  const { isLarge, mode } = useContext(ThemeContext);
  const { dialogOpen, setDialogOpen } = useContext(AppContext);
  const isLargeOrLess = useMediaQuery(theme.breakpoints.down("xl"));

  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollBox = useRef(null);
  const scroller = useRef(null);

  const [showButton, setShowButton] = useState(false);
  // const [session, setSession] = useState<any>();
  // const [chat, setChat] = useState<TChat | null>();
  const [messages, setMessages] = useState<TChatMessage[]>(
    chat?.messages || [],
  );
  const [prompt, setPrompt] = useState<string>();
  const bubbles = useRef<Array<HTMLDivElement | null>>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [pending, setPending] = useState(false);
  const [inputWidth, setInputWidth] = useState<number>(0);
  const [mainMid, setMainMid] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState(0);
  const { canContinueAsAuthUser, canContinueAsGuest, isLoading } = useAppUser();
  const {
    data: sessions,
    isLoading: sessionsArLoading,
    mutate,
  } = useUserSessions();
  const {
    model,
    flow,
    db,
    navOpen,
    contextOpen,
    setContextOpen,
    currentMessage,
    setCurrentMessage,
  } = useContext(AppContext);

  useEffect(() => {
    if (!isLoading) {
      if (!canContinueAsAuthUser && !canContinueAsGuest) {
        setDialogOpen(true);
      } else {
        setDialogOpen(false);
      }
    }
  }, [canContinueAsAuthUser, canContinueAsGuest, isLoading]);

  /*
  useEffect(() => {
    if (!isLoading && !sessionsArLoading && sessions) {
      console.log("* sessions *", id, sessions.length);
      const session = sessions.find((s: any) => s.session_id === id);
      if (session) {
        // setSession(session);
      } else {
        getOrCreateSession({
          id,
          name: "chat1",
          tags: "test",
        })
          .catch((e) => {
            // expired session or something bad upstream
            error = e.message === "fetch failed" ? "Server Error" : e.message;
            return { session: null, allSessions: [] };
          })
          .then(({ session }) => setSession(session));
      }
    }
  }, [isLoading, sessionsArLoading, sessions, id]);

  useEffect(() => {
    if (session) {
      // getCurrentChat(session).then((chat) => setChat(chat));
    }
  }, [session]);
  */
  /*
  useEffect(() => {
    if (session) {
      console.log("load chat", session.name);
      getAllRequests({ sessionId: session.session_id })
        .then((reqs) => {
          console.log("requests", reqs);
          setMessages(
            reqs.flatMap((r: any) => [
              responseToHumanMessage(r),
              responseToBotMessage(r),
            ]),
          );
        })
        .catch(console.error);
    }
  }, [session, chat]);
   */

  const isNewChat = false; // user && messages.length === 1;

  useEffect(() => {
    if (chat) {
      console.log("chat messages", chat.messages);
      setMessages(chat.messages);
    }
  }, [chat]);

  const delta =
    (drawerWidth * (navOpen ? 1 : 0) -
      contextDrawerWidth * (contextOpen ? 1 : 0)) /
    2;

  // Check if the user has scrolled away from the bottom
  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setShowButton(!isAtBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function adjustInputWidth() {
      if (containerRef.current) {
        // console.log("input width", containerRef.current.offsetWidth);
        setInputWidth(containerRef.current.offsetWidth);
      }
    }
    if (!containerRef.current) return () => {};

    const resizeObserver = new ResizeObserver(() => {
      adjustInputWidth();
    });

    resizeObserver.observe(containerRef.current);

    // Adjust width initially
    adjustInputWidth();

    // Adjust width on window resize
    // window.addEventListener("resize", adjustInputWidth);

    // Cleanup on unmount
    return () => {
      // window.removeEventListener("resize", adjustInputWidth);
      resizeObserver.disconnect();
    };
  }, [containerRef.current, navOpen, contextOpen]);

  useEffect(() => {
    if (containerRef.current) {
      const mid =
        (containerRef.current?.offsetLeft || 0) +
        delta +
        containerRef.current.offsetWidth / 2;
      setMainMid(mid);
    }
  }, [containerRef?.current, navOpen, contextOpen, mainRef.current]);

  useEffect(() => {
    function adjustMainWidth() {
      if (containerRef.current) {
        const mid =
          (containerRef.current?.offsetLeft || 0) +
          delta +
          containerRef.current.offsetWidth / 2;
        setMainMid(mid);
      }
    }
    if (!mainRef.current) return () => {};

    const resizeObserver = new ResizeObserver(() => {
      adjustMainWidth();
    });

    resizeObserver.observe(mainRef.current);
    // Adjust width initially
    adjustMainWidth();

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [mainRef.current, containerRef.current, navOpen, contextOpen]);

  useEffect(() => {
    if (prompt) {
      setMessages((r) => [...r, newPendingMessage(prompt)]);
      setPending(true);
      createRequest({
        request: prompt,
        flow: flow.value,
        model: model.value,
        db: db.value,
        sessionId: id,
      })
        .then((request) => {
          console.log("request", request);
          setMessages((r) => [
            ...r,
            responseToPendingBotMessage(request as any),
          ]);
          return request;
        })
        .then((req) => {
          // scroll into view
          setTimeout(
            () =>
              document.body.scrollIntoView({
                block: "end",
                behavior: "smooth",
              }),
            100,
          );
          return req;
        })
        // wait for response by polling
        // @ts-ignore
        .then(({ session_id, status, response, sequence_number }) => {
          const { onStatus, waitForDone } = pollForResponse({
            sessionId: session_id,
            seqNum: sequence_number,
          });
          onStatus((status) => {
            if (status.status === "Intent") {
              mutate();
            }
            setMessages((r) => [
              ...r.slice(0, r.length - 1),
              { ...(r.slice(-1)[0] || { uid: "" }), ...(status || {}) },
            ]);
          });
          return waitForDone;
        })
        .then((resp: TChatMessage) => {
          // setPending(false);
          setMessages((r) => [...r.slice(0, r.length - 1), resp]);
        })
        .then((_) => increaseTrialCount())
        // .then(() => setTimeout(removeNewLabel, 1000))
        .then(() => setPrompt(""))
        .then(() => setPending(false))
        .then(() =>
          setTimeout(
            () =>
              document.body.scrollIntoView({
                block: "end",
                behavior: "smooth",
              }),
            500,
          ),
        )
        .catch((e) => {
          console.error("error response", e);
          setPending(false);
          setMessages((r) => [
            ...r.slice(0, r.length - 1),
            internalErrorMessage(),
          ]);
        });
    }
  }, [prompt]);

  useEffect(() => {
    if (currentMessage) {
      const elem = document.getElementById(currentMessage.uid);
      if (elem) {
        elem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [currentMessage]);

  useEffect(() => {
    if (chat && messages.length > 1) {
      // console.log("session", session);
      document.body.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [id, chat, messages]);

  useEffect(() => {
    bubbles.current = bubbles.current.slice(0, messages.length);
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      // console.log("input height", inputRef.current.offsetHeight);
      setInputHeight(inputRef.current.offsetHeight);
    }
  }, [inputRef?.current]);

  const fabStyles = useMemo(
    () => ({
      position: "absolute",
      bottom: `calc(${inputHeight}px + 2rem)`,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
    }),
    [inputHeight],
  );

  /*
  useEffect(() => {
    if (scroller.current) {
      const resizeObserver = new ResizeObserver((e) => {
        if (scrollBox.current && !currentMessage) {
          // document.body.scrollIntoView({ block: "end", behavior: "smooth" });
        }
      });
      resizeObserver.observe(scroller.current as HTMLUListElement);
      return () => resizeObserver.disconnect();
    }
    return () => {};
  }, [scrollBox.current, scroller.current, currentMessage]);
   */

  const handleOnChange = (e: any) => {
    // setQuestion(e.target.value);
    if (inputRef.current) {
      // Update value without triggering re-render
      inputRef.current.value = e.target.value;
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    setPrompt(inputRef.current?.value || "");
    if (formRef.current) {
      formRef.current.reset();
      // inputRef.current.value = "";
    }
  };

  const onFinishedTyping = () => {
    if (!showExamples) {
      // setShowExamples(true);
    }
    if (scrollBox.current) {
      // console.log("finished typing");
      document.body.scrollIntoView({ block: "end" });
    }
  };

  const onThumbUpClick = (msg: TChatMessage) => async () => {
    await updateRequest({
      requestId: msg.uid,
      data: { rating: 10, review: "" },
    });
    setMessages((r) =>
      r.map((m) => {
        if (m.uid === msg.uid) {
          return { ...m, rating: 10 };
        }
        return m;
      }),
    );
    const current = messages.find((m) => m.uid === msg.uid);
    setCurrentMessage(current ? { ...current, rating: 10 } : null);
  };

  const onThumbDownClick = (msg: TChatMessage) => async () => {
    await updateRequest({
      requestId: msg.uid,
      data: { rating: 1, review: "" },
    });
    setMessages((r) =>
      r.map((m) => {
        if (m.uid === msg.uid) {
          return { ...m, rating: 1 };
        }
        return m;
      }),
    );
    const current = messages.find((m) => m.uid === msg.uid);
    setCurrentMessage(current ? { ...current, rating: 1 } : null);
  };

  const isCurrentMessage = (message: TChatMessage) =>
    message.uid === currentMessage?.uid;

  const selectCurrentMessage = (message: TChatMessage) => () => {
    if (!isCurrentMessage(message) && !message.isError) {
      setCurrentMessage(message);
      setContextOpen(true);
    } else if (!message.isError) {
      if (isLarge) {
        setCurrentMessage(null);
        setContextOpen(false);
      } else {
        setContextOpen(true);
      }
    }
  };

  const getBgColor = (msg: TChatMessage) => {
    if (!msg.isBot) return mode === "dark" ? "grey.800" : "#E9e8e6";
    if (isCurrentMessage(msg)) {
      return mode === "dark"
        ? darken(theme.palette.primary.dark, 0.6)
        : lighten(theme.palette.primary.dark, 0.6);
    }
    return "unset";
  };

  const getPlaceholder = () => {
    if (!canContinueAsAuthUser && !canContinueAsGuest)
      return "You need to request access to continue";
    if (error) return "Currently unavailable";
    return user ? "Ask me anything" : "Please log in to chat with me";
  };

  const MainContainer = isLarge ? Main : ConstantMain;

  const handleKeyDown = (event: KeyboardEvent | any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setPrompt(inputRef.current?.value || "");
      if (formRef.current) {
        formRef.current.reset();
        // inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <MainContainer open={navOpen} contextOpen={contextOpen} ref={mainRef}>
        <DialogSlider
          open={dialogOpen}
          setOpen={setDialogOpen}
          email={user?.email}
        />
        <Box
          sx={{
            flex: 1,
            //
            overflowY: "auto",
          }}
        >
          <Box
            ref={containerRef}
            sx={{
              margin: "auto",
              width: `calc(100% - ${drawerWidth * (navOpen ? 1 : 0) + contextDrawerWidth * (contextOpen ? 1 : 0)}px)`,
              maxWidth: isLargeOrLess ? "900px" : "1280px",
              paddingBottom: "64px",
              overflowY: "hidden",
            }}
          >
            {!chat && (
              <Stack
                component={Paper}
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ height: "80vh" }}
              >
                <Typography variant="overline">Loading messages...</Typography>
              </Stack>
            )}
            {chat && (
              <List
                ref={scroller}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Grid container spacing={4}>
                  {messages.map((resp, idx) => (
                    <Grid
                      item
                      key={resp.uid}
                      sx={{
                        width: "100%",
                        textAlign: !resp.isBot
                          ? "-webkit-right"
                          : "-webkit-left",
                      }}
                    >
                      <ListItem
                        component={Paper}
                        componentsProps={{ root: {} }}
                        elevation={mode === "dark" ? 1 : 0}
                        sx={{
                          cursor: resp.isBot ? "pointer" : "unset",
                          width: "fit-content",
                          backgroundColor: getBgColor(resp),
                          padding: "24px 40px",
                          alignItems: "start",
                          justifyContent: "flex-end",
                          maxWidth: "100%",
                          overflowX: "auto",
                          borderRadius: !resp.isBot
                            ? "16px 0 16px 16px"
                            : "0 16px 16px 16px",
                        }}
                      >
                        {resp.isBot && (
                          <ListItemAvatar sx={{}}>
                            <Avatar
                              sx={{
                                bgcolor: resp.isBot ? "transparent" : "green",
                              }}
                            >
                              <Image
                                src="/apegpt-logo-mark.svg"
                                width={40}
                                height={40}
                                alt=""
                              />
                            </Avatar>
                          </ListItemAvatar>
                        )}
                        {!resp.isBot && <Box sx={{ flexGrow: 1 }} />}
                        <ListItemText
                          secondaryTypographyProps={{
                            component: "div",
                          }}
                          secondary={
                            resp.isBot &&
                            !resp.isPending &&
                            !resp.isError && (
                              <Stack
                                direction="row"
                                sx={{ mr: 0, justifyContent: "right" }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={onThumbDownClick(resp)}
                                >
                                  <ThumbDownIcon
                                    color={
                                      (resp?.rating || 10) < 5
                                        ? "warning"
                                        : "disabled"
                                    }
                                    fontSize="small"
                                  />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={onThumbUpClick(resp)}
                                >
                                  <ThumbUpIcon
                                    color={
                                      (resp?.rating || 0) >= 5
                                        ? "warning"
                                        : "disabled"
                                    }
                                    fontSize="small"
                                  />
                                </IconButton>
                              </Stack>
                            )
                          }
                          sx={{
                            textAlign: resp.isBot ? undefined : "right",
                          }}
                        >
                          {resp.isBot && resp.isPending && (
                            <StatusIndicator text={resp.status} />
                          )}
                          {resp.isBot && (
                            <Box
                              id={resp.uid}
                              onClick={selectCurrentMessage(resp)}
                              sx={{
                                "& p:has(em:only-child)": {
                                  marginTop: "1rem",
                                },
                                "& li": {
                                  fontSize: "small",
                                  marginLeft: "2rem",
                                },
                                "& hr": {
                                  border: "none",
                                },
                              }}
                            >
                              {!resp.isStructured &&
                                resp.text &&
                                splitText(resp.text).map((text) =>
                                  LegacyMessage({ uid: resp.uid, text }),
                                )}
                              {resp.isStructured && (
                                <StructuredMessage resp={resp} />
                              )}
                            </Box>
                          )}
                          {!resp.isBot && resp.text}
                        </ListItemText>

                        {!resp.isBot && user && false && (
                          <ListItemAvatar sx={{ textAlign: "-webkit-right" }}>
                            <Avatar
                              src={user?.picture || ""}
                              sx={{
                                bgcolor: resp.isBot
                                  ? "grey"
                                  : theme.palette.primary.main,
                              }}
                            >
                              {!user?.picture && (
                                <PersonIcon fontSize="small" />
                              )}
                            </Avatar>
                          </ListItemAvatar>
                        )}
                      </ListItem>
                    </Grid>
                  ))}
                  {!user && (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="info"
                          href="/api/auth/login"
                          sx={{ borderRadius: 25 }}
                        >
                          Login
                        </Button>
                      </Box>
                    </Grid>
                  )}
                  {isNewChat && showExamples && (
                    <>
                      <Grid item xs={0.7} />
                      {examples.map((example) => (
                        <Grid item key={example} xs={12} lg={3}>
                          <Paper
                            sx={{
                              borderRadius: "12px",
                              padding: "1rem",
                              margin: "1rem",
                              borderColor: "palette.text.primary",
                              border: 0.5,
                              cursor: "pointer",
                            }}
                            onClick={() => setPrompt(example)}
                          >
                            <Typography variant="body2">{example}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </>
                  )}
                </Grid>
              </List>
            )}
          </Box>
        </Box>
      </MainContainer>
      {messages.length === 0 && chat && (
        <Avatar
          src="/apegpt-logo-mark.svg"
          sx={{
            position: "fixed",
            top: "50%",
            left: `${mainMid}px`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.3s ease", // Smooth animation
            filter: "grayscale(80%)",
          }}
        />
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: `calc(${mainMid}px - ${inputWidth / 2}px)`,
          width: `calc(${mainRef?.current?.offsetWidth || 0}px)`,
          backgroundColor:
            mode === "dark"
              ? theme.palette.background.default
              : theme.palette.background.default,
          height: `calc(${inputRef?.current?.offsetHeight || 100}px + 2rem)`,
        }}
      />

      <Box
        sx={{
          margin: "auto",
          position: "fixed",
          // transform: "unset",
          bottom: "1rem",
          left: `calc(${mainMid}px - ${inputWidth / 2}px + 1.5rem)`,
          transition: "left 0.3s ease", // Smooth animation
        }}
      >
        <Fab
          sx={{
            visibility: showButton ? "visible" : "hidden",
            opacity: showButton ? 1 : 0,
            bgcolor:
              mode === "dark" ? alpha("#424242", 0.8) : alpha("#E9e8e6", 0.5),
            boxShadow: "none", // Remove shadow
            "&:hover": {
              bgcolor: mode === "dark" ? alpha("#424242", 0.8) : undefined,
              boxShadow: "none", // Remove shadow on hover
            },
          }}
          size="small"
          onClick={() =>
            document.body.scrollIntoView({ block: "end", behavior: "smooth" })
          }
          style={fabStyles as any}
          aria-label="Scroll to Bottom"
        >
          <KeyboardArrowDownIcon />
        </Fab>
        <Box
          component="form"
          ref={formRef}
          onSubmit={handleClick}
          sx={{
            width: `calc(${inputWidth}px - 3rem)`,
            maxWidth: `calc(${inputWidth}px - 3rem)`,
          }}
        >
          <OutlinedInput
            id="question-input"
            ref={inputRef}
            fullWidth
            name="question"
            multiline
            // defaultValue="" // Make it uncontrolled
            onChange={handleOnChange}
            disabled={
              !user ||
              error ||
              pending ||
              (!canContinueAsGuest && !canContinueAsAuthUser)
            }
            placeholder={getPlaceholder()}
            onKeyDown={handleKeyDown}
            sx={{
              width: "100%",
              borderRadius: "24px",
              pl: 2,
              // bgcolor: mode === "dark" ? "grey.800" : "#E9e8e6",
            }}
            endAdornment={
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  type="submit"
                  disabled={!inputRef?.current?.value}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </Stack>
            }
          />
        </Box>
      </Box>
    </>
  );
};

export default ChatContainer;
