import React, { useState } from "react";
import { Box, Typography, Card, IconButton, Checkbox } from "@mui/material";
import { ModeEdit, Delete } from "@mui/icons-material";
import { todo } from "@/types/todo";

type todoCardProps = Omit<todo, "id" | "user_id">;

export const TodoCard: React.FC<todoCardProps> = ({
  name,
  completed,
  created_at,
}) => {
  const [done, setDone] = useState(completed);
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
          <Checkbox checked={done} onClick={() => setDone((prev) => !prev)} />
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
          <IconButton>
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
