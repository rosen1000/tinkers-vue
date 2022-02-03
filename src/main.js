import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as Sentry from '@sentry/vue';

const app = createApp(App);
app.use(router);
app.mount('#app');

Sentry.init({ app });
