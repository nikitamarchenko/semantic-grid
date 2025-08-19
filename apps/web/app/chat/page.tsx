import { Container, Paper, Typography } from "@mui/material";

const HomePage = async () => (
  <Container
    maxWidth={false}
    sx={{
      width: "100%",
      height: "calc(100vh - 78px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Paper elevation={0}>
      <Typography variant="overline">Loading...</Typography>
    </Paper>
  </Container>
);

export default HomePage;
