<template>
  <main class="appWrap">
    <Conversation />
    <hr class="hr-separator" />
    <section class="inputWrap">
      <Input @triggerSend="sendMessage" :file="selectedFile" />
      <DropFile @file-selected="handleFileSelected" />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { Store } from 'vuex';
import Conversation from '@/components/Conversation.vue';
import Input from '@/components/Input.vue';
import DropFile from '@/components/DropFile.vue';
import SimilaritySearch from '@/components/SimilaritySearch.vue';

interface FileData {
  fileName: string;
  fileContent: string;
}

export default defineComponent({
  components: {
    Input,
    Conversation,
    DropFile,
    SimilaritySearch,
  },
  props: {
    modelType: {
      type: String,
      default: 'mochatesting',
    },
  },
  setup(props) {
    const store = useStore();
    const newMessage = ref<string>('');
    const selectedFile = ref<FileData>({
      fileName: '',
      fileContent: '',
    });

    const sendMessage = (message: string) => {
      const promptServer = './prompts';
      newMessage.value = message;

      if (newMessage.value.trim()) {
        store.dispatch('sendMessage', {
          message: newMessage.value,
          tableName: props.modelType,
          component: selectedFile.value.fileContent,
          componentName: selectedFile.value.fileName,
          returnTemplatePath: `${promptServer}/vue-testing.js`,
        });
        newMessage.value = ''; // Clear the newMessage ref
      }
    };

    const handleFileSelected = (fileData: FileData) => {
      console.log('hi', fileData);
      selectedFile.value = fileData;
    };

    return {
      newMessage,
      selectedFile,
      sendMessage,
      handleFileSelected,
    };
  },
});
</script>

<style lang="less">
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

* {
  box-sizing: border-box;
}

h1 {
  margin-bottom: 64px;
}

html,
body {
  height: 100%;
  padding: 0;
}

.hr-separator {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.531);
  margin: 24px 0;
}

.inputWrap {
  display: flex;
  justify-content: space-between;
  align-items: top;
  div:first-child {
    flex: 1;
    margin-right: 20px;
  }
  div:last-child {
    margin-top: 10px;
  }
}
</style>
