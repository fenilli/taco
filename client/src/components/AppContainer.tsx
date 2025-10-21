import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/use-auth";
import { UserMenu } from "./UserMenu";

export const AppContainer = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    width: "100vw",
                    height: "90vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress sx={{ mb: 4 }} />
            </Box>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ redirectUrl: window.location.pathname }}
            />
        );
    }

    return (
        <Box sx={{ p: 4, minHeight: "100vh", position: "relative" }}>
            <UserMenu />
            <Outlet />
        </Box>
    );
};
