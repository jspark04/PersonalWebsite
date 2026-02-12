# Product Specification

## 1. Overview
-   **Product Name**: John Park's Personal Website
-   **Vision**: A minimalist, high-performance personal portfolio and notes platform that is easy to maintain and deploy.
-   **Target Audience**: Recruiters, Developers, Technical Peers.
-   **Problem Solved**: Provides a centralized, professional online presence to showcase work (GitHub) and thoughts (Notes) without the mental overhead of complex CMSs.

## 2. Core Features (MVP)
-   **Dynamic Portfolio**: Automatically fetches and visualizes GitHub repositories, including README rendering and fixing relative links.
-   **Notes System**: A blog-like notes section backed by PostgreSQL, featuring a WYSIWYG editor (Quill.js) for easy content creation.
-   **Admin Interface**: Secure, password-protected area (`/notes`) for creating, editing, and deleting notes.
-   **Responsive Design**: Mobile-first minimalist aesthetic using Tailwind CSS.

## 3. User Flow
-   **Visitor**: Landing Page -> View Projects (GitHub) OR View Notes -> Read Content.
-   **Admin**: Access `/notes` -> Authenticate (Cookie-based) -> Dashboard -> Create/Edit Note -> Save (Persist to DB).

## 4. Constraints & Non-Functional Requirements
-   **Performance**: Must load fast; leverage Astro's static capabilities where possible.
-   **Deployment**: Docker-first workflow for easy hosting on Synology NAS.
-   **Database**: PostgreSQL (Neon for Prod, Local/Docker for Dev).
-   **Security**: Basic admin authentication via environment variables (`ADMIN_PASSWORD`); no open registration.
