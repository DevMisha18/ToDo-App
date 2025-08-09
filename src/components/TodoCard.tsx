import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Checkbox,
  Input,
} from "@mui/material";
import { ModeEdit, Delete } from "@mui/icons-material";
import {
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "@/features/todos/todosApi";
import { formatUtcToLocalTime } from "@/shared/utils/dataUtils";
import type { todo } from "@/shared/types/todo";
import { debounce } from "@/shared/utils/debounce";

/**
 * TODO:
 * 1. ON ESCAPE PRESSED must cancel saving!
 * 2. When debouncing check, if it didn't change, don't send the request
 */

export const TodoCard: React.FC<todo> = ({
  id,
  name: todoName,
  completed,
  created_at,
}) => {
  const [name, setName] = useState(todoName);
  const [prevName, setPrevName] = useState(todoName);
  const [isEditing, setIsEditing] = useState(false);
  const [checked, setChecked] = useState(completed);
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const debouncedUpdateCompleted = useMemo(
    () =>
      debounce((newCompletedStatus: boolean) => {
        updateTodo({
          todo: { completed: newCompletedStatus },
          filters: [{ type: "eq", column: "id", value: id }],
        });
      }, 300),
    [updateTodo, id]
  );

  const handleSave = () => {
    const newName = name.trim();
    setIsEditing(false);
    setName(newName);
    if (newName !== prevName) {
      setPrevName(newName);
      updateTodo({
        todo: { name: newName, completed: checked },
        filters: [{ type: "eq", column: "id", value: id }],
      });
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setName(prevName);
  };

  return (
    <Card sx={{ py: 3.5, px: 2 }} elevation={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex">
          <Checkbox
            checked={checked}
            onChange={() => {
              debouncedUpdateCompleted(!checked);
              setChecked((prev) => !prev);
            }}
            sx={{ marginRight: 1 }}
          />
          <Box>
            {isEditing ? (
              <Input
                autoFocus
                disableUnderline
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    console.log("Escape pressed!");
                    handleCancel();
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                inputProps={{
                  maxLength: 50,
                }}
                sx={{
                  "& .MuiInputBase-input.MuiInput-input": { padding: 0 },
                  fontSize: "1.5rem",
                }}
              />
            ) : (
              <Typography
                variant="h6"
                sx={[
                  { lineHeight: 1.44 },
                  checked && { textDecoration: "line-through" },
                ]}
              >
                {name}
              </Typography>
            )}
            <Typography variant="subtitle2">
              {formatUtcToLocalTime(created_at)}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton
            /**
             * IMPORTANT prevents input blur, stoping race condition between
             * onBlue and onClick
             */
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsEditing(true)}
          >
            <ModeEdit />
          </IconButton>
          <IconButton
            onClick={() =>
              deleteTodo({
                filters: [{ type: "eq", column: "id", value: id }],
              })
            }
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
