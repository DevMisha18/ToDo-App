import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, TextField, Button, Paper, Link } from "@mui/material";
import NextLink from "next/link";
import { signUpSchema, type signUpValues } from "@/schemas/auth";
import { ConfirmEmailModal } from "./ConfirmEmailModal";
import type { ZodTreeFieldError } from "@/types/zod";

export default function SignUpForm() {
  const [generalError, setGeneralError] = useState("");
  const [open, setOpen] = useState(false);
  const {
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<signUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<signUpValues> = async (data) => {
    setGeneralError("");
    const { email, password } = data;
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      // Catching zod related errors
      if (data.errors?.properties) {
        Object.entries(data.errors.properties).forEach(([field, value]) => {
          const v = value as ZodTreeFieldError;
          if (v.errors.length > 0) {
            setError(field as keyof signUpValues, {
              type: "server",
              message: v.errors[0],
            });
          }
        });
      } else {
        setGeneralError(data.error);
      }
    } else {
      setOpen(true);
      reset();
    }
  };

  return (
    <>
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
            <Typography variant="h2">Sign up</Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  label="email"
                  variant="filled"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...field}
                  inputRef={field.ref}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="filled"
                  label="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  type="password"
                  inputRef={field.ref}
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  variant="filled"
                  label="confirm password"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
              Already have an account? Sign in{" "}
              <Link component={NextLink} href="/auth/login">
                here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <ConfirmEmailModal {...{ open, setOpen }} />
    </>
  );
}
