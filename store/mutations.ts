import { MutationTree } from 'vuex';
import { State, Message, Component } from './state';

const mutations: MutationTree<State> = {
  ADD_COMPONENT(state, component: Component) {
    console.log('ADD_COMPONENT mutation triggered');
    state.component = component;
  },
  ADD_MESSAGE(state, message: Message) {
    if (typeof message !== 'object' || message === null) {
      console.error(
        'ADD_MESSAGE mutation error: message must be a non-null object'
      );
      return;
    }

    const { role, content } = message;
    if (typeof content !== 'string' || content.trim() === '') {
      console.error(
        'ADD_MESSAGE mutation error: message content must be a non-empty string'
      );
      return;
    }
    if (typeof role !== 'string' || role.trim() === '') {
      console.error(
        'ADD_MESSAGE mutation error: message role must be a non-empty string'
      );
      return;
    }

    const lastMessage = state.conversation[state.conversation.length - 1];
    if (lastMessage && lastMessage.role === role) {
      console.error(
        'ADD_MESSAGE mutation error: consecutive messages cannot have the same role'
      );
      return;
    }

    if (!message.calledFrom) {
      message.calledFrom = 'unknown';
    }

    console.log(
      `ADD_MESSAGE mutation triggered for ${role} from ${message.calledFrom}`
    );
    state.conversation.push({ role, content });
  },
  ADD_TEST(state, test: string) {
    console.log('ADD_TEST mutation triggered');
    state.test = test;
  },
  CLEAR_CONVERSATION(state) {
    console.log('CLEAR_CONVERSATION mutation triggered');
    state.conversation = [];
  },
  SET_ERROR(state, error: string) {
    console.log('SET_ERROR mutation triggered', error);
    state.error = error;
  },
  RUN_TEST_GEN(state, bool: boolean) {
    console.log('RUN_TEST_GEN mutation triggered', bool);
    state.isInitial = bool;
  },
  SET_LOADING(state, isLoading: boolean) {
    console.log('SET_LOADING mutation triggered', isLoading);
    state.isLoading = isLoading;
  },
  SET_SEARCH_RESULTS(state, results: any[]) {
    console.log('SET_SEARCH_RESULTS mutation triggered');
    state.searchResults = results;
  },
  SET_TOKEN(state, token: string) {
    console.log('SET_TOKEN mutation triggered', token);
    state.token = token;
  },
  SET_USER(state, user: any) {
    console.log('SET_USER mutation triggered', user);
    state.user = user;
  },
  RESET_CONVERSATION(state) {
    if (state.conversation.length > 0) {
      state.conversation = [state.conversation[0]]; // Keep only the first message (system message)
    } else {
      console.warn('No messages found in conversation to reset');
    }
  },
};

export default mutations;
