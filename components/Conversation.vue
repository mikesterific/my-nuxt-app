<template>
  <div class="chat" ref="content">
    <div
      v-for="(message, index) in filteredConversation"
      :key="index"
      class="outputCell"
      :ref="`message-${index}`"
    >
      <div v-html="message.content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  ref,
} from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/dark.css';
import { useStore } from 'vuex';

interface Message {
  role: string;
  content: string;
}

export default defineComponent({
  setup() {
    const store = useStore();
    const content = ref<HTMLElement | null>(null);

    const conversation = computed<Message[]>(() => store.getters.conversation);
    const filteredConversation = computed(() =>
      conversation.value
        .filter((message) => message.role !== 'system')
        .map((message) => {
          return {
            ...message,
            content: parseCodeBlocks(message.content),
          };
        })
    );

    watch(conversation, (newVal, oldVal) => {
      if (newVal.length !== oldVal.length) {
        nextTick(() => {
          highlightCodeBlocks();
        });
      }
    });

    function parseCodeBlocks(content: string): string {
      const regex = /```(\w+)?\n([\s\S]*?)```/g;
      return content.replace(regex, (match, lang, code) => {
        const language = lang || 'text';
        const trimmedCode = code.trim();
        return `<div class="highlight">
                  <div class="code-language">${language}</div>
                  <button class="copy-button">Copy</button>
                  <pre><code class="hljs ${language}">${
          hljs.highlight(language, trimmedCode).value
        }</code></pre>
                </div>`;
      });
    }

    function highlightCodeBlocks() {
      nextTick(() => {
        filteredConversation.value.forEach((_, index) => {
          const messageElements = content.value?.querySelectorAll(
            `[ref="message-${index}"]`
          );
          messageElements?.forEach((messageElement) => {
            const blocks = messageElement.querySelectorAll('pre code');
            blocks.forEach((block) => {
              hljs.highlightBlock(block as HTMLElement);
            });
          });
        });
      });
    }

    function copyCode(event: Event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('copy-button')) {
        const codeBlock = target.nextElementSibling?.querySelector('code');
        if (codeBlock) {
          const code = codeBlock.textContent || '';
          navigator.clipboard.writeText(code).then(() => {
            console.log('Code copied to clipboard');
          });
        }
      }
    }

    onMounted(() => {
      highlightCodeBlocks();
      content.value?.addEventListener('click', copyCode);
    });

    onBeforeUnmount(() => {
      content.value?.removeEventListener('click', copyCode);
    });

    return {
      content,
      filteredConversation,
    };
  },
});
</script>

<style lang="less">
.chat {
  flex: 1;
  margin: 40px;
  margin-bottom: 0;
}

.outputCell {
  background-color: rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 20px;
  line-height: 175%;
  margin-bottom: 10px;
}

.highlight {
  background-color: #282c34;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;
}

.code-language {
  background-color: #444;
  color: #fff;
  font-size: 0.8em;
  padding: 3px 6px;
  border-radius: 5px 5px 0 0;
  display: inline-block;
  margin-bottom: 5px;
}

.copy-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #444;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.copy-button:hover {
  background-color: #666;
}

.highlight pre {
  margin: 0;
}

.highlight code {
  display: block;
  color: #abb2bf;
}
</style>
