import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormEvent, useState } from "react";
import { Alert, AlertTitle, InputAdornment } from "@mui/material";
import {
  AccountCircle as UsernameIcon,
  Key as PasswordIcon,
} from "@mui/icons-material";

import { loginApi } from "~/api";
import { useAuthContext } from "~/stores";
import { AuthStatus } from "~/utils/types";
import { setToken } from "~/utils/storage";

export const LoginPage = () => {
  const { setAuthStatus } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(false);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const username = data.get("username")?.toString() ?? "";
    const password = data.get("password")?.toString() ?? "";

    try {
      const res = await loginApi(username, password);

      if (res) {
        setToken(res.token);
        setAuthStatus(AuthStatus.AUTHORIZED);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={onLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <UsernameIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {error && (
            <Alert severity="warning">
              <AlertTitle>Login Failed!</AlertTitle>
              Please check your username and password.
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};
