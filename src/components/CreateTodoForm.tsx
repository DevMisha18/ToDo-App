import React from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Box, TextField, Button, useTheme } from "@mui/material";
import { useCreateTodoMutation } from "@/features/todos/todosApi";
import useMediaQuery from "@mui/material/useMediaQuery";

const FormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Must be 50 or less characters"),
});

type FormInputs = z.infer<typeof FormSchema>;

/**
 * TODO:
 * EXTRA:
 * Don't let user save name as bunch of spaces
 * Add name on top of the form "Create todo"
 */

export const CreateTodoForm: React.FC<{
  setShowCreateTodoForm: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowCreateTodoForm }) => {
  const [createTodo] = useCreateTodoMutation();
  const { control, handleSubmit } = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
    mode: "onTouched",
  });

  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    createTodo({ todo: { name: data.name, completed: false } });
    setShowCreateTodoForm(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
        width: "clamp(300px, 80%, 700px)",
        paddingY: 2,
        paddingX: 3,
        backgroundColor: "primary.main",
        borderRadius: 2,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            error={!!error}
            helperText={error?.message}
            variant="filled"
            margin="none"
            size={matchesSm ? "small" : "medium"}
            sx={(theme) => ({
              maxWidth: 500,
              width: "80%",
              backgroundColor: `${theme.palette.primary.light}`,
              "& .MuiFormControl-root.MuiFormControl-marginNormal": {
                marginY: 0,
              },
              "& .MuiFormHelperText-root.Mui-error": {
                position: "absolute",
              },
              "& .MuiInputBase-input.MuiFilledInput-input": {
                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0px 1000px ${theme.palette.primary.light} inset`,
                  WebkitTextFillColor: `${theme.palette.text.primary}`,
                },
              },
            })}
          />
        )}
      />
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        size={matchesSm ? "small" : "medium"}
      >
        Submit
      </Button>
    </Box>
  );
};
