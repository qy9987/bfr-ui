import { VNode } from 'vue';
export type ValueType = 'default' | 'date' | 'datetime' | 'percent';
export interface DescriptionItem {
  // 内容的描述
  label?: string | VNode;
  // 包含列的数量
  span?: number;
  // 内容
  value?: any;
  // item数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
  dataIndex?: string;
  // item数据的格式化方法
  formatter?: (record, index) => string;
  // 当前item对应的自定义slot name
  slots?: {
    default?: string;
    label?: string;
  };
  // 值的格式化类型
  valueType?: ValueType;
  // 类型为date、datetime时数据格式化模板，具体参照dayjs
  dateTemplate?: string;
  // 百分比数据的相对值，如 percentRelative为100，则计算出的百分比是按照100为基准的
  percentRelative?: number;
}


export interface DescriptionProps {
  // 描述列表的标题，显示在最顶部
  title?: string | VNode;
  // 组件的数据源
  dataSource?: Recordable;
  // 组件需要展示的数据
  items?: DescriptionItem[];
  // 是否展示边框
  bordered?: boolean;
  // 	列表是否展示冒号
  colon?: boolean;
  // 一行的 DescriptionItems 数量，可以写成像素值或支持响应式的对象写法 { xs: 4, sm: 6, md: 8, lg: 16,xl: 20,xxl: 24}
  column?: number | Recordable;
  // 描述列表的操作区域，显示在右上方
  extra?: string | VNode;
  // 描述布局
  layout?: 'horizontal' | 'vertical';
  // 设置列表的大小。可以设置为 middle 、small, 或不填（只有设置 bordered={true} 生效）
  size?: 'default' | 'middle' | 'small';
}
