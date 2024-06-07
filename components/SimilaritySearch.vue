<template>
  <div>
    <h1>Similarity Search</h1>
    <form @submit.prevent="performSearch">
      <input
        type="text"
        v-model="query"
        placeholder="Enter query vector"
        @keyup.enter="performSearch"
        required
      />
      <button type="submit">Search</button>
    </form>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="results.length">
      <h2>Results</h2>
      <ul>
        <li v-for="result in results" :key="result.id">
          <h3>{{ result.title }}</h3>
          <p>{{ result.content }}</p>
          <p>Similarity: {{ result.similarity }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const query = ref<string>('');

    const searchResults = computed(() => store.getters.searchResults);
    const isLoading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);
    const results = computed(() => searchResults.value);

    const performSearch = () => {
      console.log('Performing search with query:', query.value);
      store.dispatch('performSimilaritySearch', { query: query.value });
    };

    return {
      query,
      searchResults,
      isLoading,
      error,
      results,
      performSearch,
    };
  },
});
</script>

<style scoped>
/* Add any necessary styles */
</style>
