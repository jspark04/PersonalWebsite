# John Park - Personal Website

A minimalist, production-ready personal website built with **Astro**, **Tailwind CSS**, and **TypeScript**. Designed to be hosted via Docker on a Synology NAS.

## Tech Stack

- **Framework**: [Astro](https://astro.build) (Node.js adapter)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Language**: TypeScript
- **Deployment**: Docker

## Project Structure

- `src/data/site.ts`: **Main Config**. Edit this file to update Bio, Links, and Background info.
- `src/content/notes/`: Markdown files for the Notes section.
- `src/pages/`: Route definitions.
- `src/components/`: Reusable UI components.

## Editing Content

### 1. Bio & Personal Info
Edit `src/data/site.ts`. This file contains the single source of truth for:
- Name & Role
- Bio (short and long)
- Social Links (LinkedIn, GitHub, Email)
- Focus Areas & Background info

### 2. Notes
Add new markdown files to `src/content/notes/`.
Frontmatter format:
```yaml
---
title: "My New Note"
description: "A short summary."
pubDate: 2023-10-27
tags: ["tech", "life"]
---
```

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

1. **Container Manager**:
   - Create a new Project (using `docker-compose.yml`).
   - Or pull the built image if you push it to a registry.
2. **Reverse Proxy**:
   - Set up a Reverse Proxy rule in Synology Control Panel.
   - Source: `https://your-domain.com`
   - Destination: `http://localhost:3000` (or whatever port you mapped).

## Live Site
Deployed at: [https://jp.maple.myds.me](https://jp.maple.myds.me)

## License

[MIT](LICENSE) (You can add a LICENSE file if desired).
