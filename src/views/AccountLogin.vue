<template>
  <form @submit.prevent="submit">
    <h1>Login</h1>
    <div class="field">
      <label for="username">Username</label>
      <input id="username" type="text" v-model="username" />
      <span class="error">{{ unError }}</span>
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" type="password" v-model="password" />
      <span class="error">{{ pwError }}</span>
    </div>
    <div class="field">
      <button type="submit">Login!</button>
      <span class="error">{{ error }}</span>
    </div>
  </form>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import { getApi } from '../utils';

export default defineComponent({
  data() {
    return {
      username: '',
      password: '',
      usernameDirty: false,
      passwordDirty: false,
      error: '',
    };
  },
  methods: {
    submit() {
      if (this.unError) return;
      if (this.pwError) return;

      axios
        .post(getApi('login'), { username: this.username, password: this.password })
        .then((res) => {
          let data = res.data;
          if (data.error) return (this.error = data.error);

          localStorage.setItem('token', data);
          this.$router.forward('/');
        })
        .catch((e) => {
          this.error = e;
        });
    },
  },
  computed: {
    unError() {
      if (!this.usernameDirty) return '';
      if (this.username.length < 3) return 'Username must be atleast 3 symbols!';
      return '';
    },
    pwError() {
      if (!this.passwordDirty) return '';
      if (this.password.length < 3) return 'Password must be atleast 3 symbols!';
      return '';
    },
  },
});
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  width: 50%;
  margin: 0 auto 8px;

  label {
    width: fit-content;
    margin: 4px 0 0;
  }

  button {
    width: 128px;
    margin: 0 auto;
  }
}

.error {
  color: red;
  margin: 4px 0 0;
}
</style>
