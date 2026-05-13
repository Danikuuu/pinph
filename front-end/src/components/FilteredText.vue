<template>
  <span class="filtered-text inline wrap-break-word">
    <template v-for="(seg, i) in segments" :key="i">
      <span
        v-if="seg.blur"
        class="inline-block max-w-full blur-[4px] select-none opacity-90"
        title="Filtered language"
      >{{ seg.text }}</span>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { segmentProfanity } from '../utils/profanity'

const props = defineProps<{ text: string }>()

const segments = computed(() => segmentProfanity(props.text ?? ''))
</script>
