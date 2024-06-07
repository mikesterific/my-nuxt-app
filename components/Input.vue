<template>
  <div>
    <Loading v-if="isLoading" />
    <div v-if="error">{{ error }}</div>
    <textarea
      v-model="newMessage"
      class="input"
      @keyup.enter="handleSendMessage"
      placeholder="Type your message..."
      tabindex="1"
      dir="auto"
      rows="1"
      style="overflow-y: hidden"
      focus
    />
    <SubmitBtn @click="handleSendMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import Loading from './Loading.vue';
import SubmitBtn from './SubmitBtn.vue';

export default defineComponent({
  components: {
    Loading,
    SubmitBtn,
  },
  setup() {
    const store = useStore();

    const newMessage = ref<string>('');
    const isLoading = computed(() => store.getters.isLoading);
    const error = computed(() => store.getters.error);

    const handleSendMessage = async () => {
      try {
        if (newMessage.value.trim()) {
          await store.dispatch('sendMessage', {
            message: newMessage.value,
          });
          newMessage.value = '';
        }
      } catch (error) {
        console.error('Error in handleSendMessage:', (error as Error).message);
        store.commit('SET_ERROR', (error as Error).message);
      }
    };

    return {
      newMessage,
      isLoading,
      error,
      handleSendMessage,
    };
  },
});
</script>

<style lang="less" scoped>
.input {
  width: 100%;
  height: 70px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  margin: 10px 0;
}
</style>
