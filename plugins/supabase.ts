import { createClient } from '@supabase/supabase-js';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseAnonKey = config.public.supabaseKey as string;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  nuxtApp.provide('supabase', supabase);
});
