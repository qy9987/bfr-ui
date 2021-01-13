import { BasicColumn, BasicTableProps, GetColumnsParams } from '../types/table';
import { unref, ComputedRef, Ref, computed, ref, toRaw, watch } from 'vue';
import {  isArray, isString } from '@bfr-ui/utils/is';
import { DEFAULT_ALIGN,  INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG } from '../const';
import {  cloneDeep } from 'lodash';
import { formatter } from '@bfr-ui/utils/date';

function handleItem(item: BasicColumn, ellipsis: boolean) {
  const { key, dataIndex, children } = item;
  item.align = item.align || DEFAULT_ALIGN;
  if (!key) {
    item.key = dataIndex;
  }
  if (!Reflect.has(item, 'ellipsis') || item.ellipsis !== ellipsis) {
    Object.assign(item, {
      ellipsis,
    });
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
export function useColumns(
  propsRef: ComputedRef<BasicTableProps>,
) {
  // 监听序号列展示
  const columnsRef = (ref(unref(propsRef).columns) as unknown) as Ref<BasicColumn[]>;
  let cacheColumns = unref(propsRef).columns;
  const getColumnsRef = computed(() => {
    const columns = unref(columnsRef);
    if (!columns) {
      return [];
    }
    // 是否展示省略号
    const ellipsis = unref(propsRef).ellipsis;
    const indexs = [];
    let index = 0;
    for (const item of columns) {
      const { flag, customRender, slots } = item;
      const hasSlotRender = slots&&slots.customRender;
      if (flag == 'index') {
        indexs.push(index);
        if (indexs.length > 1) {
          throw new Error(`duplicate sequence number column, column index: ${indexs.join(',')}`);
        }
        const isFixedLeft = columns.some(item => item.fixed === 'left');
        const column: BasicColumn = {
          flag: INDEX_COLUMN_FLAG,
          width: 50,
          title: '序号',
          dataIndex: '$index',
          key: '$index',
          align: 'center',
          ...hasSlotRender ? {} : {
            customRender:({ index }) =>`${index + 1}`,
          },
          ...(isFixedLeft
            ? {
              fixed: 'left',
            }
            : {}),
          ...item,
        };
        columns[index] = column;
      } else if (flag === 'action') {
        const isFixedRight = columns.some(item => item.fixed === 'right');
        const column: BasicColumn = {
          fixed: isFixedRight?'right':false,
          key: '$action',
          dataIndex: '$action',
          ...item,
          width: 200,
          flag: ACTION_COLUMN_FLAG,
        };
        columns[index] = column;
      }
      if (!customRender && !hasSlotRender) {
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
        ellipsis?(Reflect.has(item, 'ellipsis')?!!item.ellipsis: !customRender && !slots): false,
        // Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender && !slots,
      );
      index += 1;
    }
    return columns;
  });
  const getSortFixedColumns = computed(() => {
    return useFixedColumn(unref(getColumnsRef));
  });
  // 监听columns的修改，用于更新cacheColumns
  watch(
    ()=>propsRef.value.columns,
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
    }else if (column.fixed === 'right') {
      fixedRightColumns.push(column);
    } else {
      defColumns.push(column);
    }
  }
  const resultColumns = [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(
    item => !item.defaultHidden,
  );
  return resultColumns;
}
