/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  // add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
