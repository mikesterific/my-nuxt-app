import { createStore, Store } from 'vuex';
import type { InjectionKey } from 'vue';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { initialState, type State } from './state';

// Define the injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: initialState,
  mutations,
  actions,
  getters,
});
