import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const LoginPrompt = ({ slugPath }: { slugPath: string }) => (
  <Container maxWidth="md" sx={{ height: "80vh" }}>
    <Paper elevation={0} sx={{ height: "100%" }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mt: 8, height: "100%" }}
      >
        <Typography>
          Please log in to create, edit and view custom dashboards
        </Typography>
        <Button
          component={Link}
          href={`/api/auth/login?returnTo=${slugPath}`}
          variant="contained"
          size="large"
        >
          Log In
        </Button>
      </Stack>
    </Paper>
  </Container>
);
