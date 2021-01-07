<script lang="ts">
import type { CSSProperties, PropType } from 'vue';
import { defineComponent, computed, unref, h } from 'vue';

import { Tooltip } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';

import { isString, isArray } from '@bfr-ui/utils/is';
import { propTypes } from '@bfr-ui/utils/propTypes';
// import { useDesign } from '/@/hooks/web/useDesign';
export default defineComponent({
  name: 'BasicHelp',
  components: { 'tool-tip': Tooltip },
  props: {
    // max-width
    maxWidth: propTypes.string.def('600px'),
    // Whether to display the serial number
    showIndex: propTypes.bool,
    // color
    color: propTypes.string.def('#ffffff'),
    fontSize: propTypes.string.def('14px'),
    placement: propTypes.string.def('right'),
    absolute: propTypes.bool,
    // Text list
    text: {
      type: [Array, String] as PropType<string[] | string>,
    },
    // 定位
    position: {
      type: [Object] as PropType<any>,
      default: () => ({
        position: 'absolute',
        left: 0,
        bottom: 0,
      }),
    },
  },
  setup(props, { slots }) {
    const prefixCls = 'bfr-basic-help';

    const getOverlayStyleRef = computed(
      (): CSSProperties => {
        return {
          maxWidth: props.maxWidth,
        };
      },
    );

    const getWrapStyleRef = computed(
      (): CSSProperties => {
        return {
          color: props.color,
          fontSize: props.fontSize,
        };
      },
    );

    const getMainStyleRef = computed(() => {
      return props.absolute ? props.position : {};
    });

    const renderTitle = () => {
      const list = props.text;

      if (isString(list)) {
        return h('p', list);
      }

      if (isArray(list)) {
        return list.map((item, index) => {
          return h('p', { key: item }, [props.showIndex ? `${index + 1}. ` : '', item]);
        });
      }

      return null;
    };

    return () => {
      return h(
        'tool-tip',
        {
          title: h(
            'div',
            {
              style: unref(getWrapStyleRef),
            },
            [renderTitle()],
          ),
          overlayClassName: `${prefixCls}__wrap`,
          autoAdjustOverflow: true,
          overlayStyle: unref(getOverlayStyleRef),
          placement: props.placement,
        },
        {
          default: () =>
            h(
              'span',
              {
                class: prefixCls,
                style: unref(getMainStyleRef),
              },
              slots.default&&slots.default() || h(InfoCircleOutlined),
            ),
        },
      );
    };
  },
});
</script>
