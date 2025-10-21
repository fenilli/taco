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
import { register } from '../api/auth';

export const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { mutate: createAccount, isPending, isError, error } = useMutation({
        mutationFn: register,
        onSuccess: () => navigate('/login'),
    });

    return <Box sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Typography variant="h4" align="center" gutterBottom>
            Create an account
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
                    createAccount({ email, password, confirmPassword });
                }}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                {
                    isError && <Box sx={{ mb: 2, textAlign: "center", color: "red" }}>
                        {
                            error?.message || 'An error occurred'
                        }
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

                <Typography variant="body2" color='textDisabled' fontSize={"sm"}>
                    - Must be at least 6 characters long
                </Typography>

                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                    disabled={!email || password.length < 6 || password !== confirmPassword}
                    loading={isPending}
                    variant="contained"
                    type="submit"
                    sx={{ py: 1.5 }}
                >
                    Create Account
                </Button>
            </Box>

            <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
            >
                Already have an account?{" "}
                <Link component={RouterLink} to="/login">
                    Sign in
                </Link>
            </Typography>
        </Paper>
    </Box>;
};
