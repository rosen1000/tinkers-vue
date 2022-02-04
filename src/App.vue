<template>
  <div id="nav">
    <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
    <router-link to="/builder">Builder</router-link> |
    <template v-if="logged">
      <router-link to="/register">Register</router-link> | <router-link to="/login">Login</router-link>
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
      return getToken() == null;
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.dark {
  background: #444;
}
</style>
