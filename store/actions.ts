import axios from 'axios';
import type { ActionTree } from 'vuex';
import { extractCodeBlock } from '../js/utils';
import { sendOpenAIMessage, cosineSimilarity } from './helpers';
import vueTestingPrompt from '@/prompts/testing';
// import jsTestingPrompt from '@/prompts/jstesting';
// import mochaTestingPrompt from '@/prompts/mocha';
// import jsTestingPrompt from '@/prompts/jstesting';
// import mochaTestingPrompt from '@/prompts/mocha';
import type { State, Document } from './state';
import { useNuxtApp } from '#app';

interface MessagePayload {
  message: string;
}

interface FileData {
  fileName: string;
  fileContent: string;
}

const actions: ActionTree<State, State> = {
  async sendMessage({ commit, state }, { message }: MessagePayload) {
    if (typeof message !== 'string' || message.trim() === '') {
      console.error(
        'sendMessage action error: message must be a non-empty string'
      );
      return;
    }

    const userMessage = {
      role: 'user',
      content: message,
      calledFrom: 'sendMessage',
    };
    console.log('userMessage', userMessage);

    commit('ADD_MESSAGE', userMessage);

    try {
      const responseMessage = await sendOpenAIMessage(
        state.conversation,
        state.OPENAI_API_KEY
      );
      const assistantMessage = {
        role: 'assistant',
        content: responseMessage,
        calledFrom: 'sendMessage Reply',
      };

      commit('ADD_MESSAGE', assistantMessage);

      return assistantMessage;
    } catch (error) {
      console.error('Error sending message:', (error as Error).message);
      commit('SET_ERROR', (error as Error).message);
    }
  },
  async generateInitialTest({ state, dispatch, commit }) {
    try {
      if (!state.component || !state.component.content) {
        throw new Error('Component content is missing or invalid.');
      }

      const vectorizedComponent = await dispatch(
        'vectorizeInput',
        state.component.content
      );
      if (!vectorizedComponent) {
        throw new Error('Failed to vectorize the component content.');
      }

      const bestPractices = await dispatch('fetchAndSearchEmbeddings', {
        queryEmbedding: vectorizedComponent,
        tableName: 'testing',
      });
      if (
        !bestPractices ||
        !Array.isArray(bestPractices) ||
        bestPractices.length === 0
      ) {
        throw new Error(
          'Failed to fetch best practices or no best practices found.'
        );
      }

      const stringifyBestPractices = bestPractices
        .map((doc: Document) => doc.content)
        .join(' ');

      const initialQuery =
        state.testType ===
        vueTestingPrompt(
          state.component.content,
          stringifyBestPractices,
          state.component.name
        );

      if (!initialQuery) {
        throw new Error('Failed to generate initial query.');
      }

      const sendMessageResult = await dispatch('sendMessage', {
        message: initialQuery,
      });

      if (!sendMessageResult) {
        throw new Error('Failed to send message to OpenAI.');
      }

      commit('ADD_TEST', extractCodeBlock(sendMessageResult.content));

      await dispatch('iterateTests', {
        testCode: state.test,
        component: state.component.content,
        componentName: state.component.name,
      });
    } catch (error) {
      console.error('Error generating initial test:', (error as Error).message);
      commit('SET_ERROR', (error as Error).message);
    }
  },
  async iterateTests(
    { state, dispatch, commit },
    {
      testCode,
      component,
      componentName,
    }: { testCode: string; component: string; componentName: string }
  ) {
    if (!testCode || !component || !componentName) {
      commit('SET_ERROR', 'Missing test code, component, or component name');
      return;
    }

    let iterations = 0;
    const maxIterations = 15;
    let testPassed = false;

    try {
      while (iterations < maxIterations) {
        console.log(`Iteration ${iterations + 1}`);
        console.log('------+++', testCode, component, componentName);

        const testResults = await dispatch('runTests', {
          testCode,
          component,
          componentName,
        });

        if (!testResults) {
          throw new Error('No test results returned');
        }

        if (testResults.passed) {
          testPassed = true;
          console.log('Test passed!');
          break; // Exit the loop if the test passes
        } else {
          console.log('Test failed, generating new test...');

          const sendMessageResult = await dispatch('sendMessage', {
            message: `${testResults.content}`,
          });

          if (!sendMessageResult || !sendMessageResult.content) {
            throw new Error(
              'Failed to send message to OpenAI or invalid response'
            );
          }

          testCode = extractCodeBlock(sendMessageResult.content);

          if (!testCode) {
            throw new Error(
              'Failed to extract code block from OpenAI response'
            );
          }

          commit('ADD_TEST', testCode);

          const newTestResults = await dispatch('runTests', {
            testCode,
            component,
            componentName,
          });

          if (!newTestResults) {
            throw new Error('No new test results returned');
          }

          if (newTestResults.passed) {
            testPassed = true;
            console.log('New test passed!');
            break; // Exit the loop if the new test passes
          } else {
            console.log('New test failed, continuing iterations...');
          }
        }

        iterations++;
      }

      if (!testPassed) {
        console.log('Reached maximum iterations without passing the test.');
      }
    } catch (error) {
      console.error('Error during test iteration:', (error as Error).message);
      commit(
        'SET_ERROR',
        `Error during test iteration: ${(error as Error).message}`
      );
    }
  },
  async runTests(
    { state, commit },
    {
      testCode,
      component,
      componentName,
    }: { testCode: string; component: string; componentName: string }
  ) {
    try {
      console.log('runTests action initiated');

      if (!testCode || !component || !componentName) {
        console.error('Invalid input parameters for runTests', {
          testCode,
          component,
          componentName,
        });
        throw new Error('Invalid input parameters for runTests');
      }
      console.log('Inputs validated:', { testCode, component, componentName });

      console.log('Sending API request to run tests');
      const response = await axios.post('http://localhost:3002/run-tests', {
        testCode,
        component,
        componentName,
      });

      console.log('API response received:', response);

      if (response.status !== 200) {
        console.error(
          `API request failed with status ${response.status}`,
          response
        );
        throw new Error(`API request failed with status ${response.status}`);
      }
      console.log('API request successful:', response.data);

      const testResults = response.data;
      console.log('Received test results:', testResults);

      if (!testResults || typeof testResults !== 'object') {
        console.error('Invalid test results received from API', testResults);
        throw new Error('Invalid test results received from API');
      }

      return testResults;
    } catch (error) {
      console.error('Error running tests:', (error as Error).message);
      commit('SET_ERROR', (error as Error).message);
      return null; // Ensure to return null in case of error
    }
  },
  async vectorizeInput({ state, commit }, userQuery: string) {
    console.log(
      `vectorizeInput action triggered with key ${state.OPENAI_API_KEY}`
    );
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-ada-002',
          input: userQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.OPENAI_API_KEY}`,
          },
        }
      );
      const embedding = response.data.data[0].embedding;
      return embedding;
    } catch (error) {
      console.error('Error in vectorizing input:', (error as Error).message);
      commit('SET_ERROR', 'Failed to vectorize input');
      throw error;
    }
  },
  async fetchAndSearchEmbeddings(
    { commit },
    {
      queryEmbedding,
      tableName,
    }: { queryEmbedding: number[]; tableName: string }
  ) {
    try {
      const { $supabase } = useNuxtApp();
      const { data, error } = await $supabase
        .from(tableName)
        .select('id, title, content, embedding');

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        const searchResults = data
          .map(
            (doc: { id: any; embedding: string | number[]; content: any }) => ({
              id: doc.id,
              similarity: cosineSimilarity(queryEmbedding, doc.embedding),
              content: doc.content,
            })
          )
          .sort(
            (a: { similarity: number }, b: { similarity: number }) =>
              b.similarity - a.similarity
          )
          .slice(0, 3);

        return searchResults;
      } else {
        throw new Error('No search results found');
      }
    } catch (error) {
      console.error(
        'Error fetching and searching embeddings:',
        (error as Error).message
      );
      commit('SET_ERROR', 'Failed to fetch and search embeddings');
      return [];
    }
  },
  clearConversation({ commit }) {
    console.log('clearConversation action triggered');
    commit('CLEAR_CONVERSATION');
  },
};

export default actions;
