import { App } from 'vue';
import Table from './src/index.vue';
export { setGolbalFetchSetting } from './src/const';
export * from './src/types/table';
export * from './src/types/pagination';
export * from './src/types/tableAction';

export { useTable } from './src/hooks/useTable';

Table.install = (app: App): void => {
  app.component(Table.name, Table);
};

export default Table;
