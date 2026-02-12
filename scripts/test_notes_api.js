import fs from 'fs';

const BASE_URL = 'http://localhost:4321';

async function test() {
    console.log('--- Starting Notes 2.0 API Test ---');

    // 1. Login
    console.log('1. Logging in...');
    let password = '';
    try {
        const envContent = fs.readFileSync('.env', 'utf-8');
        // Handle lines with or without quotes
        const match = envContent.match(/ADMIN_PASSWORD=["']?(.*?)["']?(\r|$)/);
        if (match) password = match[1].trim();

        // Remove trailing quote if regex didn't catch it properly due to complexity
        if (password.endsWith("'") || password.endsWith('"')) {
            password = password.slice(0, -1);
        }
    } catch (e) {
        console.error('Error reading .env:', e);
    }

    console.log(`Using password length: ${password.length}`);

    if (!password) {
        console.error('Could not find ADMIN_PASSWORD in .env');
        return;
    }

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', loginRes.status);
        const text = await loginRes.text();
        console.error('Response:', text);
        return;
    }

    const cookie = loginRes.headers.get('set-cookie');
    console.log('Login successful');

    const headers = {
        'Content-Type': 'application/json',
        'Cookie': cookie
    };

    // 2. Create Note
    console.log('2. Creating Note with Tags...');
    const createRes = await fetch(`${BASE_URL}/api/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            title: 'Test Note ' + Date.now(),
            content: 'This is a test note for tags.',
            tags: ['test', 'api-verification']
        })
    });

    if (!createRes.ok) {
        console.error('Create failed:', await createRes.text());
        return;
    }
    const note = await createRes.json();
    console.log('Note created:', note.id);

    // 3. Verify Tags in GET
    console.log('3. Verifying Tags...');
    const listRes = await fetch(`${BASE_URL}/api/notes`, { headers });
    const notes = await listRes.json();
    const createdNote = notes.find(n => n.id === note.id);

    // Note: API returns tags, make sure we check them correctly
    if (!createdNote || !createdNote.tags || !createdNote.tags.includes('test')) {
        console.error('Tags not saved correctly!', createdNote);
    } else {
        console.log('Tags verified:', createdNote.tags);
    }

    // 4. Test Search
    console.log('4. Testing Search...');
    const searchRes = await fetch(`${BASE_URL}/api/notes?search=test`, { headers });
    const searchResults = await searchRes.json();
    if (searchResults.some(n => n.id === note.id)) {
        console.log('Search successful');
    } else {
        console.error('Search failed to find note');
    }

    // 5. Test Tag Filter
    console.log('5. Testing Tag Filter...');
    const tagRes = await fetch(`${BASE_URL}/api/notes?tag=api-verification`, { headers });
    const tagResults = await tagRes.json();
    if (tagResults.some(n => n.id === note.id)) {
        console.log('Tag filter successful');
    } else {
        console.error('Tag filter failed');
    }

    // 6. Cleanup
    console.log('6. Cleaning up...');
    await fetch(`${BASE_URL}/api/notes/${note.id}`, {
        method: 'DELETE',
        headers
    });
    console.log('Done!');
}

test();
