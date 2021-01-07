// import CollapseContainer from './src/collapse/CollapseContainer.vue';
import ScrollContainer from './src/ScrollContainer.vue';
// import LazyContainer from './src/LazyContainer.vue';
import { App } from 'vue';

const container = {
  install: (app: App) => {
    app.component(ScrollContainer.name, ScrollContainer);
  },
};
export { ScrollContainer };
export default container;
export * from './src/types';
