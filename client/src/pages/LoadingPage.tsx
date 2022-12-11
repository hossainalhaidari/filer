import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { CircularProgress } from "@mui/material";

export const LoadingPage = () => {
  return (
    <Container>
      <Box
        sx={{
          marginTop: "5em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
};
