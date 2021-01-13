import { buildUUID } from '@bfr-ui/utils/uuid';
import { mount as _mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import {  TableActionType } from '../../../lib/bfr-table';
import Table from  '../src/index.vue';
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
    it('showSummary false', () => {
      expect(wrapper.find('.ant-table-footer').exists()).toBe(false);
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
        title="远程加载数据"
        :beforeFetch="beforeFetch"
        :afterFetch="afterFetch"
        showTableSetting
        :tableSetting="{allowFixed: true}"
        :api="fetchData"
        :columns="[]"
      />`,
      data() {
        return {
          result: true,
          // fetchSetting: {
          //   listField: 'items',
          // },
          columns: [
            {
              dataIndex: 'id',
              title: 'ID',
            },
            {
              dataIndex: 'name',
              title: 'name',
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
        fetchData() {
          const items = getTestData();
          return new Promise((resolve, reject) => {
            // this.result?:reject('error');
            resolve({ [`${this.fetchSetting.listField}`]:items , total: items.length });
          });
        },
      },
    });
    it('api true', async done => {
      setTimeout(() => {
        expect(
          wrapper.findAll('.ant-table-tbody tr').length,
        ).toEqual(getTestData().length);
        done();
      }, 200);
    });
    it('api false', async done => {
      wrapper.setData({ result: false });
      (wrapper.vm.$refs.apiRef as TableActionType).reload();
      await nextTick();
      setTimeout(() => {
        expect(
          wrapper.findAll('.ant-table-tbody tr').length,
        ).toEqual(0);
        done();
      },200);
    });
    it('api fetchSetting', async done => {
      wrapper.setData({ result: true, fetchSetting: { listField: 'datalist' } });
      await nextTick();
      (wrapper.vm.$refs.apiRef as TableActionType).reload();
      await nextTick();
      setTimeout(() => {
        expect(
          wrapper.findAll('.ant-table-tbody tr').length,
        ).toEqual(getTestData().length);
        done();
      },200);
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
});
