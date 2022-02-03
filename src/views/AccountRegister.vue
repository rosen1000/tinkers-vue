<template>
  <form @submit="submit">
    <h1>Register</h1>
    <div class="field">
      <label for="username">Username</label>
      <input id="username" type="text" v-model="username" />
      <span class="error">{{ unError }}</span>
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" type="password" v-model="password" />
      <span class="error">{{ pwError }}</span>
      <span class="warning">{{ pwWarning }}</span>
    </div>
    <div class="field">
      <button type="submit">Register!</button>
      <span class="error">{{ error }}</span>
    </div>
  </form>
</template>

<script>
import { PasswordMeter } from 'password-meter';
import { defineComponent } from 'vue';
import { getApi } from '../utils';
import axios from 'axios';

export default defineComponent({
  setup() {},
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
    submit(e) {
      e.preventDefault();

      if (this.unError) return;
      if (this.pwError) return;

      axios.put(getApi('register'), { username: this.username, password: this.password }).then((response) => {
        let data = response.data;
        if (data.error) return (this.error = data.error);

        localStorage.setItem('token', data);
        window.location = '/';
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
    pwWarning() {
      if (!this.passwordDirty) return '';
      let result = new PasswordMeter().getResult(this.password);
      return result.status;
    },
  },
  watch: {
    username() {
      this.usernameDirty = true;
    },
    password() {
      this.passwordDirty = true;
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

.warning {
  color: orange;
  margin: 4px 0 0;
}
</style>
