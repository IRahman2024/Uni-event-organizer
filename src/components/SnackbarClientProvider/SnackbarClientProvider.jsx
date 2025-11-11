'use client';

import { SnackbarProvider } from 'notistack';

export default function SnackbarClientProvider({ children }) {
    return (
        <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            maxSnack={3}
        >
            {children}
        </SnackbarProvider>
    );
}