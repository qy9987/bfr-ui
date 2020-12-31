import BfrField from '@bfr-ui/field';
import { App } from 'vue';
const components = [BfrField];
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};
export {
  BfrField,
};

export default {
  install,
};
