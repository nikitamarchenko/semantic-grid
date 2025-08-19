"use client";

import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Drawer as MuiDrawer,
  FormControl,
  IconButton,
  Rating,
  Stack,
  styled,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";

import { updateRequest } from "@/app/actions";
import { contextDrawerWidth } from "@/app/chat/app-bar";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import type { TChatMessage } from "@/app/lib/types";

const StyledTypography = styled(Typography)({
  gutterBottom: true,
  fontSize: "small!important",
  fontFamily: "monospace",
  whiteSpace: "pre-line",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const ContextDrawer = () => {
  const {
    contextOpen: open,
    setContextOpen: setOpen,
    currentMessage,
    setCurrentMessage,
  } = useContext(AppContext);
  const { isLarge, iOS } = useContext(ThemeContext);
  const pathName = usePathname();
  const [rating, setRating] = React.useState<number | null>(
    currentMessage?.rating || 0,
  );
  const [comment, setComment] = React.useState<string>(
    currentMessage?.comment || "",
  );
  const [pending, setPending] = React.useState(false);

  useEffect(() => {
    setRating(currentMessage?.rating || 0);
    setComment(currentMessage?.comment || "");
  }, [currentMessage?.rating, currentMessage?.comment]);

  useEffect(() => {
    if (isLarge) return;
    if (open) {
      document.body.style.overflow = "hidden";
      // if (document.getElementsByTagName("main")[0]) {
      document.getElementsByTagName("html")[0]!.style.overflow = "hidden";
      // }
    } else {
      document.body.style.overflow = "auto";
      // document.getElementsByTagName("main")[0]!.style.overflow = "auto";
      document.getElementsByTagName("html")[0]!.style.overflow = "auto";
    }
  }, [open, isLarge]);

  const handleDrawerClose = () => {
    setOpen(false);
    setCurrentMessage(null);
  };

  const onRatingChange = (
    event: React.SyntheticEvent,
    newValue: number | null,
  ) => {
    setRating(newValue);
  };

  const onUpdateRequest = (message: TChatMessage) => async () => {
    const requestId = message.uid.split(":")[0];
    try {
      setPending(true);
      // console.log("Updating", message);
      await updateRequest({
        sessionId: pathName.split("/").pop(),
        requestId,
        data: {
          rating: rating || 0,
          review: comment,
        },
      });
    } catch (e) {
      console.error("Update error", e);
    } finally {
      setPending(false);
    }
  };

  const Drawer = isLarge ? MuiDrawer : SwipeableDrawer;

  return (
    <>
      <DrawerHeader />
      <Drawer
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: contextDrawerWidth,
            maxWidth: "100vw",
            boxSizing: "border-box",
            border: "none",
            borderTopLeftRadius: isLarge ? 0 : "24px",
            borderTopRightRadius: isLarge ? 0 : "24px",
            backgroundColor: isLarge ? "transparent" : "#181818",
          },
        }}
        variant="persistent"
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor={isLarge ? "right" : "bottom"}
        open={open}
        onOpen={() => {}}
        onClose={handleDrawerClose}
      >
        <Container sx={{ pt: "18px" }}>
          <Stack
            direction="column"
            sx={{
              mt: 8,
              mb: 2,
              padding: isLarge ? 4 : 1,
              border: "solid 2px",
              borderColor: isLarge ? "primary.main" : "transparent",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 2 }}>
              <IconButton onClick={handleDrawerClose}>
                <Close />
              </IconButton>
            </Box>
            <StyledTypography>UID: {currentMessage?.uid}</StyledTypography>
            <StyledTypography>SQL:</StyledTypography>
            <StyledTypography>{currentMessage?.sql}</StyledTypography>
            <FormControl fullWidth sx={{ mt: 4 }}>
              <Typography
                component="legend"
                variant="body2"
                fontSize="0.8rem"
                fontFamily="monospace"
              >
                Rating
              </Typography>
              <Rating
                name="response-rating"
                max={10}
                precision={1}
                value={rating}
                sx={{ mb: 3 }}
                onChange={onRatingChange}
              />
              <TextField
                id="response-review"
                label="Review"
                value={comment}
                multiline
                rows={4}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  sx: { fontSize: "0.8rem", fontFamily: "monospace" },
                }}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant="contained"
                disabled={!currentMessage || pending}
                type="submit"
                color="primary"
                sx={{ mt: 3 }}
                onClick={onUpdateRequest(currentMessage as TChatMessage)}
              >
                {pending ? "Updating..." : "Update"}
              </Button>
            </FormControl>
          </Stack>
        </Container>
      </Drawer>
    </>
  );
};

export default ContextDrawer;
