import { defineNuxtConfig } from 'nuxt/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineNuxtConfig({
  css: ['~/assets/style.css'],
  plugins: ['~/plugins/supabase.ts'],
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseKey: process.env.NUXT_SUPABASE_KEY,
    },
  },
  pages: true, // Ensure this is set to true to enable pages
});
