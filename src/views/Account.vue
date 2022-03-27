<template>
  <h1>Welcome {{ token.sub }}</h1>
  <div class="item-container">
    <!-- TODO: rendered item -->
  </div>
  <button @click="logout">Logout</button>
</template>

<script>
import { defineComponent } from 'vue';
import { getToken } from '../utils';

export default defineComponent({
  data() {
    return {
      token: getToken(),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      window.location = '/';
    },
  },
});
</script>

<style>
</style>
