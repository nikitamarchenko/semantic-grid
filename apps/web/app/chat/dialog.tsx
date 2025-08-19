"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  OutlinedInput,
  Slide,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import type { ReactElement, Ref } from "react";
import { forwardRef, useState } from "react";

import { requestAccess } from "@/app/actions";

// eslint-disable-next-line react/display-name
const SlideDown = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
  ) => <Slide direction="down" ref={ref} {...props} />,
);

// eslint-disable-next-line react/display-name
const SlideUp = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement<any, any>;
    },
    ref: Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />,
);

const DialogSlider = ({ open, setOpen, email }: any) => {
  const [userEmail, setUserEmail] = useState(email);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        fullScreen
        TransitionComponent={SlideDown}
        PaperProps={{ sx: { bgcolor: "#EF8626" } }}
        sx={{ paddingTop: "78px!important" }}
        onClose={() => setOpen(false)}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "0",
              transform: "translate(0, -50%)",
            }}
          >
            <img alt="" src="/hero-half.svg" />
          </Box>
          <Stack
            direction="column"
            spacing={1}
            sx={{
              position: "relative",
              alignItems: "left",
              bgcolor: "black",
              padding: "2rem",
            }}
          >
            <Box sx={{}}>
              <IconButton
                disableRipple
                sx={{ position: "absolute", top: "-12px", right: "-60px" }}
                onClick={() => setOpen(false)}
              >
                <CloseIcon
                  fontSize="large"
                  fontWeight="bold"
                  sx={{ color: "black" }}
                />
              </IconButton>
            </Box>
            <Box sx={{ pb: 4 }}>
              <img
                src="/apegpt-logo-inverted.svg"
                alt="apegpt logo"
                height="75px"
              />
            </Box>
            <Typography color="white">Request Access</Typography>
            <Box
              sx={{
                width: "335px",
                borderColor: "white",
                "& fieldset": { borderColor: "white!important" },
                "& input::placeholder": {
                  fontWeight: 200,
                },
              }}
            >
              <OutlinedInput
                id="first-name"
                name="first-name"
                size="small"
                placeholder="First Name *"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                sx={{
                  mt: 2,
                  color: "white",
                }}
              />
              <OutlinedInput
                id="last-name"
                name="last-name"
                size="small"
                placeholder="Last Name *"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                sx={{ mt: 2, color: "white" }}
              />
              <OutlinedInput
                id="email"
                name="email"
                size="small"
                type="email"
                fullWidth
                placeholder="Email *"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={!!email}
                required
                sx={{ mt: 2, color: "white" }}
              />
              <OutlinedInput
                id="about"
                name="about"
                size="small"
                multiline
                fullWidth
                required
                placeholder="Tell us about yourself and why are you interested in apegpt.ai? *"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mt: 2, color: "white" }}
              />
              <Button
                type="button"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log("submitting");
                  requestAccess({
                    email: userEmail,
                    name: `${firstName} ${lastName}`,
                    description,
                  })
                    .then(() => setOpen(false))
                    .then(() => setConfirmationOpen(true));
                }}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={confirmationOpen}
        autoHideDuration={5000}
        onClose={() => setConfirmationOpen(false)}
        message="Access Request has been sumbitted"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUp}
      />
    </>
  );
};

export default DialogSlider;
