"use client";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Button, Container, Grid, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    <Box sx={{ bgcolor: "white" }}>
      {/* <AppBar /> */}
      <DialogSlider open={open} setOpen={setOpen} />
      {isLarge && (
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            height: "100vh",
          }}
        >
          <Grid
            container
            sx={{ pt: "78px", width: "100%", height: "calc(100vh - 78px)" }}
          >
            <Grid
              item
              xs={12}
              md={12}
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
                sx={
                  {
                    // maxWidth: 414,
                    // justifyContent: "left"
                  }
                }
              >
                <Box>
                  <img
                    src="/semantic_grid.png"
                    alt="semantic grid logo"
                    // height="75px"
                  />
                </Box>
                {/* <Typography
                  color="white"
                  fontWeight={400}
                  fontSize="45px!important"
                  lineHeight="49px!important"
                >
                  {SLOGAN}
                </Typography> */}
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
                  <Button
                    href="/query"
                    endIcon={<PlayArrowIcon />}
                    color="inherit"
                  >
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            {/* <Grid
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
              </Box>
            </Grid> */}
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
            <Box sx={{ maxWidth: "100%" }}>
              <img
                width="100%"
                src="/semantic_grid.png"
                alt="semantic grid logo"
                // height="60px"
              />
            </Box>
            {/* <Typography
              color="white"
              fontWeight={400}
              fontSize="24px!important"
              lineHeight="30px!important"
            >
              Ask any question about Solana on-chain data and get instant,
              human-readable answers.
            </Typography> */}
            {/* <Box sx={{}}>
              <img src="/example-chat.svg" alt="example chat" width="100%" />
            </Box> */}
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
              <Button href="/query" endIcon={<PlayArrowIcon />} color="inherit">
                Continue
              </Button>
            </Stack>
          </Stack>
        </Container>
      )}
    </Box>
  );
};

export default HomePage;
