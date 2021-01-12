import type { PropType } from 'vue';
import type { PaginationProps } from './types/pagination';
import type {
  BasicColumn,
  FetchSetting,
  TableSetting,
  SorterResult,
  TableCustomRecord,
  TableRowSelection,
} from './types/table';
// import type { FormProps } from '/@/components/Form';
import { DEFAULT_SORT_FN, FETCH_SETTING } from './const';
import { propTypes } from '@bfr-ui/utils/propTypes';
import { defaultSummaryMethod } from './hooks/useTableFooter';
// 注释看 types/table
export const basicProps = {
  tableSetting: {
    type: Object as PropType<TableSetting>,
  },
  inset: propTypes.bool,
  sortFn: {
    type: Function as PropType<(sortInfo: SorterResult) => any>,
    default: DEFAULT_SORT_FN,
  },

  showTableSetting: propTypes.bool,
  autoCreateKey: propTypes.bool.def(true),
  striped: propTypes.bool.def(true),
  summaryText: propTypes.string.def('合计'),
  showSummary: propTypes.bool,

  summaryMethod: {
    type: Function as PropType<typeof defaultSummaryMethod>,
    default: null,
  },
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  beforeFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  afterFetch: {
    type: Function as PropType<Fn>,
    default: null,
  },
  fetchSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => {
      return FETCH_SETTING;
    },
  },
  // 立即请求接口
  immediate: propTypes.bool.def(true),

  showTableInEmpty: propTypes.bool.def(true),
  // 额外的请求参数
  searchInfo: {
    type: Object as PropType<any>,
    default: null,
  },
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
  },
  showIndexColumn: propTypes.bool.def(true),
  ellipsis: propTypes.bool.def(true),
  clearSelectOnPageChange: propTypes.bool,
  rowSelection: {
    type: Object as PropType<TableRowSelection | null>,
    default: null,
  },
  title: {
    type: [String, Function] as PropType<string | ((data: Recordable) => string)>,
    default: null,
  },
  titleHelpMessage: {
    type: [String, Array] as PropType<string | string[]>,
  },
  maxHeight: [String, Number] as PropType<string | number>,
  dataSource: {
    type: Array as PropType<Recordable[]>,
    default: null,
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((record: Recordable) => string)>,
    default: '',
  },
  bordered: propTypes.bool.def(false),
  pagination: {
    type: [Object, Boolean] as PropType<PaginationProps | boolean>,
    default: null,
  },

  loading: propTypes.bool,
  rowClassName: {
    type: Function as PropType<(record: TableCustomRecord<any>, index: number) => string>,
  },

  scroll: {
    type: Object as PropType<{ x: number | true; y: number }>,
    default: null,
  },
};
