/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly ADMIN_PASSWORD?: string;
    readonly DISABLE_SECURE_COOKIES?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
