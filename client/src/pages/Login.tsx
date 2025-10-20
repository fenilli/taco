import { useState } from 'react';
import {
    Box,
    Button,
    Link,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';

export const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: signIn, isPending, isError } = useMutation({
        mutationFn: login,
        onSuccess: () => navigate('/', { replace: true }),
    });

    return <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Typography variant="h4" align="center" gutterBottom sx={{
            mb: 4,
        }}>
            Sign into your account
        </Typography>

        <Paper
            elevation={6}
            sx={{
                p: 4,
                maxWidth: 400,
                width: "100%",
                borderRadius: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
        >
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    signIn({ email, password });
                }}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                {
                    isError && <Box sx={{ mb: 2, textAlign: "center", color: "red" }}>
                        Invalid email or password
                    </Box>
                }

                <TextField
                    label="Email"
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button disabled={!email || password.length < 6} loading={isPending} variant="contained" type="submit" sx={{ py: 1.5 }}>
                    Login
                </Button>
            </Box>

            <Typography
                variant="body2"
                align="right"
                sx={{ mt: 2, color: "text.secondary" }}
            >
                <Link component={RouterLink} to="/password/forgot">
                    Forgot your password?
                </Link>
            </Typography>

            <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
            >
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register">
                    Sign up
                </Link>
            </Typography>
        </Paper>
    </Box>;
};
