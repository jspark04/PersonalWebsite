export interface Repository {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
}

const GITHUB_API_BASE = "https://api.github.com";

const getHeaders = () => {
    const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Astro-Portfolio-Site",
    };

    if (token) {
        headers.Authorization = `token ${token}`;
    }
    return headers;
};

export async function getRepositories(): Promise<Repository[]> {
    const headers = getHeaders();
    // Fetch repositories for the authenticated user if token exists, otherwise generic user
    // However, /user/repos is best if we assume a token is provided for the portfolio owner
    // If no token, we might fail or fall back to public only.
    // Let's assume the user will provide a token as per plan.

    // If we wanted to be safe we could check if token exists, but for now let's try /user/repos
    // which implies we want the *owner's* repos.
    // Warning: /user/repos lists repos the user *has access to*, not just owns, unless filtered.
    // We probably want type=owner or use /users/{username}/repos if we knew the username.
    // Since we don't know the username hardcoded, /user/repos with affiliation=owner is safer if we have a token.

    const url = `${GITHUB_API_BASE}/user/repos?sort=updated&affiliation=owner&visibility=public`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
        console.error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
        throw new Error("Failed to fetch repositories");
    }

    const repos = await response.json();
    return repos;
}

export async function getRepositoryReadme(repoName: string): Promise<string> {
    const headers = getHeaders();
    // We need the owner name. Since we are using /user/repos above, we are the owner.
    // However, to fetch the readme we need /repos/{owner}/{repo}/readme.
    // We can first fetch the user details to get the login, or we can just fetch the repo details which has the owner.
    // OR, we can assume the repoName passed in might need to handle context.
    // ACTUALLY, simpler: ask for the repo details first OR just list repos including full_name (owner/repo).

    // Let's adjust: The caller will likely pass 'repoName'.
    // If we only have 'repoName' (e.g. 'my-project'), we need the owner.
    // We can fetch the user's profile first to get the login.

    // Better yet, let's just make getRepositories return the full_name too so the listing page has it.

    // But wait, the prompt says "lists my github projects".
    // If I use a token, I can get /user.

    const userResponse = await fetch(`${GITHUB_API_BASE}/user`, { headers });
    if (!userResponse.ok) throw new Error("Failed to fetch user data for owner resolution");
    const user = await userResponse.json();
    const owner = user.login;

    // Request HTML format
    const readmeHeaders = { ...headers, Accept: "application/vnd.github.html+json" };
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/readme`;

    const response = await fetch(url, { headers: readmeHeaders });

    if (!response.ok) {
        if (response.status === 404) return "<!-- No README found -->";
        throw new Error(`Failed to fetch README for ${repoName}`);
    }

    let html = await response.text();

    // Fix relative links
    // We need the default branch to construct raw content URLs.
    // We can guess 'main' or 'master', or fetch the repo details to be sure.
    // For robustness, let's fetch repo details to get default_branch.
    const repoDetailsResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}`, { headers });
    const repoDetails = await repoDetailsResponse.json();
    const defaultBranch = repoDetails.default_branch || 'main';

    const rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${defaultBranch}`;

    // Replace relative images src="./..." or src="foo.png"
    // Regex to match src="..." attributes that do not start with http, https, or //
    html = html.replace(/src="([^"]+)"/g, (match, src) => {
        if (src.startsWith("http") || src.startsWith("//") || src.startsWith("data:")) {
            return match;
        }
        // Remove leading ./ if present
        const cleanSrc = src.replace(/^\.\//, "");
        return `src="${rawBaseUrl}/${cleanSrc}"`;
    });

    // Also fix relative links href="..."?
    // Maybe less critical for MVP but good for completeness.
    html = html.replace(/href="([^"]+)"/g, (match, href) => {
        if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#") || href.startsWith("mailto:")) {
            return match;
        }
        const cleanHref = href.replace(/^\.\//, "");
        // Links to files should probably go to the blob view on GitHub, not raw.
        // https://github.com/{owner}/{repo}/blob/{branch}/{path}
        return `href="https://github.com/${owner}/${repoName}/blob/${defaultBranch}/${cleanHref}"`;
    });

    return html;
}
