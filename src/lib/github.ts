export interface Repository {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
}

const GITHUB_API_BASE = "https://api.github.com";

// Simple in-memory cache
class SimpleCache<T> {
    private cache = new Map<string, { value: T; expiry: number }>();

    constructor(private defaultTtl: number = 60 * 1000) { } // Default 1 minute

    get(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    set(key: string, value: T, ttl: number = this.defaultTtl): void {
        this.cache.set(key, { value, expiry: Date.now() + ttl });
    }
}

// Caches
const repoCache = new SimpleCache<Repository[]>(10 * 60 * 1000); // 10 minutes
const readmeCache = new SimpleCache<string>(60 * 60 * 1000); // 1 hour
const ownerCache = new SimpleCache<string>(24 * 60 * 60 * 1000); // 24 hours

const getHeaders = () => {
    const token = (import.meta as any).env?.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Astro-Portfolio-Site",
    };

    if (token) {
        headers.Authorization = `token ${token}`;
    }
    return headers;
};

async function getOwnerLogin(): Promise<string> {
    const cached = ownerCache.get("owner");
    if (cached) return cached;

    const headers = getHeaders();
    const userResponse = await fetch(`${GITHUB_API_BASE}/user`, { headers });

    if (!userResponse.ok) {
        throw new Error("Failed to fetch user data for owner resolution");
    }

    const user = await userResponse.json();
    const owner = user.login;
    ownerCache.set("owner", owner);
    return owner;
}

export async function getRepositories(): Promise<Repository[]> {
    const cached = repoCache.get("repos");
    if (cached) return cached;

    const headers = getHeaders();
    // Use user/repos to get authenticated user's repos
    const url = `${GITHUB_API_BASE}/user/repos?sort=updated&affiliation=owner&visibility=public`;

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            console.error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
            // If cache is empty and API fails, return empty array to prevent crash
            return [];
        }

        const repos = await response.json();
        repoCache.set("repos", repos);
        return repos;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}

export async function getRepositoryReadme(repoName: string): Promise<string> {
    const cached = readmeCache.get(repoName);
    if (cached) return cached;

    try {
        const owner = await getOwnerLogin();
        const headers = getHeaders();

        // Request HTML format
        const readmeHeaders = { ...headers, Accept: "application/vnd.github.html+json" };
        const url = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/readme`;

        const response = await fetch(url, { headers: readmeHeaders });

        if (!response.ok) {
            if (response.status === 404) return "<!-- No README found -->";
            // If rate limited or other error, return a friendly message
            console.error(`Failed to fetch README for ${repoName}: ${response.status}`);
            return "<!-- Unable to load README at this time -->";
        }

        let html = await response.text();

        // Fix relative links
        const repoDetailsResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}`, { headers });
        // Default to main if fetching details fails
        const defaultBranch = repoDetailsResponse.ok
            ? (await repoDetailsResponse.json()).default_branch
            : 'main';

        const rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${defaultBranch}`;

        // Replace relative images src="./..." or src="foo.png"
        html = html.replace(/src="([^"]+)"/g, (match, src) => {
            if (src.startsWith("http") || src.startsWith("//") || src.startsWith("data:")) {
                return match;
            }
            const cleanSrc = src.replace(/^\.\//, "");
            return `src="${rawBaseUrl}/${cleanSrc}"`;
        });

        // Replace relative links
        html = html.replace(/href="([^"]+)"/g, (match, href) => {
            if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#") || href.startsWith("mailto:")) {
                return match;
            }
            const cleanHref = href.replace(/^\.\//, "");
            return `href="https://github.com/${owner}/${repoName}/blob/${defaultBranch}/${cleanHref}"`;
        });

        readmeCache.set(repoName, html);
        return html;
    } catch (error) {
        console.error(`Error fetching README for ${repoName}:`, error);
        return "<!-- Error loading README -->";
    }
}
