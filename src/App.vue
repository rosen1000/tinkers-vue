<template>
  <div id="nav">
    <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
    <router-link to="/builder">Builder</router-link> | <router-link to="/register">Register</router-link> |
    <router-link to="/login">Login</router-link>
  </div>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
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

export default defineComponent({});
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
</style>
