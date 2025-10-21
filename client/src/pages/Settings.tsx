import { CircularProgress, Container, Typography, Stack } from "@mui/material";
import { useSessions } from "../hooks/use-sessions";
import { SessionCard } from "../components/SessionCard";

export const Settings = () => {
    const { sessions, isPending, isSuccess, isError } = useSessions();

    return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" mb={4}>
                My Sessions
            </Typography>
            {isPending && <CircularProgress />}
            {isError && <Typography color="error.main">Failed to get sessions.</Typography>}
            {isSuccess && (
                <Stack spacing={2}>
                    {sessions.map((session) => (
                        <SessionCard key={session.session_id} session={session} />
                    ))}
                </Stack>
            )}
        </Container>
    );
};
