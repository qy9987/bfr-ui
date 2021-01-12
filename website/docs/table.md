## 表格 Table

用于展示多条结构类似的数据，可对数据实现排序、筛选等自定义操作。

### 基础表格
传入表格数据，最后一列为操作列的表格
:::demo
```html
<template>
  <bfr-table bordered striped :pagination="false" :data-source="dataSource" :columns="columns">
    <template #action="{text, record}">
      <bfr-button type="primary"> 操作 </bfr-button>
    </template>
  </bfr-table>
</template>
<script>
  export default {
    data() {
      return {
        columns: [{
        title: '日期',
        dataIndex: 'date',
        width: 200,
        },{
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        },{
        title: '地址',
        dataIndex: 'address',
        width: 200,
        },{
          flag:'action',
          title:'操作',
          key: 'action',
          slots: { customRender: 'action' },
        }],
        dataSource: [{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          }]
      }
    }
  }
</script>
```
:::
### 单元格自动省略和列合并

:::demo
```html
<template>
  <bfr-table title="省略单元格" :data-source="dataSource" :columns="columns" />
</template>
<script>
  export default {
    data() {
      return {
        columns: [{
        title: '日期',
        dataIndex: 'date',
        width: 200,
        customRender: ({text, index})=>{
          return {
            children: text,
            props: {rowSpan: index%2==0?2:0}
          }
        }
        },{
        title: '日期',
        dataIndex: 'date',
        width: 200,
        },{
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        colSpan: 2,
        customRender: ({text, index})=>{
          return {
            children: text,
            props: {colSpan: 2}
          }
        }
        },{
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        colSpan: 0,
        customRender: ({text, index})=>{
          return {
            children: text,
            props: {colSpan: 0}
          }
        }
        },{
        title: '地址',
        dataIndex: 'address',
        width: 100,
        },{
        title: '地址',
        dataIndex: 'address',
        width: 100,
        }],
        dataSource: [{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          }]
      }
    }
  }
</script>
```
:::
### 分页表格

:::demo
```html
<template>
  <bfr-table title="默认分页" :data-source="dataSource" :columns="columns" />
  <bfr-table title="自定义分页" :pagination="pagination" :data-source="dataSource" :columns="columns" />

</template>
<script>
  export default {
    data() {
      return {
        pagination: {
          pageSize: 2,
          pageSizeOptions: ['1','2','3'],
        },
        columns: [{
        title: '日期',
        dataIndex: 'date',
        width: 200,
        },{
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        },{
        title: '地址',
        dataIndex: 'address',
        width: 200,
        }],
        dataSource: [{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          }]
      }
    }
  }
</script>
```
:::
### 远程加载数据

:::demo
```html
<template>
  <bfr-table 
    title="远程加载数据" 
    :beforeFetch="beforeFetch" 
    :afterFetch="afterFetch" 
    :pagination="pagination" 
    showTableSetting
    :tableSetting="{allowFixed: true}"
    :fetch-setting="fetchSetting" 
    :api="fetchData" 
    :columns="columns"
    :showIndexColumn="showIndexColumn"
  >
    <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      123
    </template>
    <template #filterIcon="filtered">
      <search-outlined  :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>
    <template #actions="{record}">
      {{record.date}}
    </template>
  </bfr-table>
</template>
<script>
  export default {
    data() {
      return {
        fetchSetting: {
          listField: 'dataList'
        },
        pagination: {
          pageSize: 3,
          pageSizeOptions: ['1','2','3'],
        },
        columns: [{
        flag:'date',
        title: '日期',
        dataIndex: 'date',
        sorter: true,
        width: 200,
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon'
        }
        },{
        title: '姓名',
        dataIndex: 'name.value',
        width: 200,
        sorter: true,
        },{
        title: '地址',
        dataIndex: 'address',
        width: 200,
        },{
          flag: 'action',
          title: '操作',
          slots: {
            customRender: 'actions'
          },
        }],
        showIndexColumn: false
      }
    },
    mounted() {
      setTimeout(()=>{
        this.showIndexColumn = !this.showIndexColumn;
      }, 2000)
    },
    methods: {
      beforeFetch(params){
        console.log('before fetch',params);
      },
      async fetchData({page, pageSize}){
        return await new Promise((reslove)=>{
          setTimeout(()=>{
            reslove(page*pageSize<=12?{dataList: [...Array(pageSize).fill(0)].map((i,index)=>({
            date: '2021-01-01',
            name: {
              value: '布法罗'+index
            },
            address: '成都市天府新区海昌路2039号'
          })), total: 12}:{dataList:[], total:12})
          },500)
        })
      },
      afterFetch(items) {
        console.log('after fetch',items);
      }
    }
  }
</script>
```
:::
### 表尾合计行

若表格展示的是各类数字，可以在表尾显示各列的合计。

:::demo默认情况下，对于合计行，当序号列存在时，序号列不进行求和操作，序号列不存在时，第一列不进行数据求合操作，而是显示「合计」二字。可使用`summary-text`配置。其余列会将本列所有数值进行求合操作，并显示出来。当然，你也可以定义自己的合计逻辑。使用`summary-method`并传入一个方法，返回一个数组，这个数组中的各项就会显示在合计行的各列中，具体可以参考本例中的第二个表格。
```html
<template>
  <bfr-table :show-summary="true" summary-text="总计" title="基本用法" :pagination="false" :data-source="dataSource" :columns="columns" />
  <bfr-table :show-summary="true" title="summaryMethod" :summary-method="summaryMethod" showTableSetting :pagination="false" :data-source="dataSource" :columns="columns" />
</template>
<script>
  export default {
    data() {
      return {
        columns: [{
          title: '日期',
          dataIndex: 'date',
          width: 200,
        },{
          title: '姓名',
          dataIndex: 'name',
          width: 200,
        },{
          title: '地址',
          dataIndex: 'address',
          width: 200,
        }],
        dataSource: [{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-02',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-03',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          }]
      }
    },
    methods: {
      summaryMethod(dataSource, columns) {
        let res  = [];
        columns.forEach((column, index)=>{
          if(index==0) {
            res[index] = 'summary';
          }else {
            res[index] = index;
          }
        })
        return res;
      }
    }
  }
</script>
```
:::
### 事件处理

表格事件操作

:::demo
```html
<template>
  <bfr-table @row-click="rowClick" @row-dbClick="rowDbClick" @row-contextmenu="rowContextmenu" 
  showTableSetting
  @row-mouseenter="rowMouseenter" @row-mouseleave="rowMouseleave" :pagination="false" :data-source="dataSource" :columns="columns">
  <template #toolbar>
      <bfr-button type="primary"> 操作 </bfr-button>
  </template>
    <template #action="{text, record}">
      <bfr-button type="primary"> 操作 </bfr-button>
    </template>
  </bfr-table>
</template>
<script>
  export default {
    data() {
      return {
        columns: [{
        title: '日期',
        dataIndex: 'date',
        width: 200,
        },{
        title: '姓名',
        dataIndex: 'name',
        width: 200,
        },{
        title: '地址',
        dataIndex: 'address',
        width: 200,
        },{
          flag:'action',
          title:'操作',
          key: 'action',
          slots: { customRender: 'action' },
        }],
        dataSource: [{
            date: '2021-01-01',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-02',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          },{
            date: '2021-01-03',
            name: '布法罗',
            address: '成都市天府新区海昌路2039号'
          }]
      }
    },
    methods: {
      rowClick(record, index, event) {
        console.log( 'row-click',record, index, event);
      },
      rowDbClick(record, index, event) {
        console.log('row-dbclick', record, index, event);
      },
      rowContextmenu(record, index, event) {
        console.log('row-contextmenu', record, index, event);
      },
      rowMouseenter(record, index, event) {
        console.log('row-mouseenter', record, index, event);
      },
      rowMouseleave(record, index, event) {
        console.log('row-mouseleave', record, index, event);
      }
    }
  }
</script>
```
:::

### api

#### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 版本  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| sortFn     | 自定义排序方法           | (sortInfo: SorterResult) => any | — | — | — |
| inset     | 取消表格的默认padding           | boolean | — | — | — |
| showTableSetting     | 显示表格功能栏          | boolean | — | — | — |
| tableSetting     | 显示表格功能栏          | [tablesetting](#tablesetting) | — | — | — |
| bordered     | 是否显示边框          | boolean | — | — | — |
| striped     | 显示斑马纹          | boolean | — | — | — |
| autoCreateKey     | 自动生成数据key | boolean | — | true | — |
| summaryMethod     | 计算合计行的方法          | (dataSources: object[], columns: [BasicColumn](#basiccolumn)[]): Array< string \| number > | — | — | — |
| showSummary     | 是否显示合计行          | boolean | — | — | — |
| api     | 接口请求对象          | (...arg: any) => Promise< any > | — | — | — |
| beforeFetch     | 请求之前处理参数          |  (params: object) => object | — | — | — |
| afterFetch     | 定义处理接口返回参数          |  (resArr: object[]) => object[] | — | — | — |
| fetchSetting     | 接口请求配置，可以配置请求的字段和响应的字段名，见下方全局配置说明           | [FetchSetting](#fetchsetting) | — | — | — |
| immediate     | 初始化后立即请求接口           | boolean | — | true | — |
| showTableInEmpty     | 在存在搜索表单的时候，如果没有数据是否显示表格           | boolean | — | — | — |
| searchInfo     | 额外的请求参数           | object | — | — | — |
| columns     | 列属性配置           | [BasicColumn](#basiccolumn)[] | — | — | — |
| showIndexColumn     | 显示序号列           | boolean | — | — | — |
| ellipsis     | 文本超过长度是否显示省略号，配置为true时表格列数据不予许换行           | boolean | — | true | — |
| clearSelectOnPageChange     | 切换页码是否重置勾选状态          | boolean | — | — |  — |
| rowKey     | 表格行 key 的取值          | string \| ((record: object) => string) | — | key | — |
| dataSource     | 表格渲染数据,非 api 加载情况         | object[] | — | — | — |
| titleHelpMessage     | 表格标题右侧提示          | string \| string[] | — | — | — |
| maxHeight     | 表格最大高度，超过展示滚动条，maxHeight存在时，scroll.y属性无效, maxHeight值为string类型时，必须带有单位，不带有单位会出现滚动条，但无法滚动         | string\|number | — | — | — |
| pagination     | 分页配置          | [PaginationProps](#paginationprops) \| boolean | — | — | — |
| loading     | 开启loading          | boolean | — | — | — |
| childrenColumnName     | 指定树形结构的列名          | string \| string[] | — | — | — |
| defaultExpandAllRows     | 初始时，是否展开所有行          | boolean | — | — | — |
| defaultExpandedRowKeys     | 默认展开的行,设置该属性时，需要同时设置rowKey          | string[] | — | — | `Delete` |
| expandedRowKeys     | 展开的行，控制属性, 需要同时设置rowKey         | string[] | — | — | — |
| expandedRowRender     | 额外的展开行         | ``` (record: {record: object; index: number; indent: number; expanded: boolean}) => VNode | #expandedRowRender="{record, index, indent, expanded} ``` | — | — | — |
| expandIcon     | 自定义展开图标         | Function(props):VNode \| #expandIcon="props"; | — | — | — |
| expandRowByClick     | 通过点击行来展开子行         | boolean | — | false | — |
| expandIconColumnIndex     | 展开的图标显示在哪一列，如果没有 rowSelection，默认显示在第一列，否则显示在选择框后面         | number | — | — | — |
| footer     | 表格尾部         | Function(currentPageData) =>VNode \| #footer="{currentPageData}" | — | — | TODO |
| indentSize     | 展示树形数据时，每层缩进的宽度，以 px 为单位         | number | — | 15 | — |
| locale     | 默认文案设置，目前包括排序、过滤、空数据文案         | object | — | ```{ filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }``` | — |
| rowClassName     | 表格行的类名       | (record: {record: object; index: number}) => string; | — | —	| — |
| rowSelection     | 列表项是否可选择       | [RowSelection](#rowselection) | — | null | TODO |
| scroll     | 设置横向或纵向滚动，也可用于指定滚动区域的宽和高，建议为 x 设置一个数字，如果要设置为 true，需要配合样式 .ant-table td { white-space: nowrap; }       | { x: string \| number \| true; y: string \| number } | — | — | — |
| size     | 表格大小       | default \| middle \| small  | — | middle | — |
| title     | 表格标题       |  string \| ((data: Recordable) => string \| VNodeChild \| JSX.Element)  | — | — | — |
| customHeaderRow     | 设置头部行属性       | (column: [ColumnProps](#basiccolumn), index: number) => object  | — | — | — |
| customRow     | 设置行属性       | (record: object, index: number) => object  | — | — | — |
| getPopupContainer     | 设置表格内各类浮层的渲染节点，如筛选菜单       |  (triggerNode?: HTMLElement) => HTMLElement  | — | () => TableHtmlElement | — |
| transformCellText     | 数据渲染前可以再次改变，一般用户空数据的默认配置，可以通过 [ConfigProvider](https://2x.antdv.com/components/config-provider-cn/) 全局统一配置       |  Function({ text, column, record, index }) => any  | — | — | — |

#### 事件
| 事件      | 说明          |   回调参数  |
|---------- |-------------- |-------------- |
| change     | 表格分页、筛选、搜索功能修改时的回调函数       | (pagination: any, filters: any, sorter: any, extra: any) => void  | — | — | — |
| expand     | 展开行图标被点击时的回调函数       | (expande: boolean, record: object) => void  | — | — | — |
| expandedRowsChange     | 展开行被点击时的回调函数       | (expandedRows: string[] | number[]) => void  | — | — | — |
| fetch-success | 远程数据加载成功       | Function({items: object[], total: number})  | — | — | — |
| fetch-error | 远程数据加载失败       | Function(error)  | — | — | — |
| selection-change | 勾选事件触发       | Function({keys，rows})  | — | — | — |
| row-click | 行点击事件触发       | Function(record, index,event)  | — | — | — |
| row-dbClick | 行双击事件触发       | Function(record, index,event)  | — | — | — |
| row-contextmenu |   行鼠标右击事件触发     | Function(record, index,event)  | — | — | — |
| row-mouseenter | 鼠标进入行触发       | Function(record, index,event)  | — | — | — |
| row-mouseleave | 鼠标离开行触发       | Function(record, index,event)  | — | — | — |

#### slots
列相关的slot名可通过Column的slot属性进行自定义设置，下面的参数名称为推荐名称
| 参数      | 说明          |   域值  |
|---------- |-------------- |-------------- |
| footer | 自定义表格尾部 | currentPageData |
| tableTitle | 自定义表格标题，在表格左上角展示 | — |
| toolbar | 自定义工具栏，在表格自带工具之前展示 | — |
| action | 自定义操作列 | {text, record} |
| expandIcon | 自定义展开图标 |     props    |
| expandedRowRender | 额外的展开行 | {record, index, indent, expanded} |
| {rowIndex} | 依据当前列的名称作为slot名称，实现列自定义展示，eg: <template #name="{}"> |     {text, record, index}    |

#### methods

| 参数      | 类型        |  说明   |
|---------- |-------------- |-------------- |
| setProps | (props: BasicTableProps) => void |     用于设置表格参数    |
| reload | (opt?: FetchParams) => Promise< void > |     刷新表格    |
| redoHeight | () => void |     重新计算表格高度 TODO    |
| setLoading | (loading:boolean) => void |     设置表格loading    |
| getDataSource | () => any[] |     获取表格数据    |
| getColumns | (opt?: [GetColumnsParams](#getcolumnsparams)) => BasicColumn[] |     获取表格数据    |
| setTableData | (values: any[]) => void |     设置表格数据    |
| setPagination | (info: PaginationProps) => void |     设置分页信息    |
| deleteSelectRowByKey | (key: string) => void |     根据 key 删除取消选中行    |
| getSelectRowKeys | () => string[] |     获取选中行的 keys    |
| getSelectRows | () => any[] |     获取选中行的 rows    |
| clearSelectedRowKeys | () => void |     清空选中行    |
| setSelectedRowKeys | (rowKeys: string[] \| number[]) => void |     设置选中行    |
| getPagination | () => PaginationProps \| boolean |     获取当前分页信息    |


#### TableSetting

| 参数      | 说明          | 类型      | 可选值            | 默认值  | 版本  |
|---------- |-------------- |---------- |--------------  |-------- |-------- |
| redo | 展示刷新按钮 | boolean | — | — | — |
| size | 展示修改表格行大小功能 | boolean | — | — | — |
| setting | 展示表格行设置功能 | boolean | — | — | — |
| allowFixed | 展示表格列固定功能 | boolean | — | false | — |
| fullScreen | 展示全屏按钮 | boolean | — | — | — |

#### FetchSetting

| 参数      | 说明          | 类型      | 可选值    | 默认值  | 版本  |
|---------- |-------------- |---------- |----------  |-------- |-------- |
| pageField | 请求接口当前页数字段 | string | — | page | — |
| sizeField | 每页显示条数字段 | string | — | pageSize | — |
| listField | 请求结果列表字段  支持 a.b.c深层查询 | string | — | items | — |
| totalField | 请求结果总数字段  支持 a.b.c深层查询 | string | — | total | — |

#### PaginationProps

| 参数      | 说明          | 类型      | 可选值    | 默认值  | 版本  |
|---------- |-------------- |---------- |----------  |-------- |-------- |
| position | 指定分页显示的位置 | 'top' | 'bottom' | 'both' | — | bottom | — |
| total | 数据总数 | number | — | — | — |
| defaultCurrent | 默认页码 | number | — | 1 | — |
| current | 当前页码 | number | — | — | — |
| defaultPageSize | 默认每页条数 | number | — | 10 | — |
| pageSize | 每页条数 | number | — | — | — |
| hideOnSinglePage | 只有一页时隐藏分页器 | boolean | — | false | — |
| showSizeChange | 是否可修改pageSize | boolean | — | false | — |
| pageSizeOptions | pageSize指定数组 | string[] | — | ['10', '20', '30', '40'] | — |
| showQuickJumper | 是否可以快速跳转至某页 | boolean | — | false | — |
| showTotal | 用于显示数据总量和当前数据顺序 | (total: number, range: [number, number]) => any; | — | — | — |
| size | 分页尺寸大小 | small \| '' | — | — | — |
| simple | 简洁模式 | boolean | — | — | — |
| itemRender | 用于自定义页码的结构，可用于优化 SEO | ({page, type: 'page' \| 'prev' \| 'next', originalElement}) => vNode \| v-slot | — | — | — |

#### rowSelection
| 参数      | 说明          | 类型      | 可选值    | 默认值  | 版本  |
|---------- |-------------- |---------- |----------  |-------- |-------- |
|columnWidth | 自定义列表选择框宽度 | string\| number | —  | — | — |
| columnTitle | 自定义列表选择框标题 | string\| VNode | —  | — | — |
| fixed | 把选择框列固定在左边 | boolean | — | — | — |
| getCheckboxProps | 选择框的默认属性配置 | Function(record) | — | — | — |
| hideDefaultSelections | 去掉『全选』『反选』两个默认选项 | boolean | — | false | — |
| selectedRowKeys | 指定选中项的 key 数组，需要和 onChange 进行配合 | string[] | — | [] | — |
| selections | 自定义选择配置项, 设为 true 时使用默认选择项 | object[]\|boolean | — | true | — |
| type | 多选/单选，checkbox or radio | string | — | checkbox | — |
| onChange | 选中项发生变化时的回调 | Function(selectedRowKeys, selectedRows) | — | — | — |
| onSelect | 用户手动选择/取消选择某列的回调 | Function(record, selected, selectedRows, nativeEvent) | — | — | — |
| onSelectAll | 用户手动选择/取消选择所有列的回调 | Function(selected, selectedRows, changeRows) | — | — | — |
| onSelectInvert | 用户手动选择反选的回调 | Function(selectedRows) | — | — | — |


#### BasicColumn

| 参数      | 说明          | 类型      | 可选值    | 默认值  | 版本  |
|---------- |-------------- |---------- |----------  |-------- |-------- |
| align	| 设置列内容的对齐方式 | string	| 'left' \| 'right' \| 'center' | 'left'	| — | —	|
| ellipsis | 超过宽度将自动省略，暂不支持和排序筛选一起使用。	| boolean |	—	| false | —	| — |
| colSpan | 表头列合并,设置为 0 时，不渲染,具体操作情况查看 [表格列合并](https://2x.antdv.com/components/table-cn/#components-table-demo-colspan-and-rowspan) | number |	—	| — | —	|
| dataIndex | 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法 | string |	—	| — | —	|
| defaultFilteredValue | 默认筛选值 | string[] | — | — |	—	|
| filterDropdown | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互 | VNode \| v-slot | —	| —	|	—	|
| filterDropdownVisible | 用于控制自定义筛选菜单是否可见 | boolean | —	| —	|	—	|
| filtered | 标识数据是否经过过滤，筛选图标会高亮 | boolean |	—	| false | —	|
| filteredValue | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组 | string[] |	—	| —	| —	|
| filterIcon | 自定义 filter 图标。 | VNode \| ({filtered: boolean, column: Column}) => vNode \|~~slot~~ |	—	| false |	—	|
| filterMultiple | 是否多选 | boolean |	—	| true | —	|
| filters | 表头的筛选菜单项 | object[] | —	| —	|	—	|
| fixed | 列是否固定，可选 true(等效于 left) 'left' 'right' | boolean\|string | —	| left \| right \| false |	—	| —	|
| key | Vue 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性 | string | —	| —	|	—	|
| customRender | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并,可参考 demo 表格行/列合并 | Function({text, record, index}) {}\|v-slot | —	| —	|	—	|
| sorter | 排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true | Function \| boolean |	—	| —	| —	|
| sortOrder | 排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false | boolean\|string | —	| —	|
| sortDirections | 支持的排序方式，取值为 'ascend' 'descend' | Array | ['ascend', 'descend'] | —	| —	|	—	|
| title | 列头显示文字 | string\| (data: object) => string \|~~slot~~ | —	| —	|	—	|
| width | 列宽度 | string|number | —	| —	|	—	|
| customCell | 设置单元格属性 | Function(record, rowIndex) | —	| —	|	—	|
| customHeaderCell | 设置头部单元格属性 | Function(column) | —	| —	|	—	|
| onFilter | 本地模式下，确定筛选的运行函数, 使用 template 或 jsx 时作为filter事件使用 | Function | —	| —	|	—	|
| onFilterDropdownVisibleChange | 自定义筛选菜单可见变化时调用，使用 template 或 jsx 时作为filterDropdownVisibleChange事件使用 | function(visible) {} | —	| —	|	—	|
| slots | 使用 columns 时，可以通过该属性配置支持 slot 的属性，如 slots: { filterIcon: 'XXX'} | object | —	| —	|	—	|
| children | 子数据 | [BasicColumn](basiccolumn)[] |  —	| —	|	—	|
| flag | column类型 | index \| default \| date \| datetime \| action |   —	| —	|	—	|
| defaultHidden | 默认隐藏 | boolean | false | — | —	|	—	|