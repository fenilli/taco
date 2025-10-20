import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from "react-router";
import { App } from './App.tsx'
import '@mantine/core/styles.css';

const root = document.getElementById("root");

createRoot(root!).render(
    <StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MantineProvider>
    </StrictMode>,
);
