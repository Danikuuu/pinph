<template>
  <div class="min-h-screen" style="background-color: #0f172a; color: #f1f5f9;">
    <NavBar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import ToastContainer from './components/ToastConatiner.vue'
</script>