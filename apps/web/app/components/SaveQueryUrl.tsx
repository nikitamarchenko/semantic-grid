import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";

import { addQueryToUserDashboard } from "@/app/actions";
import type { TChatSection } from "@/app/lib/types";

const SaveQueryUrl = ({ section }: { section: TChatSection }) => (
  <Tooltip title="Add to user dashboard">
    <IconButton
      size="small"
      aria-label="save query"
      onClick={async (event) => {
        event.stopPropagation();

        const queryUid = section.query?.query_id;
        console.log("save query Uid", queryUid);
        if (!queryUid) return;

        await addQueryToUserDashboard({ queryUid });
      }}
    >
      <Box
        component={PlaylistAddIcon}
        sx={{
          width: 23,
          height: 23,
          color: "text.secondary",
        }}
      />
    </IconButton>
  </Tooltip>
);

export default SaveQueryUrl;
