import { App } from 'vue';

import Dropdown from './src/Dropdown.vue';

Dropdown.install = (app: App): void => {
  app.component(Dropdown.name, Dropdown);
};
export * from './src/types';
export default Dropdown;
