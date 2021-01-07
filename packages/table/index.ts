import { App } from 'vue';
import Table from './src/index.vue';
// import { createAsyncComponent } from '@bfr-ui/utils/factory/createAsyncComponent';
// export { default as TableAction } from './src/components/TableAction.vue';
// export { default as EditTableHeaderIcon } from './src/components/EditTableHeaderIcon.vue';

export { default as TableImg }   from './src/components/TableImg.vue';

export * from './src/types/table';
export * from './src/types/pagination';
export * from './src/types/tableAction';

export { useTable } from './src/hooks/useTable';

Table.install = (app: App): void => {
  app.component(Table.name, Table);
};

export default Table;
