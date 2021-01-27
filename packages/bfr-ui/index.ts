
import type { App } from 'vue';
import BfrTable from '@bfr-ui/table';
import BfrScrollbar from '@bfr-ui/scrollbar';
import BfrButton from '@bfr-ui/button';
import BfrDescriptions from '@bfr-ui/descriptions';
import BfrForm from '@bfr-ui/form';

const components = [BfrTable, BfrScrollbar, BfrButton, BfrDescriptions, BfrForm];
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name, component);
  });
};
export {
  BfrTable,
  BfrScrollbar,
  BfrButton,
  BfrDescriptions,
  BfrForm,
};

const bfrui = {
  install,
};
export default bfrui;
