import { mount as _mount, VueWrapper } from '@vue/test-utils';
import Table from  '../src/index.vue';
const getTestData = function() {
  return [
    {
      id: 1,
      name: 'Toy Story',
      release: '1995-11-22',
      director: 'John Lasseter',
      runtime: 80,
    },
    {
      id: 2,
      name: "A Bug's Life",
      release: '1998-11-25',
      director: 'John Lasseter',
      runtime: 95,
    },
    {
      id: 3,
      name: 'Toy Story 2',
      release: '1999-11-24',
      director: 'John Lasseter',
      runtime: 92,
    },
    {
      id: 4,
      name: 'Monsters, Inc.',
      release: '2001-11-2',
      director: 'Peter Docter',
      runtime: 92,
    },
    {
      id: 5,
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
  describe('api渲染', () => {
    const wrapper = _mount({
      components: {
        Table,
      },
      template: `<Table :data-source="data" :columns="columns" />`,
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
            }],
        };
      },
    });
    it('row length', () => {
      expect(
        wrapper.findAll('.ant-table-tbody tr').length,
      ).toEqual(getTestData().length);
    });
  });
});
