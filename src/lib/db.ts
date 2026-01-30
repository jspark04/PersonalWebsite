import postgres from 'postgres';

const connectionString = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}

const sql = postgres(connectionString, {
    ssl: 'require',
});

export default sql;
