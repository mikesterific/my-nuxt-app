interface ImportMetaEnv {
  readonly VITE_TEMPERATURE: string;
  // add other variables here if you have more
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
