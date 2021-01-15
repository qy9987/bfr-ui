## 描述列表

### 基础用法

:::demo
```html
<template>
  <bfr-descriptions  :column="2" :data-source="data" :items="items" /> 
</template>
<script>
  export default {
    data() {
      return {
        data: {
          id: 123456789,
          name: '布法罗',
          date: new Date(),
          address: '成都市天府新区海昌路2039号'
        },
        items: [{
          label: 'ID',
          dataIndex: 'id',
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address',
        }]
      }
    }
  }
</script>
```
:::

### 边框与尺寸

:::demo
```html
<template>
  <a-radio-group v-model:value="size">
      <a-radio value="default">
        default
      </a-radio>
      <a-radio value="middle">
        middle
      </a-radio>
      <a-radio value="small">
        small
      </a-radio>
    </a-radio-group>
  <bfr-descriptions :size="size" :column="2" bordered :data-source="data" :items="items" /> 
</template>
<script>
  export default {
    data() {
      return {
        data: {
          id: 123456789,
          name: '布法罗',
          date: new Date(),
          address: '成都市天府新区海昌路2039号'
        },
        items: [{
          label: 'ID',
          dataIndex: 'id',
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address',
        }],
        size: 'default'
      }
    }
  }
</script>
```
:::

### 响应式

:::demo
```html
<template>
  <bfr-descriptions :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }" bordered :data-source="data" :items="items" /> 
</template>
<script>
  export default {
    data() {
      return {
        data: {
          id: 123456789,
          name: '布法罗',
          date: new Date(),
          address: '成都市天府新区海昌路2039号'
        },
        items: [{
          label: 'ID',
          dataIndex: 'id',
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address',
        },{
          label: 'ID',
          dataIndex: 'id',
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address',
        }]
      }
    }
  }
</script>
```
:::

### 数据排列方向

:::demo
```html
<template>
  <a-radio-group v-model:value="layout">
      <a-radio value="horizontal">
        horizontal
      </a-radio>
      <a-radio value="vertical">
        vertical
      </a-radio>
    </a-radio-group>
  <bfr-descriptions :layout="layout" :column="2" bordered :data-source="data" :items="items" /> 
</template>
<script>
  export default {
    data() {
      return {
        data: {
          id: 123456789,
          name: '布法罗',
          date: new Date(),
          address: '成都市天府新区海昌路2039号'
        },
        items: [{
          label: 'ID',
          dataIndex: 'id',
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address',
        }],
        layout: 'horizontal'
      }
    }
  }
</script>
```
:::

### valueType 值类型

:::demo
```html
<template>
  <bfr-descriptions  :column="2" :data-source="data" :items="items" /> 
</template>
<script>
  export default {
    data() {
      return {
        data: {
          id: 500,
          name: '布法罗',
          date: new Date(),
          address: '成都市天府新区海昌路2039号'
        },
        items: [{
          label: '百分比',
          dataIndex: 'id',
          valueType: 'percent',
          percentRelative: 1000,
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '日期',
          dataIndex: 'date',
          valueType: 'date',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address',
          formatter: (data,index)=>{
            return 'formatter' + data.address + data.name;
          }
        }]
      }
    }
  }
</script>
```
:::

### slot 自定义

:::demo
```html
<template>
  <bfr-descriptions :column="2" :data-source="data" :items="items">
    <template #title>123</template>
    <template #id="{ prop, record, index }">{{ prop }} {{record[prop]}}</template>
    <template #idlabel="{ index }">{{index}}</template>
  </bfr-descriptions> 
</template>
<script>
  export default {
    data() {
      return {
        data: {
          id: 500,
          name: '布法罗',
          date: new Date(),
          address: '成都市天府新区海昌路2039号'
        },
        items: [{
          label: 'ID',
          dataIndex: 'id',
          slots: {
            default: 'id',
            label: 'idlabel'
          } 
        },{
          label: '名称',
          dataIndex: 'name',
        },{
          label: '时间',
          dataIndex: 'date',
          valueType: 'datetime',
        },{
          label: '地址',
          dataIndex: 'address'
        }]
      }
    }
  }
</script>
```
:::
### api

#### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 版本  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| title | 描述列表的标题，显示在最顶部左侧 | string \| VNode | — | — | — |
| dataSource | 组件的数据源 | object | — | — | — |
| items | 组件需要展示的数据 | [DescriptionItem](#descriptionitem)[] | — | — | — |
| bordered | 是否展示边框 | boolean | — | — | — |
| colon | 列表是否展示冒号, bordered为false时可使用 | boolean | — | true | — |
| column | 一行的 DescriptionItems 数量，可以写成像素值或支持响应式的对象写法 { xs: 4, sm: 6, md: 8, lg: 16,xl: 20,xxl: 24} | number| object | — | 3 | — |
| extra | 描述列表的操作区域，显示在右上方 |  string \| VNode | — |  — | — |
| layout | 描述布局 |  horizontal \| vertical | — | horizontal | — |
| size | 设置列表的大小。可以设置为 middle 、small, 或不填（只有设置 bordered={true} 生效） | default \| middle \| small | — | default | — |

#### DescriptionItem

| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 版本  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| label | 内容的描述 | string \| VNode | — | — | — |
| span | 包含列的数量,当前数据占据多少列的宽度 | number | — | 1 | — |
| dataIndex | 数据在数据项中对应的 key，支持 a.b.c 的嵌套写法 | string | — | — | — |
| formatter | item数据的格式化方法 | (record: object, index: number) => string | — | — | — |
| slots | 当前item对应的自定义slot name | {default: string; label: string} | — | — | — |
| valueType | 值的格式化类型 | default \| date \| datetime \| percent | — | default | — |
| dateTemplate | valueType为date、datetime时数据格式化模板，具体参照dayjs | string | — | date:  YYYY-MM-DD; datetime: YYYY-MM-DD HH:mm:ss | — |
| percentRelative | 百分比数据的相对值，百分比展示 (value*100/percentRelative)% | number | — | 100 | — |

#### slots
| 参数      | 说明          |   域值  |
|---------- |-------------- |-------------- |
| title | 描述列表标题 | — |
| extra | 描述列表右上角操作区域 | — |
| label | 描述item的自定义label，需要配合items的slots属性使用 | — |
| default | 描述item的自定义内容，需要配合items的slots属性使用 | — |