import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";

import { validateApi } from "~/api";
import { FilesPage, LoadingPage, LoginPage } from "~/pages";
import { useAuthContext } from "~/stores";
import { AuthStatus } from "~/utils/types";

const App = () => {
  const { authStatus, setAuthStatus } = useAuthContext();
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    validateApi()
      .then((res) => {
        setAuthStatus(res ? AuthStatus.AUTHORIZED : AuthStatus.UNAUTHORIZED);
      })
      .catch(() => {
        setAuthStatus(AuthStatus.UNAUTHORIZED);
      });
  }, []);

  const content = () => {
    switch (authStatus) {
      case AuthStatus.AUTHORIZED:
        return <FilesPage />;
      case AuthStatus.UNAUTHORIZED:
        return <LoginPage />;
      case AuthStatus.AUTHORIZING:
        return <LoadingPage />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <>{content()}</>
    </ThemeProvider>
  );
};

export default App;
