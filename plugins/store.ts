import { defineNuxtPlugin } from '#app';
import { store, key } from '~/store';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(store, key);
});
