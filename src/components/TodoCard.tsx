import { Box, Typography, Card, IconButton, Checkbox } from "@mui/material";
import { ModeEdit, Delete } from "@mui/icons-material";

export function TodoCard() {
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
          <Checkbox />
          <Box>
            <Typography variant="h6">Create react project</Typography>
            <Typography variant="subtitle2">5:23AM, 01/12/25</Typography>
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
}
