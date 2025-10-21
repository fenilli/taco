import { Box, Typography } from "@mui/material";
import { useAuth } from "../hooks/use-auth";

export const Profile = () => {
    const { user } = useAuth();
    const { email, created_at } = user;

    return (
        <Box
            sx={{
                mt: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                My Account
            </Typography>

            <Typography color="text.primary" mb={1}>
                Email:{" "}
                <Typography component="span" color="text.secondary">
                    {email}
                </Typography>
            </Typography>

            <Typography color="text.primary">
                Created on{" "}
                <Typography component="span" color="text.secondary">
                    {new Date(created_at).toLocaleDateString("en-US")}
                </Typography>
            </Typography>
        </Box>
    );
};
