import { defineNuxtConfig } from 'nuxt/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineNuxtConfig({
  css: ['~/assets/style.css'],
  plugins: ['~/plugins/store.ts', '~/plugins/supabase.ts'],
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
});
