<template>
  <div class="ai-input-wrap">
    <span class="label">
      {{ label }}
      <slot name="label-link"></slot>
    </span>
    <span class="selectWrapper">
      <select
        v-model="value"
        ref="selectElement"
        :name="label + 'Select'"
        :disabled="disabled"
      >
        <option
          v-for="option in options"
          :value="option.value"
          :key="option.label"
        >
          {{ option.label }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import type { PropType } from 'vue';

interface Option {
  label: string;
  value: string | number;
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      required: true,
    },
    label: {
      type: String,
    },
    options: {
      type: Array as PropType<Array<Option>>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectElement = ref<HTMLSelectElement | null>(null);

    onMounted(() => {
      selectElement.value = selectElement.value;
    });

    const validate = () => {
      if (selectElement.value) {
        if (!props.modelValue) {
          selectElement.value.setCustomValidity('You must select a value');
        } else {
          selectElement.value.setCustomValidity(''); // Clear any existing validation message
        }
        return selectElement.value.reportValidity(); // Display the validation message and return validation status
      }
    };

    const value = computed({
      get() {
        return props.modelValue;
      },
      set(value: string | number | boolean) {
        emit('update:modelValue', value);
      },
    });

    return {
      selectElement,
      value,
      validate,
    };
  },
});
</script>

<style scoped>
.ai-input-wrap {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  padding-top: 10px;
}
.label {
  font-weight: bold;
  margin-right: 7px;
}
.selectWrapper {
  select {
    width: 100%;
    padding: 5px 10px 5px 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }
}
</style>
