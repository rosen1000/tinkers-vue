<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="send">click</button>
  </div>
</template>

<script>
import { getToken } from '../utils';
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    send() {
      console.log(getToken());
    }
  }
})
</script>
