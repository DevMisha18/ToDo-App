import React, { useState } from "react";
import { Box, Typography, Card, IconButton, Checkbox } from "@mui/material";
import { ModeEdit, Delete } from "@mui/icons-material";
import {
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "@/features/todos/todosApi";
import { todo } from "@/types/todo";

export const TodoCard: React.FC<todo> = ({
  id,
  name,
  completed,
  created_at,
}) => {
  const [done, setDone] = useState(completed);
  // const [updateTodo, result] = useUpdateTodoMutation();
  const [deleteTodo, result] = useDeleteTodoMutation();

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
            checked={done}
            onChange={() => setDone((prev) => !prev)}
            sx={{ marginRight: 1 }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={done ? { textDecoration: "line-through" } : {}}
            >
              {name}
            </Typography>
            <Typography variant="subtitle2">{created_at}</Typography>
          </Box>
        </Box>
        <Box>
          <IconButton>
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
