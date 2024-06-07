<template>
  <div class="dropzone" @click="triggerFileInput">
    <p v-if="!file">Drop a text file here or <br />click to select a file</p>
    <div v-else>
      <p>File uploaded: {{ file.name }}</p>
    </div>
    <input
      type="file"
      accept=".txt"
      @change="handleFileSelect"
      style="display: none"
      ref="fileInput"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

interface FileData {
  file: File | null;
  fileContent: string;
}

export default defineComponent({
  setup() {
    const store = useStore();
    const file = ref<File | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);
    const fileContent = ref<string>('');

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        file.value = e.dataTransfer.files[0];
        store.commit('RESET_CONVERSATION');
        readFileContent();
      }
    };

    const handleFileSelect = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file.value = target.files[0];
        readFileContent();
      } else {
        file.value = null;
        console.error('No file selected');
      }
    };

    const readFileContent = () => {
      if (file.value) {
        const reader = new FileReader();
        reader.onload = async () => {
          fileContent.value = reader.result as string;
          await store.commit('ADD_COMPONENT', {
            content: fileContent.value,
            name: file.value?.name,
          });
          store.dispatch('generateInitialTest');
        };
        reader.readAsText(file.value);
      }
    };

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    onMounted(() => {
      document.body.addEventListener('dragover', handleDragOver);
      document.body.addEventListener('drop', handleDrop);
    });

    onBeforeUnmount(() => {
      document.body.removeEventListener('dragover', handleDragOver);
      document.body.removeEventListener('drop', handleDrop);
    });

    return {
      file,
      fileInput,
      handleFileSelect,
      triggerFileInput,
    };
  },
});
</script>

<style scoped>
.dropzone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
