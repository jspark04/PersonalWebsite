import fs from 'fs';
import postgres from 'postgres';

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    try {
        const envContent = fs.readFileSync('.env', 'utf-8');
        envContent.split('\n').forEach(line => {
            // Handle comments and empty lines
            if (!line || line.startsWith('#')) return;

            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                if (key === 'DATABASE_URL') {
                    let value = parts.slice(1).join('=').trim();
                    // Remove quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    connectionString = value;
                }
            }
        });
    } catch (e) {
        console.log('.env file not found or unreadable');
    }
}

if (!connectionString) {
    console.error('DATABASE_URL not found');
    process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function migrate() {
    try {
        console.log('Adding tags column to notes table...');
        await sql`ALTER TABLE notes ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'`;
        console.log('Migration successful!');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await sql.end();
    }
}

migrate();
