import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { logout } from '../api/auth';
import { useState } from "react";

export const UserMenu = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const { mutate: signOut } = useMutation({
        mutationFn: logout,
        onSettled: () => {
            queryClient.clear();
            navigate("/login", { replace: true });
        },
    });

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    position: "absolute",
                    left: "1.5rem",
                    bottom: "1.5rem",
                }}
            >
                <Avatar src="#" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <MenuItem onClick={() => navigate("/")}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
        </>
    );
};
