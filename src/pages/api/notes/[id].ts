import type { APIRoute } from 'astro';
import sql from '../../../lib/db';

export const DELETE: APIRoute = async ({ params, cookies }) => {
    const { id } = params;
    if (!id) return new Response('ID required', { status: 400 });

    if (!cookies.get('auth_session')?.value) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        await sql`DELETE FROM notes WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete note' }), { status: 500 });
    }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
    const { id } = params;
    if (!id) return new Response('ID required', { status: 400 });

    if (!cookies.get('auth_session')?.value) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { title, content } = await request.json();
        const noteTitle = title || 'Untitled';

        if (!content) return new Response('Content required', { status: 400 });

        const [updatedNote] = await sql`
      UPDATE notes 
      SET title = ${noteTitle}, content = ${content} 
      WHERE id = ${id}
      RETURNING *
    `;

        return new Response(JSON.stringify(updatedNote), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating note:', error);
        return new Response(JSON.stringify({ error: 'Failed to update note' }), { status: 500 });
    }
};
