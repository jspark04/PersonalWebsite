# John Park - Personal Website

A minimalist, production-ready personal website built with **Astro**, **Tailwind CSS**, and **TypeScript**. Designed to be hosted via Docker on a Synology NAS.

## Tech Stack

- **Framework**: [Astro](https://astro.build) (Node.js adapter)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Language**: TypeScript
- **Database**: PostgreSQL (via `postgres.js`)
- **Deployment**: Docker

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ADMIN_PASSWORD` | Password for admin access to Notes | Yes | - |
| `DATABASE_URL` | Postgres connection string | Yes | - |
| `DISABLE_SECURE_COOKIES` | Set to `true` to force non-HTTPS login (usually auto-detected) | No | `false` |



## Project Structure

- `src/data/site.ts`: **Main Config**. Edit this file to update Bio, Links, and Background info.
- `src/pages/api/`: API Endpoints for Notes and Authentication.
- `src/components/MarkdownEditor.astro`: Rich text (WYSIWYG) editor with dark mode support.
- `src/pages/`: Route definitions.

## Editing Content

### 1. Bio & Personal Info
Edit `src/data/site.ts`. This file contains the single source of truth for:
- Name & Role
- Bio (short and long)
- Social Links (LinkedIn, GitHub, Email)
- Focus Areas & Background info

### 2. Notes (Admin Panel)
The Notes system is now powered by a PostgreSQL database with a secure Admin UI.

1.  **Access**: Navigate to `/notes` and scroll to the top.
2.  **Login**: Use the admin password (defined in env `ADMIN_PASSWORD`).
3.  **Create Note**: Use the **Rich Text Editor (Quill)** at the top of the page.
    - Supports formatting (Bold, Italic, Lists, Links, Headings).
    - Auto-converts to Markdown for storage.
4.  **Edit Note**: Click the **Edit** button on any note.
    - Opens a **Dark Mode Modal**.
    - Modify Title or Content ensuring a seamless "What You See Is What You Get" experience.


## Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:4321`.

## Docker Deployment

### Build & Run (Docker Compose)
The easiest way to run locally or on Synology.

> **Note for Windows Users**: For the best performance, ensure you are using Docker Desktop with the WSL 2 backend.

```bash
docker-compose up -d --build
```
The site will be available at `http://localhost:3000`.

### Manual Docker Build
```bash
docker build -t john-park-site .
docker run -d -p 3000:3000 --env-file .env john-park-site
```

### Automated Build & Push
To build and push the image to Docker Hub with version tags:
```powershell
.\push_image.ps1
```
See [docker_push.md](./docker_push.md) for more details.

## Synology Deployment

## Synology Deployment

1. **Container Manager (Registry)**:
   - Go to **Registry** and search for `hotsoupishot/personal-site`.
   - Download the `latest` tag.
   - Go to **Image**, select the image, and click **Run**.
   - Map **Port 3000** on the container to a local port (e.g., 3030).
   - Configure environment variables if needed.

2. **Reverse Proxy (Optional)**:
   - Set up a Reverse Proxy rule in **Control Panel > Login Portal > Advanced > Reverse Proxy**.
   - Source: `https://your-domain.com`
   - Destination: `http://localhost:3030`.

## Live Site
Deployed at: [https://jp.maple.myds.me](https://jp.maple.myds.me)

## License

[MIT](LICENSE) (You can add a LICENSE file if desired).
