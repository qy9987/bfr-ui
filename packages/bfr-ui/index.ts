import BfrField from '@bfr-ui/field';
import BfrTable from '@bfr-ui/table';

import { App } from 'vue';
const components = [BfrField, BfrTable];
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};
export {
  BfrField,
  BfrTable,
};

export default {
  install,
};
