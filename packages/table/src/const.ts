import type { FetchSetting } from './types/table';

export const ROW_KEY = 'key';

// 可选的每页显示条数;
export const PAGE_SIZE_OPTIONS = ['10', '50', '80', '100'];

// 每页显示条数
export const PAGE_SIZE = ~~PAGE_SIZE_OPTIONS[0];

// 通用接口字段设置
// 支持 xxx.xxx.xxx格式
export const FETCH_SETTING = {
  // 传给后台的当前页字段名
  pageField: 'page',
  // 传给后台的每页显示记录数字段名
  sizeField: 'pageSize',
  // 接口返回的表格数据字段名
  listField: 'items',
  // 接口返回的表格总数字段名
  totalField: 'total',
};

export const setGolbalFetchSetting =  (fetchSetting: FetchSetting = {}) => {
  const setting = { ...FETCH_SETTING, ...fetchSetting };
  FETCH_SETTING.pageField = setting.pageField;
  FETCH_SETTING.sizeField = setting.sizeField;
  FETCH_SETTING.listField = setting.listField;
  FETCH_SETTING.totalField = setting.totalField;
};


//  表格单元格默认布局
export const DEFAULT_ALIGN = 'center';

export const INDEX_COLUMN_FLAG = 'index';
export const ACTION_COLUMN_FLAG = 'action';
