"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AppBar from "@/app/app-bar";
import DialogSlider from "@/app/chat/dialog";
import { useTheme } from "@/app/contexts/Theme";

// const SLOGAN =
//  "Ask any question about Solana on-chain data and get instant, human-readable answers.";
const SLOGAN =
  "Build custom dashboards of Solana DEX activity using natural language.";

const HomePage = () => {
  const { isLarge } = useTheme();
  const query = useSearchParams();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (query.get("error") === "access_denied") {
      setOpen(true);
    }
  }, [query]);

  return (
    <Box sx={{ bgcolor: "black" }}>
      <AppBar />
      <DialogSlider open={open} setOpen={setOpen} />
      {isLarge && (
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          <Grid container sx={{ position: "absolute", top: 0, left: 0 }}>
            <Grid item xs={12} md={9} />
            <Grid item xs={12} md={3}>
              <Paper sx={{ bgcolor: "#3c3a38", height: "100vh" }} />
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ pt: "78px", width: "100%", height: "calc(100vh - 78px)" }}
          >
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                display: "flex",
                direction: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                direction="column"
                spacing={3}
                sx={{ maxWidth: 414, justifyContent: "left" }}
              >
                <Box>
                  <img
                    src="/apegpt-logo-inverted.svg"
                    alt="apegpt logo"
                    height="75px"
                  />
                </Box>
                <Typography
                  color="white"
                  fontWeight={400}
                  fontSize="45px!important"
                  lineHeight="49px!important"
                >
                  {SLOGAN}
                </Typography>
                <Stack direction="row" spacing={2}>
                  {/* <Button
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    variant="contained"
                    sx={{ width: "66%" }}
                    onClick={() => setOpen(true)}
                  >
                    Request Access
                  </Button> */}
                  <Button href="/query" endIcon={<PlayArrowIcon />}>
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                zIndex: 10,
                display: "flex",
                direction: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/5ySluirKR_M?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&modestbranding=1"
                  title="Intro to ApeGPT"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                {/* <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  style={{ width: "100%", height: "100%" }}
                  src="/video/apegpt_homepage_demo_v1.mp4"
                /> */}
                {/* <img src="/example-chat.svg" alt="example chat" width="100%" /> */}
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}
      {!isLarge && (
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          <Stack
            direction="column"
            spacing={6}
            sx={{ pt: 4, height: "100vh", justifyContent: "center" }}
          >
            <Box>
              <img
                src="/apegpt-logo-inverted.svg"
                alt="apegpt logo"
                height="60px"
              />
            </Box>
            <Typography
              color="white"
              fontWeight={400}
              fontSize="24px!important"
              lineHeight="30px!important"
            >
              Ask any question about Solana on-chain data and get instant,
              human-readable answers.
            </Typography>
            <Box sx={{}}>
              <img src="/example-chat.svg" alt="example chat" width="100%" />
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                disableRipple
                disableFocusRipple
                disableTouchRipple
                variant="contained"
                sx={{ width: "66%" }}
                onClick={() => setOpen(true)}
              >
                Request Access
              </Button>
              <Button href="/query" endIcon={<PlayArrowIcon />}>
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Container>
      )}
    </Box>
  );
};

export default HomePage;
