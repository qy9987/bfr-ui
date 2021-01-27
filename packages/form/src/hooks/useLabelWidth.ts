import { computed, unref } from 'vue';
import { AntFormItem } from '../types/form';

import { useFormContext } from '../hooks/useFormContext';
export function useLabelWidth(labelWidth, propRef: AntFormItem) {
  return computed(() => {
    const context = useFormContext();
    const { labelCol: golbalLabelCol, wrapperCol: golbalWrapperCol } = unref(propRef);
    let width = labelWidth || context.labelWidth;
    if (width) {
      width = typeof width == 'number' ? `${width}px` : width;
    }
    return {
      labelCol: {
        style: {
          width: width,
        },
        ...golbalLabelCol,
      },
      wrapperCol: {
        style: {
          width: `calc(100% - ${width})`,
        },
        ...golbalWrapperCol,
      },
    };
  });
}
