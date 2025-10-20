import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        primary: {
            main: "#4facfe",
        },
        text: {
            primary: "#fff",
            secondary: "#bbb",
        },
    },
});
