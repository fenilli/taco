import { Box, Button, Typography, Paper } from "@mui/material";
import { useDeleteSession } from '../hooks/use-delete-session';
import { type Session } from '../api/sessions';

export const SessionCard = ({ session }: { session: Session }) => {
    const { session_id, created_at, user_agent, is_current } = session;
    const { deleteSession, isPending } = useDeleteSession(session_id);

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold" fontSize="0.875rem" mb={0.5}>
                    {new Date(created_at).toLocaleString("en-US")}
                    {is_current && " (current session)"}
                </Typography>
                <Typography color="text.secondary" fontSize="0.75rem">
                    {user_agent}
                </Typography>
            </Box>

            {!is_current && (
                <Button
                    size="small"
                    variant="text"
                    color="error"
                    sx={{ fontSize: "1.25rem", ml: 2 }}
                    onClick={() => deleteSession()}
                    disabled={isPending}
                >
                    &times;
                </Button>
            )}
        </Paper>
    );
};
