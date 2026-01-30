import type { APIRoute } from 'astro';
import sql from '../../../lib/db';

export const GET: APIRoute = async () => {
    try {
        const notes = await sql`SELECT * FROM notes ORDER BY created_at DESC`;
        return new Response(JSON.stringify(notes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch notes' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        // Basic validation
        if (request.headers.get('Content-Type') !== 'application/json') {
            return new Response(null, { status: 415 });
        }

        // Auth check
        if (!cookies.get('auth_session')?.value) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { title, content } = await request.json();
        const noteTitle = title || 'Untitled';

        if (!content || typeof content !== 'string') {
            return new Response(JSON.stringify({ error: 'Content required' }), { status: 400 });
        }

        // Create note
        const [note] = await sql`
      INSERT INTO notes (title, content) 
      VALUES (${noteTitle}, ${content}) 
      RETURNING *
    `;

        return new Response(JSON.stringify(note), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating note:', error);
        return new Response(JSON.stringify({ error: 'Failed to create note' }), { status: 500 });
    }
};
