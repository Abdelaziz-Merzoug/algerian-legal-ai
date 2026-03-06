import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protected routes — require authentication
    const protectedPaths = ['/chat', '/profile', '/admin'];
    const isProtectedRoute = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    // Auth routes — redirect if already logged in
    const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
    const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

    // If accessing a protected route without being logged in → redirect to login
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(url);
    }

    // If accessing auth routes while logged in → redirect to chat
    if (isAuthRoute && user) {
        const url = request.nextUrl.clone();
        // Use a simple redirect to chat; admin redirect is handled in the admin layout
        url.pathname = '/chat';
        return NextResponse.redirect(url);
    }

    // Admin routes — check role in profiles table via service-role key
    if (pathname.startsWith('/admin') && user) {
        // Skip API routes — those do their own admin verification
        if (!pathname.startsWith('/admin/api')) {
            const adminEmail = process.env.ADMIN_EMAIL || 'merzougaziz800@gmail.com';
            // Email-based shortcut first (fast path)
            const emailIsAdmin = user.email === adminEmail;

            if (!emailIsAdmin) {
                // Fallback: check role in profiles table
                // We do this via a direct fetch to avoid importing supabase-js in middleware
                const profilesUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}&select=role`;
                const profileRes = await fetch(profilesUrl, {
                    headers: {
                        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
                        Accept: 'application/json',
                    },
                });
                const profiles = await profileRes.json();
                const isAdmin = profiles?.[0]?.role === 'admin';

                if (!isAdmin) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/chat';
                    return NextResponse.redirect(url);
                }
            }
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon)
         * - public files (svg, png, jpg, etc.)
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
