'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
}

export function useAuth() {
    const supabase = createClient();
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAdmin: false,
    });

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'merzougaziz800@gmail.com';

    // Fetch current user
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setAuthState({
                    user,
                    isLoading: false,
                    isAdmin: user?.email === adminEmail,
                });
            } catch {
                setAuthState({ user: null, isLoading: false, isAdmin: false });
            }
        };

        getUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const user = session?.user ?? null;
                setAuthState({
                    user,
                    isLoading: false,
                    isAdmin: user?.email === adminEmail,
                });
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, adminEmail]);

    // Login
    const login = useCallback(
        async (email: string, password: string) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        },
        [supabase]
    );

    // Register
    const register = useCallback(
        async (email: string, password: string, username: string) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username },
                    emailRedirectTo: `${window.location.origin}/api/auth/callback`,
                },
            });
            if (error) throw error;
            return data;
        },
        [supabase]
    );

    // Logout
    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    }, [supabase, router]);

    // Forgot password
    const forgotPassword = useCallback(
        async (email: string) => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
        },
        [supabase]
    );

    // Reset password
    const resetPassword = useCallback(
        async (newPassword: string) => {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
        },
        [supabase]
    );

    // Update email
    const updateEmail = useCallback(
        async (newEmail: string) => {
            const { error } = await supabase.auth.updateUser({
                email: newEmail,
            });
            if (error) throw error;
        },
        [supabase]
    );

    return {
        user: authState.user,
        isLoading: authState.isLoading,
        isAdmin: authState.isAdmin,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateEmail,
    };
}
