// app/components/AuthProvider.tsx
'use client'; // ⬅️ ESSENCIAL: Marca este componente como um Client Component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Tipagem para as props do componente (apenas 'children')
interface AuthProviderProps {
  children: React.ReactNode; // ReactNode cobre qualquer elemento, texto, ou fragmento
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    // O SessionProvider só será renderizado no lado do cliente
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}