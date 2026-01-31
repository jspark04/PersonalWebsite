import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { password } = await request.json();

        // Check both import.meta.env (Astro) and process.env (Node)
        const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

        if (password === adminPassword) {
            cookies.set('auth_session', 'true', {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD && !import.meta.env.DISABLE_SECURE_COOKIES && !process.env.DISABLE_SECURE_COOKIES,
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'Invalid password' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
};
