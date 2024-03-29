import type { VNode, VNodeChild } from 'vue';
import type { PaginationProps } from './pagination';
import type {
  ColumnProps,
  TableRowSelection as ITableRowSelection,
} from 'ant-design-vue/lib/table/interface';
import { ComponentType } from './componentType';
// import { ColumnProps } from './column';
export declare type SortOrder = 'ascend' | 'descend';
export interface TableCurrentDataSource<T = any> {
  currentDataSource: T[];
}

export interface TableRowSelection<T = any> extends ITableRowSelection {
  /**
   * Callback executed when selected rows change
   * @type Function
   */
  onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => any;

  /**
   * Callback executed when select/deselect one row
   * @type FunctionT
   */
  onSelect?: (record: T, selected: boolean, selectedRows: Recordable<any>[], nativeEvent: Event) => any;

  /**
   * Callback executed when select/deselect all rows
   * @type Function
   */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => any;

  /**
   * Callback executed when row selection is inverted
   * @type Function
   */
  onSelectInvert?: (selectedRows: string[] | number[]) => any;
}

export interface TableCustomRecord<T> {
  record?: T;
  index?: number;
}

export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
  indent?: number;
  expanded?: boolean;
}
export interface ColumnFilterItem {
  text?: string;
  value?: string;
  children?: any;
}

export interface TableCustomRecord<T = any> {
  record?: T;
  index?: number;
}

export interface SorterResult {
  column: ColumnProps;
  order: SortOrder;
  field: string;
  columnKey: string;
}

export interface RenderEditableCellParams {
  dataIndex: string;
  component?: ComponentType;
  componentProps?: any;
  placeholder?: string;
}

export interface FetchParams {
  searchInfo?: any;
  page?: number;
  sortInfo?: any;
  filterInfo?: any;
}

export interface GetColumnsParams {
  ignoreIndex?: boolean;
  ignoreAction?: boolean;
  sort?: boolean;
}

export type SizeType = 'default' | 'middle' | 'small';

export interface TableActionType {
  reload: (opt?: FetchParams) => Promise<void>;
  getSelectRows: <T = any>() => T[];
  clearSelectedRowKeys: () => void;
  getSelectRowKeys: () => string[];
  deleteSelectRowByKey: (key: string) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  setTableData: <T = Recordable>(values: T[]) => void;
  getColumns: (opt?: GetColumnsParams) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
  getDataSource: <T = Recordable>() => T[];
  setLoading: (loading: boolean) => void;
  setProps: (props: Partial<BasicTableProps>) => void;
  setSelectedRowKeys: (rowKeys: string[] | number[]) => void;
  getPagination: () => PaginationProps | boolean;
  getSize: () => SizeType;
  getRowSelection: () => TableRowSelection<Recordable>;
  getCacheColumns: () => BasicColumn[];
}

export interface FetchSetting {
  // 请求接口当前页数字段
  pageField?: string;
  // 每页显示多少条
  sizeField?: string;
  // 请求结果列表字段  支持 a.b.c
  listField?: string;
  // 请求结果总数字段  支持 a.b.c
  totalField?: string;
}

export interface TableSetting {
  redo?: boolean;
  size?: boolean;
  setting?: boolean;
  allowFixed?: boolean;
}

export interface BasicTableProps<T = any> {
  // 显示表格设置
  showTableSetting?: boolean;
  tableSetting?: TableSetting;
  // 斑马纹
  striped?: boolean;
  // 是否自动生成key
  autoCreateKey?: boolean;
  // 计算合计行的方法
  summaryMethod?: (dataSource: Recordable[], columns:BasicColumn[]) => Array<number|string>;
  // 合计行第一列的文本
  summaryText?: string;
  // 是否显示合计行
  showSummary?: boolean;
  // 接口请求对象
  api?: (...arg: any) => Promise<any>;
  // 请求之前处理参数
  beforeFetch?: (params: Recordable)=>Recordable;
  // 自定义处理接口返回参数
  afterFetch?: (resArr: Record< string, any>[])=>Record< string, any>[];
  // 请求接口配置
  fetchSetting?: FetchSetting;
  // 立即请求接口
  immediate?: boolean;
  // 在开起搜索表单的时候，如果没有数据是否显示表格
  showTableInEmpty?: boolean;
  // 额外的请求参数
  searchInfo?: Recordable;
  // 列配置
  columns: BasicColumn[];
  // 文本超过宽度是否显示。。。
  ellipsis?: boolean;

  // 在分页改变的时候清空选项
  clearSelectOnPageChange?: boolean;
  // 表格行 key 的取值
  rowKey?: string | ((record: Recordable) => string);
  // 数据
  dataSource?: Recordable[];
  // 标题右侧提示
  titleHelpMessage?: string | string[];
  // 表格滚动最大高度
  maxHeight?: string|number;
  // 是否显示边框
  bordered?: boolean;
  // 分页配置
  pagination?: PaginationProps | boolean;
  // loading加载
  loading?: boolean;

  // 指定树形结构的列名
  childrenColumnName?: string | string[];


  // 初始时，是否展开所有行
  defaultExpandAllRows?: boolean;

  // 展开的行
  expandedRowKeys?: string[];

  // 额外的展开行
  expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => VNodeChild | JSX.Element;

  // 自定义展开图标
  expandIcon?: (props)=>(VNode | VNodeChild | JSX.Element);

  // 通过点击行来展开子行
  expandRowByClick?: boolean;

  // 展开的图标显示列
  expandIconColumnIndex?: number;

  // 表格尾部
  footer?: (currentPageData)=>( VNodeChild | JSX.Element);

  // 展示树形数据时，每层缩进的宽度
  indentSize?: number;

  /**
   * 默认文案设置，目前包括排序、过滤、空数据文案
   * @default { filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }
   * @type object
   */
  locale?: Recordable;

  // 表格行的类名
  rowClassName?: (record: TableCustomRecord<T>) => string;

  // 列表项是否可选择
  rowSelection?: TableRowSelection;

  /**
   * 设置横向或纵向滚动，也可用于指定滚动区域的宽和高，
   * 建议为 x 设置一个数字，如果要设置为 true，
   * 需要配合样式 .ant-table td { white-space: nowrap; }
   * @type  { x: string | number | true; y: string | number }
   */
  scroll?: { x?: string | number | true; y?: string | number };


  /**
   * 表格大小
   * @default 'default'
   * @type string
   */
  size?: SizeType;

  /**
   * 表格标题
   * @type Function| string
   */
  title?: string | ((data: Recordable) => string| VNodeChild | JSX.Element);

  /**
   * 设置头部行属性
   * @type Function
   */
  customHeaderRow?: (column: ColumnProps, index: number) => Recordable;

  /**
   * Set props on per row
   * @type Function
   */
  customRow?: (record: T, index: number) => Recordable;

  /**
   * 设置表格内各类浮层的渲染节点，如筛选菜单
   * @default () => TableHtmlElement
   * @type (triggerNode: HTMLElement) => HTMLElement;
   */
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;

  /**
   * 数据渲染前可以再次改变，一般用户空数据的默认配置，可以通过 [ConfigProvider](https://2x.antdv.com/components/config-provider-cn/) 全局统一配置
   * ({ text, column, record, index }) => any
   */
  transformCellText?: Fn ;

  /**
   * 表格分页、筛选、搜索功能修改时的回调函数
   * @param pagination
   * @param filters
   * @param sorter
   * @param {currentDataSource}
   */
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;

  /**
   * 展开行图标被点击时的回调函数
   *
   * @param expanded
   * @param record
   */
  onExpand?: (expande: boolean, record: T) => void;

  /**
   * 展开行图标被点击时的回调函数
   * @param expandedRows
   */
  onExpandedRowsChange?: (expandedRows: string[] | number[]) => void;
}

export interface PercentType {
  total: number | (() => number);
}
export interface BasicColumn extends ColumnProps {
  children?: BasicColumn[];

  flag?: 'index' | 'action' | 'default' | 'date' | 'datetime' | 'percent';

  dateTemplate?: string; // 类型为date、datetime时数据格式化模板，具体参照dayjs
  percent?: PercentType;
  slots?: Recordable;

  defaultHidden?: boolean;
}
