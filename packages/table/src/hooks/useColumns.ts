import { BasicColumn, BasicTableProps, GetColumnsParams } from '../types/table';
import { PaginationProps } from '../types/pagination';
import { unref, ComputedRef, Ref, computed, ref, toRaw, watch } from 'vue';
import { isBoolean, isArray, isString } from '@bfr-ui/utils/is';
import { DEFAULT_ALIGN, PAGE_SIZE, INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG } from '../const';
import { isEqual, cloneDeep } from 'lodash';
import { formatter } from '@bfr-ui/utils/date';

function handleItem(item: BasicColumn, ellipsis: boolean) {
  const { key, dataIndex, children } = item;
  item.align = item.align || DEFAULT_ALIGN;
  if (ellipsis) {
    if (!key) {
      item.key = dataIndex;
    }
    if (!isBoolean(item.ellipsis)) {
      Object.assign(item, {
        ellipsis,
      });
    }
  }

  if (children && children.length) {
    handleChildren(children, !!ellipsis);
  }
}

function handleChildren(children: BasicColumn[] | undefined, ellipsis: boolean) {
  if (!children) return;
  children.forEach(item => {
    const { children } = item;
    handleItem(item, ellipsis);
    handleChildren(children, ellipsis);
  });
}
// 序号列配置
function handleIndexColumn(
  propsRef: ComputedRef<BasicTableProps>,
  paginationRef: ComputedRef<boolean | PaginationProps>,
  columns: BasicColumn[],
) {
  const { showIndexColumn } = unref(propsRef);

  const index = columns.findIndex(column => column.flag === INDEX_COLUMN_FLAG);
  if (showIndexColumn) {
    const isFixedLeft = columns.some(item => item.fixed === 'left');
    const column: BasicColumn = {
      flag: INDEX_COLUMN_FLAG,
      width: 50,
      title: '序号',
      dataIndex: '$index',
      key: '$index',
      align: 'center',
      customRender: ({ index }) => {
        const getPagination = unref(paginationRef);
        if (isBoolean(getPagination)) {
          return `${index + 1}`;
        }
        const { current = 1, pageSize = PAGE_SIZE } = getPagination;
        const currentIndex = (current - 1) * pageSize + index + 1;
        return currentIndex;
      },
      ...(isFixedLeft
        ? {
          fixed: 'left',
        }
        : {}),
      ...index!==-1?columns[index]:{},
    };
    if (index === -1) {
      columns.unshift(column);
    } else {
      columns[index] = column;
    }
  } else {
    if (index !== -1) {
      columns.splice(index,1);
    }
  }
}
// 操作列配置
function handleActionColumn( columns: BasicColumn[]) {
  const hasIndex = columns.findIndex(column => column.flag === ACTION_COLUMN_FLAG);
  if (hasIndex !== -1) {
    const isFixedRight = columns.some(item => item.fixed === 'right');
    columns[hasIndex] = {
      fixed: isFixedRight?'right':false,
      key: '$action',
      dataIndex: '$action',
      ...columns[hasIndex],
      width: 200,
      flag: ACTION_COLUMN_FLAG,
    };
  }
}

export function useColumns(
  propsRef: ComputedRef<BasicTableProps>,
  paginationRef: ComputedRef<boolean | PaginationProps>,
) {
  const columnsRef = (ref(unref(propsRef).columns) as unknown) as Ref<BasicColumn[]>;
  // 监听序号列展示
  watch([()=>propsRef.value.showIndexColumn], () => {
    handleIndexColumn(propsRef, paginationRef, unref(columnsRef));
  }, { immediate: true });
  // 监听操作列展示
  watch([()=>propsRef.value.columns], () => {
    handleActionColumn(unref(columnsRef));
  }, { immediate: true });
  let cacheColumns = unref(propsRef).columns;
  const getColumnsRef = computed(() => {
    const columns = unref(columnsRef);
    if (!columns) {
      return [];
    }
    // 是否展示省略号
    const { ellipsis } = unref(propsRef);

    columns.forEach(item => {
      const { flag, customRender, slots } = item;
      if (!customRender&&(!slots||(slots&&!slots.customRender))) {
        if (flag == 'datetime') {
          item.customRender = ({ text }) => {
            return formatter(text, item.dateTemplate||'YYYY-MM-DD HH:mm:ss' );
          };
        } else if (flag == 'date') {
          item.customRender = ({ text }) => {
            return formatter(text, item.dateTemplate||'YYYY-MM-DD' );
          };
        } else if (flag == 'percent') {
          const percent = item.percent;
          let realPercent = 100;
          if (typeof percent == 'number') {
            realPercent = percent;
          } else if (percent instanceof Function) {
            realPercent = percent();
          }
          item.customRender = ({ text }) => {
            return (text*100/realPercent) +'%';
          };
        }
      }
      handleItem(
        item,
        Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender && !slots,
      );
    });
    return columns;
  });
  // 根据fixed进行列重排序
  const getSortFixedColumns = computed(() => {
    return useFixedColumn(unref(getColumnsRef));
  });
  // 监听columns的修改，用于更新cacheColumns
  watch(
    () => unref(propsRef).columns,
    columns => {
      columnsRef.value = columns;
      cacheColumns = columns?.filter(item => !item.flag) ?? [];
    },
  );

  /**
   * 设置表头数据
   * @param columnList key｜column
   */
  function setColumns(columnList: Partial<BasicColumn>[] | string[]) {
    const columns = cloneDeep(columnList);
    if (!isArray(columns)) return;

    if (columns.length <= 0) {
      columnsRef.value = [];
      return;
    }

    const firstColumn = columns[0];

    if (!isString(firstColumn)) {
      columnsRef.value = columns as BasicColumn[];
    } else {
      const columnKeys = columns as string[];
      const newColumns: BasicColumn[] = [];
      cacheColumns.forEach(item => {
        const index =  columnKeys.indexOf(`${item.dataIndex||item.key}`);
        if ( index !== -1 ) {
          newColumns[index] = {
            ...item,
            defaultHidden: false,
          };
        }
      });
      columnsRef.value = newColumns;
    }
  }

  function getColumns(opt?: GetColumnsParams) {
    const { ignoreIndex, ignoreAction, sort } = opt || {};
    let columns = toRaw(unref(getColumnsRef));
    if (ignoreIndex) {
      columns = columns.filter(item => item.flag !== INDEX_COLUMN_FLAG);
    }
    if (ignoreAction) {
      columns = columns.filter(item => item.flag !== ACTION_COLUMN_FLAG);
    }

    if (sort) {
      columns = useFixedColumn(columns);
    }

    return columns;
  }
  function getCacheColumns() {
    return cacheColumns;
  }

  return { getColumnsRef, getCacheColumns, getColumns, setColumns, getSortFixedColumns };
}

export function useFixedColumn(columns: BasicColumn[]) {
  const fixedLeftColumns: BasicColumn[] = []; //左排列
  const fixedRightColumns: BasicColumn[] = [];// 右排列
  const defColumns: BasicColumn[] = []; // 正常列
  for (const column of columns) {
    if (column.fixed === 'left') {
      fixedLeftColumns.push(column);
      continue;
    }
    if (column.fixed === 'right') {
      fixedRightColumns.push(column);
      continue;
    }
    defColumns.push(column);
  }
  const resultColumns = [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(
    item => !item.defaultHidden,
  );
  return resultColumns;
}
