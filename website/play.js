import { createApp } from 'vue';
import BfrUI from 'bfr-ui';
import App from './play/index.vue';
import '../packages/theme-chalk/src/index.scss';
const app = createApp(App);
app.use(BfrUI);
app.mount('#app');

