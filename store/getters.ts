import type { GetterTree } from 'vuex';
import type { State } from './state';

const getters: GetterTree<State, State> = {
  conversation: (state) => state.conversation,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  searchResults: (state) => state.searchResults,
  test: (state) => state.test,
};

export default getters;
