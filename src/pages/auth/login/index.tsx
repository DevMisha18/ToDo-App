import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type signInValues } from "@/shared/schemas/auth";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import { loginUser } from "@/shared/lib/loginUser";
import { useDispatch } from "react-redux";
import { setSession } from "@/features/auth/authSlice";

export default function SignInForm() {
  const dispatch = useDispatch();
  const [generalError, setGeneralError] = useState("");
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<signInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<signInValues> = async (data) => {
    setGeneralError("");
    const { session, error } = await loginUser(data);

    if (error) {
      setGeneralError(error);
      return;
    }

    dispatch(setSession(session));
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "80%", maxWidth: { xs: 350, lg: 450 } }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h2">Sign In</Typography>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                variant="filled"
                label="email"
                fullWidth
                error={!!error}
                helperText={error?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                variant="filled"
                label="confirm password"
                fullWidth
                error={!!error}
                helperText={error?.message}
                type="password"
                {...field}
              />
            )}
          />
          {generalError && (
            <Typography variant="subtitle2" color="error">
              {generalError}
            </Typography>
          )}
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="secondary"
            type="submit"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
          <Typography variant="subtitle2">
            Don&apos;t have an account yet? Sign up{" "}
            <Link component={NextLink} href="/auth/register">
              here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
