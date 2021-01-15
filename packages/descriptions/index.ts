import { App } from 'vue';
import Descriptions from './src/index.vue';

Descriptions.install = (app: App) => {
  app.component(Descriptions.name, Descriptions);
};

export default Descriptions;
