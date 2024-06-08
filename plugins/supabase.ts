import { createClient } from '@supabase/supabase-js';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseKey = config.public.supabaseKey as string;

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    provide: {
      supabase,
    },
  };
});
