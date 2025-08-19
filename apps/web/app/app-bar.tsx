"use client";

import { AppBar, Stack, Toolbar } from "@mui/material";
import React from "react";

const ApplicationBar = () => (
  <AppBar position="fixed" elevation={0} sx={{ bgcolor: "black" }}>
    <Toolbar sx={{ height: "78px" }}>
      <Stack
        direction="row"
        sx={{ flexGrow: 1, justifyContent: "right" }}
        spacing={0.5}
      />
    </Toolbar>
  </AppBar>
);

export default ApplicationBar;
