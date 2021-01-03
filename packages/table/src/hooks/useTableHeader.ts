import type { ComputedRef, Slots } from 'vue';
import type { BasicTableProps } from '../types/table';
import { unref, computed, h } from 'vue';
import { isString } from '@bfr-ui/utils/is';
import TableHeader from '../components/TableHeader.vue';

export function useTableHeader(propsRef: ComputedRef<BasicTableProps>, slots: Slots) {
  const getHeaderProps = computed(
    (): Recordable => {
      const { title, showTableSetting, titleHelpMessage, tableSetting } = unref(propsRef);
      const hideTitle = !slots.tableTitle && !title && !slots.toolbar && !showTableSetting;
      if (hideTitle && !isString(title)) {
        return {};
      }

      return {
        title: hideTitle
          ? null
          : () =>
            h(
              TableHeader,
              {
                title,
                titleHelpMessage,
                showTableSetting,
                tableSetting,
              },
              {
                ...(slots.toolbar
                  ? {
                    toolbar: () => slots.toolbar(),
                  }
                  : {}),
                ...(slots.tableTitle
                  ? {
                    tableTitle: () => slots.tableTitle(),
                  }
                  : {}),
              },
            ),
      };
    },
  );
  return { getHeaderProps };
}
