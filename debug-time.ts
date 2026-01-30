import sql from './src/lib/db.ts';

async function checkTime() {
    try {
        const [note] = await sql`SELECT created_at, content FROM notes ORDER BY created_at DESC LIMIT 1`;
        console.log('Raw DB Value:', note.created_at);
        console.log('Type:', typeof note.created_at);
        if (note.created_at instanceof Date) {
            console.log('Date Object ISO:', note.created_at.toISOString());
            console.log('Date Object Local:', note.created_at.toString());
        }
    } catch (e) {
        console.error(e);
    }
}

checkTime();
