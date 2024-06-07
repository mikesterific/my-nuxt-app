export interface Document {
  id: string;
  title: string;
  content: string;
  embedding: number[];
}

export interface Message {
  role: string;
  content: string;
  calledFrom?: string;
}

export interface Component {
  content: string;
  name: string;
}

export interface State {
  OPENAI_API_KEY: string;
  SUPABASE_KEY: string;
  SUPABASE_URL: string;
  bestPractice: string;
  component: Component;
  conversation: Message[];
  error: string | null;
  isInitial: boolean;
  isLoading: boolean;
  searchResults: Document[];
  test: string;
  token: string | null;
  user: any;
  testType: string;
}

export const initialState: State = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY || '',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  bestPractice: '',
  component: {
    content: '',
    name: '',
  },
  conversation: [
    {
      role: 'system',
      content: `You are an expert in writing comprehensive unit tests. Your expertise includes:
      1. "Vue Test Utils 2" for "Vue 3" components using the options API. Never use "Vue Test Utils 1".
      2. Jest for unit testing vanilla JavaScript. 
      3. Mocha and Chai for unit testing vanilla JavaScript.
      Please adhere to best practices for writing unit tests, ensuring full coverage of functions, branches, and lines. Let's get started!`,
    },
  ],
  error: null,
  isInitial: false,
  isLoading: false,
  searchResults: [],
  test: '',
  token: null,
  user: null,
  testType: 'testing',
};
