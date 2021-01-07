
import type { App } from 'vue';
import BfrField from '@bfr-ui/field';
import BfrTable from '@bfr-ui/table';
import BfrScrollbar from '@bfr-ui/scrollbar';
import BfrButton from '@bfr-ui/button';

const components = [BfrField, BfrTable, BfrScrollbar, BfrButton];
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};
export {
  BfrField,
  BfrTable,
  BfrScrollbar,
  BfrButton,
};

const bfrui = {
  install,
};
export default bfrui;
