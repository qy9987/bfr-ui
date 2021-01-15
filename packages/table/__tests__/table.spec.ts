import { buildUUID } from '@bfr-ui/utils/uuid';
import { mount as _mount } from '@vue/test-utils';
import { Checkbox, Pagination } from 'ant-design-vue';
import { nextTick } from 'vue';
import {  TableActionType } from '../../../lib/bfr-table';
import Table from '../src/index.vue';
import { setGolbalFetchSetting } from  '../index';

const getTestData = function() {
  return [
    {
      id: buildUUID(),
      name: 'Toy Story',
      release: '1995-11-22',
      director: 'John Lasseter',
      runtime: 80,
    },
    {
      id: buildUUID(),
      name: "A Bug's Life",
      release: '1998-11-25',
      director: 'John Lasseter',
      runtime: 95,
    },
    {
      id: buildUUID(),
      name: 'Toy Story 2',
      release: '1999-11-24',
      director: 'John Lasseter',
      runtime: 92,
    },
    {
      id: buildUUID(),
      name: 'Monsters, Inc.',
      release: '2001-11-2',
      director: 'Peter Docter',
      runtime: 92,
    },
    {
      id: buildUUID(),
      name: 'Finding Nemo',
      release: '2003-5-30',
      director: 'Andrew Stanton',
      runtime: 100,
    },
  ];
};

function equalArray(list: unknown[], arr: unknown[]) {
  arr.forEach(item => {
    expect(list).toContain(item);
  });
}

describe('Table', () => {
  // 属性测试
  describe('autoCreateKey and rowKey', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table ref="autocreatekeyFalse" rowKey="id" :auto-create-key="false" :data-source="data" :columns="columns" />
      <Table ref="autocreatekeyTrue" :data-source="data" :columns="columns" />
      `,

      data() {
        return {
          data: getTestData(),
          columns: [
            {
              flag: 'index',
            },
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
            },{
              flag: 'action',
            }],
        };
      },
    });
    it('autoCreatekey false', () => {
      equalArray(wrapper.vm.$data.data, (wrapper.vm.$refs.autocreatekeyFalse as TableActionType).getDataSource());
    });
    it('autoCreatekey true', () => {
      const data = (wrapper.vm.$refs.autocreatekeyTrue as TableActionType).getDataSource();
      expect(data[0]).toHaveProperty('key');
    });
  });
  describe('showSummary summaryText', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table ref="showSummary" :summaryText="summaryText" :showSummary="showSummary" :data-source="data" :columns="columns" />
      `,

      data() {
        return {
          data: getTestData(),
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
            }, {
              dataIndex: 'runtime',
              title: 'runtime',
            }],
          showSummary: false,
          summaryText: '总计',
        };
      },
    });
    it('showSummary false', done => {
      expect(wrapper.find('.ant-table-footer').exists()).toBe(false);
      done();
    });
    it('showSummary true',async done => {
      wrapper.setData({ showSummary: true });
      await nextTick();
      const footer = wrapper.find('.ant-table-footer');
      expect(footer.exists()).toBe(true);
      const tds = footer.findAll('td');
      expect(tds.length).toBe(3);
      tds.forEach((td, index) => {
        if (index == 0) {
          expect(td.text()).toBe('总计');
        } else if (index == 2) {
          const values = (wrapper.vm.$refs.showSummary as TableActionType).getDataSource().map(item => Number(item['runtime']));
          expect(td.text()).toBe(values.reduce((prev, curr) => {
            return prev+curr;
          }, 0)+'');
        } else {
          expect(td.text()).toBe('');
        }
      });
      done();
    });
  });
  describe('summary-method ', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table title="测试" ref="showSummary" :summary-method="summaryMethod" :showSummary="true" :data-source="data" :columns="columns" />
      `,

      data() {
        return {
          data: getTestData(),
          summaryMethod(dataSource, columns) {
            const res  = [];
            columns.forEach((column, index)=>{
              if(index==0) {
                res[index] = 'summary';
              }else {
                const key = column.dataIndex;
                const values = dataSource.map(i => i[key]);
                if (values.every(i => !isNaN(i))) {
                  res[index] = values.reduce((prev, curr) => {
                    return prev+curr;
                  },0);
                } else {
                  res[index] = 'N/A';
                }
              }
            });
            return res;
          },
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
            }, {
              dataIndex: 'runtime',
              title: 'runtime',
            }],
        };
      },
    });
    it('summaryMethod result true', done => {
      const footer = wrapper.find('.ant-table-footer');
      expect(footer.exists()).toBe(true);
      const tds = footer.findAll('td');
      expect(tds.length).toBe(3);
      tds.forEach((td, index) => {
        if (index == 0) {
          expect(td.text()).toBe('summary');
        } else if (index == 2) {
          const values = (wrapper.vm.$refs.showSummary as TableActionType).getDataSource().map(item => Number(item['runtime']));
          expect(td.text()).toBe(values.reduce((prev, curr) => {
            return prev+curr;
          }, 0)+'');
        } else {
          expect(td.text()).toBe('N/A');
        }
      });
      done();
    });
    it('summaryMethod not function', async done => {
      wrapper.setData({ summaryMethod: 'not Function' });
      await nextTick();
      const footer = wrapper.find('.bfr-table-summary');
      expect(footer.exists()).toBe(false);
      done();
    });
  });
  describe('api', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table
        ref="apiRef"
        :beforeFetch="beforeFetch"
        :afterFetch="afterFetch"
        showTableSetting
        :tableSetting="{allowFixed: true}"
        :api="fetchData"
        :fetchSetting="fetchSetting"
        :columns="[]"
      />`,
      data() {
        return {
          result: true,
          fetchSetting: {
            listField: 'items',
            totalField: 'totals',
          },
          columns: [{
            title: '姓名',
            dataIndex: 'name.value',
            width: 200,
            sorter: true,
          },{
            title: '地址',
            dataIndex: 'address',
            width: 200,
          }],
        };
      },
      methods: {
        beforeFetch(params){
          console.log('before fetch', params);
        },
        afterFetch(items) {
          console.log('after fetch',items);
        },
        async fetchData() {
          return await new Promise(reslove => {
            setTimeout(() => {
              reslove(this.result ? {
                [`${this.fetchSetting.listField}`]: getTestData(), total: 12,
              } : { [`${this.fetchSetting.listField}`]: [], total: 12 });
            }, 100);
          });
        },
      },
    });
    it('api true', async done => {
      await nextTick();
      setTimeout(() => {
        expect(
          wrapper.findAll('.ant-table-tbody tr').length,
        ).toEqual(getTestData().length);
      }, 300);
      done();
    });
    it('api false', async done => {
      wrapper.setData({ result: false });
      (wrapper.vm.$refs.apiRef as TableActionType).reload();
      await nextTick();
      setTimeout(() => {
        expect(
          wrapper.findAll('.ant-table-tbody tr').length,
        ).toEqual(0);
      }, 300);
      done();
    });
    it('api fetchSetting', async done => {
      wrapper.setData({ result: true, fetchSetting: { listField: 'datalist' } });
      (wrapper.vm.$refs.apiRef as TableActionType).reload();
      await nextTick();
      setTimeout(() => {
        expect(
          wrapper.findAll('.ant-table-tbody tr').length,
        ).toEqual(getTestData().length);
      }, 300);
      done();
    });
    it('api setGolbalFetchSetting', async done => {
      setGolbalFetchSetting({ totalField: 'total' });
      await nextTick();
      setTimeout(() => {
        const pag = (wrapper.vm.$refs.apiRef as TableActionType).getPagination();
        if (typeof pag !== 'boolean') {
          expect(pag.total).toBe(12);
        }
      }, 300);
      done();
    });
  });
  describe('showTableInEmpty', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table class="table-empty" :showTableInEmpty="showTableInEmpty" :data-source="[]" :columns="columns" />
      `,
      data() {
        return {
          showTableInEmpty: false,
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
            }, {
              dataIndex: 'runtime',
              title: 'runtime',
            }],
        };
      },
    });
    it('showTableInEmpty false', done => {
      expect(wrapper.find('.table-empty').isVisible()).toBe(false);
      done();
    });
    it('showTableInEmpty true', async done => {
      wrapper.setData({ showTableInEmpty: true });
      await nextTick();
      expect(wrapper.find('.table-empty').exists()).toBe(true);
      done();
    });
  });
  describe('custom indexcolumn', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table :data-source="data" :columns="columns" />
      `,
      data() {
        return {
          data: getTestData(),
          columns: [
            { flag: 'index', title: '自定义序号' },
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
            }, {
              dataIndex: 'runtime',
              title: 'runtime',
            }],
        };
      },
    });
    it('custom indexColumn', async done => {
      await nextTick();
      const thead = wrapper.find('.ant-table-thead');
      expect(thead.exists()).toBe(true);
      const [th] = thead.findAll('th');
      expect(th.text()).toBe('自定义序号');
      done();
    });
  });

  describe('tableSetting', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table ref="tableSetting"  :tableSetting="tableSetting" :showTableSetting="showTableSetting" :immediate="true" :api="getTableData" :columns="columns" />
      `,

      data() {
        return {
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
            }],
          showTableSetting: false,
          tableSetting: null,
          loadIndex: 0,
        };
      },
      methods: {
        getTableData() {
          const items = getTestData();
          return new Promise(resolve => {
            this.loadIndex += 1;
            resolve({ items , total: items.length });
          });
        },
      },
    });
    it('showTableSetting false', () => {
      expect(wrapper.find('.bfr-table-settings').exists()).toBe(false);
    });
    it('showTableSetting true', async done => {
      wrapper.setData({ showTableSetting: true });
      await nextTick();
      expect(wrapper.find('.bfr-table-settings').exists()).toBe(true);
      done();
    });
    it('tableSetting redo', async done => {
      wrapper.setData({ showTableSetting: true, tableSetting: { redo: true } });
      await nextTick();
      const settings =  wrapper.find('.bfr-table-settings');
      expect(settings.exists()).toBe(true);
      const redo = settings.find('.redo-setting');
      expect(redo.exists()).toBe(true);
      const loadIndex = wrapper.vm.loadIndex;
      redo.trigger('click');
      const newIndex = wrapper.vm.loadIndex;
      expect(newIndex).toBe(loadIndex+1);
      done();
    });
  });


  describe('ellipsis', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `
      <Table :ellipsis="ellipsis" :data-source="data" :columns="columns" />
      `,
      data() {
        return {
          ellipsis: true,
          data: [{ id: 1, name: buildUUID()+ buildUUID() }],
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
              width: 20,
            }],
        };
      },
    });
    it('ellipsis true', async done => {
      await nextTick();
      const tbody = wrapper.find('.ant-table-tbody');
      expect(tbody.exists()).toBe(true);
      const [, td] = tbody.findAll('td');
      expect(td.classes()).toContain('ant-table-row-cell-ellipsis');
      done();
    });
    it('ellipsis false', async done => {
      wrapper.setData({ ellipsis: false });
      await nextTick();
      const tbody = wrapper.find('.ant-table-tbody');
      expect(tbody.exists()).toBe(true);
      const [, td] = tbody.findAll('td');
      expect(td.classes()).not.toContain('ant-table-row-cell-ellipsis');
      done();
    });
  });
  describe('clearSelectOnPageChange', () => {
    const wrapper = _mount({
      components: { Table },
      template: `
      <Table 
        ref="table"
        :clearSelectOnPageChange="clearSelectOnPageChange" 
        :rowSelection="{ type: 'checkbox' }"
        rowKey="id"
        :pagination="{pageSize: 2}"
        :dataSource="data"
        :columns="columns"
       />`,
      data() {
        return {
          data: getTestData(),
          clearSelectOnPageChange: false,
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
              width: 20,
            }],
        };
      },
    });
    it('clearSelectOnPageChange true', async done => {
      wrapper.setData({ clearSelectOnPageChange: true });
      await nextTick();
      const box = wrapper.findAllComponents(Checkbox);
      box[0].trigger('click');
      await nextTick();
      const rows = (wrapper.vm.$refs.table as TableActionType).getSelectRows();
      expect(box.length).toBe(rows.length + 1);
      const pagination = wrapper.findComponent(Pagination);
      ((pagination.vm.$el as HTMLElement).querySelector('[title="2"]') as HTMLElement).click();
      await nextTick();
      expect((wrapper.vm.$refs.table as TableActionType).getSelectRows().length).toBe(0);
      done();
    });

    it('clearSelectOnPageChange false', async done => {
      wrapper.setData({ clearSelectOnPageChange: false });
      await nextTick();
      const box = wrapper.findAllComponents(Checkbox);
      box[0].trigger('click');
      await nextTick();
      const rows = (wrapper.vm.$refs.table as TableActionType).getSelectRows();
      expect(box.length).toBe(rows.length + 1);
      const pagination = wrapper.findComponent(Pagination);
      ((pagination.vm.$el as HTMLElement).querySelector('[title="2"]') as HTMLElement).click();
      await nextTick();
      expect((wrapper.vm.$refs.table as TableActionType).getSelectRows().length).toBe(2);
      done();
    });
  });
  describe('title', () => {
    const wrapper = _mount({
      components: { Table },
      template: `
      <Table 
        title="title"
        titleHelpMessage="titleHelpMessage"
        ref="table"
        :dataSource="data"
        :columns="columns"
       />`,
      data() {
        return {
          data: getTestData(),
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
              width: 20,
            }],
        };
      },
    });
    it('title', done => {
      const title = wrapper.find('.bfr-table-title');
      expect(title.text()).toBe('title');
      done();
    });

    it('titleHelpMessage', async done => {
      expect(wrapper.find('.bfr-table-title__help').exists()).toBe(true);
      done();
    });
  });
  // methods
  describe('methods', () => {
    const createTable = () => _mount({
      components: { Table },
      template: `<Table
      rowKey="id"
      :rowSelection="{type: 'checkbox'}"
      ref="table"
      :dataSource="data"
      :columns="columns"
     />`,
      data() {
        return {
          data: getTestData(),
          columns: [{
            dataIndex: 'id',
            title: 'ID',
          },
          {
            dataIndex: 'name',
            title: 'name',
            width: 20,
          }],
        };
      },
      methods: {
        getRef() {
          return this.$refs.table;
        },
      },
    });

    const wrapper = createTable();
    it('setProps', async done => {
      wrapper.vm.getRef().setProps({ title: 'title' , loading: true });
      await nextTick();
      const title = wrapper.find('.bfr-table-title');
      expect(title.text()).toBe('title');
      done();
    });
    it('setLoading', async done => {
      wrapper.vm.getRef().setLoading(true);
      await nextTick();
      expect(wrapper.vm.getRef().getBindValues.loading).toBe(true);
      wrapper.vm.getRef().setLoading(false);
      await nextTick();
      expect(wrapper.vm.getRef().getBindValues.loading).toBe(false);
      done();
    });
    it('getDataSource', async done => {
      expect(wrapper.vm.getRef().getDataSource().length).toBe(getTestData().length);
      done();
    });
    it('getColumns', async done => {
      expect( wrapper.vm.getRef().getColumns().length).toBe(2);
      done();
    });
    it('setTableData', async done => {
      const data = [...getTestData(), ...getTestData()];
      wrapper.vm.getRef().setTableData(data);
      expect(wrapper.vm.getRef().getDataSource().length).toBe(data.length);
      done();
    });
    it('pagination', async done => {
      wrapper.vm.getRef().setPagination({ current: 2 });
      await nextTick();
      const pagination = wrapper.findComponent(Pagination);
      expect((pagination.vm.$el as HTMLElement).querySelector('.ant-pagination-item-active[title="2"]')).toBeTruthy;
      expect(wrapper.vm.getRef().getPagination()).toHaveProperty('current', 2);
      done();
    });
    it('selectRow', async done => {
      const keys = getTestData().map(i => i.id);
      const table = wrapper.vm.getRef();
      table.setSelectedRowKeys(keys);
      await nextTick();
      expect(table.getSelectRowKeys()).toEqual(keys);
      expect(table.getRowSelection().selectedRowKeys.length).toEqual(keys.length);
      const [key1, key2] = keys;
      table.deleteSelectRowByKey(key1);
      table.deleteSelectRowByKey(key2);
      expect(table.getSelectRowKeys()).not.toContainEqual(key1);
      expect(table.getSelectRowKeys()).not.toContainEqual(key2);
      table.clearSelectedRowKeys();
      expect(table.getSelectRowKeys().length).toEqual(0);
      done();
    });
  });
});
