import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const { password } = await request.json();

        const adminPassword = process.env.ADMIN_PASSWORD;

        const proto = request.headers.get('x-forwarded-proto');
        const isHttps = proto === 'https';
        const forceDisable = process.env.DISABLE_SECURE_COOKIES;

        if (password === adminPassword) {
            cookies.set('auth_session', 'true', {
                path: '/',
                httpOnly: true,
                // Secure if PROD + HTTPS + Not Disabled
                secure: import.meta.env.PROD && isHttps && !forceDisable,
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
