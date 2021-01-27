import { App } from 'vue';
import Form from './src/index.vue';

Form.install = (app: App) => {
  app.component(Form.name, Form);
};

export default Form;
