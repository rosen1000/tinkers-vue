<template>
  <div id="nav">
    <router-link to="/">Home</router-link> | <router-link to="/gallery">Gallery</router-link> |
    <router-link to="/builder">Builder</router-link> |
    <template v-if="!logged">
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link>
    </template>
    <template v-else>
      <router-link to="/account">Account</router-link>
    </template>
  </div>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { getToken } from './utils';
import axios from 'axios';

axios.interceptors.request.use((config) => {
  if (localStorage.getItem('token')) {
    config.headers.common = {
      ...config.headers.common,
      authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }
  return config;
});

export default defineComponent({
  computed: {
    logged() {
      return !!getToken();
    },
  },
});
</script>

<style lang="scss">
@font-face {
  font-family: Minecraft;
  src: local('Minecraft'), url('./fonts/MinecraftRegular-Bmg3.otf');
}

button {
  cursor: pointer;
  background: #777;
  border: #777;
  box-shadow: 4px 0 #777, 0 4px #777, -4px 0 #777, 0 -4px #777;
  font-size: 16px;
  font-family: 'Minecraft', Avenir, Helvetica, Arial, sans-serif;
}

.border {
  box-shadow: 8px 0 0 0 #777, 0 8px 0 0 #777, 4px 4px 0 0 #777, -8px 0 0 0 #e8e8e8, 0 -8px 0 0 #e8e8e8,
    -4px -4px 0 0 #e8e8e8, 0 0 0 4px #b5b4b5, 4px 8px 0 0 #555, 8px 4px 0 0 #555, -4px -8px 0 0 #e8e8e8,
    -8px -4px 0 0 #e8e8e8, 8px -4px 0 0 #000, 4px -8px 0 0 #000, -8px 4px 0 0 #000, -4px 8px 0 0 #000,
    -8px -8px 0 0 #000, 8px 8px 0 0 #000, -12px 0 0 0 #000, -12px -4px 0 0 #000, 12px 0 0 0 #000, 12px 4px 0 0 #000,
    0 -12px 0 0 #000, -4px -12px 0 0 #000, 0 12px 0 0 #000, 4px 12px 0 0 #000;
}

#app {
  font-family: 'Minecraft', Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  height: 100%;
  margin: 32px;
  padding: 0 0 16px;
  background: #f7f7f7;
  // background: rgb(165, 243, 248);
  box-shadow: 8px 0 0 0 #777, 0 8px 0 0 #777, 4px 4px 0 0 #777, -8px 0 0 0 #e8e8e8, 0 -8px 0 0 #e8e8e8,
    -4px -4px 0 0 #e8e8e8, 0 0 0 4px #b5b4b5, 4px 8px 0 0 #555, 8px 4px 0 0 #555, -4px -8px 0 0 #e8e8e8,
    -8px -4px 0 0 #e8e8e8, 8px -4px 0 0 #000, 4px -8px 0 0 #000, -8px 4px 0 0 #000, -4px 8px 0 0 #000,
    -8px -8px 0 0 #000, 8px 8px 0 0 #000, -12px 0 0 0 #000, -12px -4px 0 0 #000, 12px 0 0 0 #000, 12px 4px 0 0 #000,
    0 -12px 0 0 #000, -4px -12px 0 0 #000, 0 12px 0 0 #000, 4px 12px 0 0 #000;
}

#nav {
  padding: 12px;

  a {
    font-weight: bold;
    // color: #2c3e50;
    color: black;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.dark {
  background: #444;
}
</style>
