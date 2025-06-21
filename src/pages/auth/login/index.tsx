import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type signInValues } from "@/schemas/auth";
import { Box, Paper, TextField, Button, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import type { ZodTreeFieldError } from "@/types/zod";

export default function SignInForm() {
  const [generalError, setGeneralError] = useState("");
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = useForm<signInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<signInValues> = async (data) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let serverData;
    try {
      serverData = await res.json();
    } catch (jsonError) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Failed to parse JSON response:", jsonError);
      }
      setGeneralError(
        "Received an invalid response from the server. Please try again."
      );
      return;
    }

    if (!res.ok) {
      // Catching zod related errors
      if (serverData.errors?.properties) {
        Object.entries(serverData).forEach(([field, value]) => {
          const v = value as ZodTreeFieldError;
          if (v.errors.length > 0) {
            setError(field as keyof signInValues, {
              type: "server",
              message: v.errors[0],
            });
          }
        });
      } else {
        setGeneralError(serverData.error);
      }
    } else {
      // check serverData and store user in redux slice
    }
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
                inputRef={field.ref}
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
                inputRef={field.ref}
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
