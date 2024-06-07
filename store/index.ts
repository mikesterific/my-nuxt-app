import { createStore, Store } from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { initialState, State } from './state';

export default createStore<State>({
  state: initialState,
  mutations,
  actions,
  getters,
});
