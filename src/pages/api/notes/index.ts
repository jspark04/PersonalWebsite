import type { APIRoute } from 'astro';
import sql from '../../../lib/db';

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');
        const tag = url.searchParams.get('tag');

        let notes;

        // Dynamic query construction
        if (search || tag) {
            const conditions = [];
            if (search) {
                // ILIKE for case-insensitive search
                conditions.push(sql`(title ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})`);
            }
            if (tag) {
                conditions.push(sql`${tag} = ANY(tags)`);
            }

            notes = await sql`
                SELECT * FROM notes 
                WHERE ${conditions.length > 1 ? sql`${conditions[0]} AND ${conditions[1]}` : conditions[0]}
                ORDER BY created_at DESC
            `;
            // Note: simple AND logic for 2 conditions max for now, or use reduce if more complex
        } else {
            notes = await sql`SELECT * FROM notes ORDER BY created_at DESC`;
        }

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

        const { title, content, tags } = await request.json();
        const noteTitle = title || 'Untitled';
        const noteTags = Array.isArray(tags) ? tags : [];

        if (!content || typeof content !== 'string') {
            return new Response(JSON.stringify({ error: 'Content required' }), { status: 400 });
        }

        // Create note
        const [note] = await sql`
      INSERT INTO notes (title, content, tags) 
      VALUES (${noteTitle}, ${content}, ${noteTags}) 
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
