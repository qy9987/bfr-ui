import { propTypes, customPropType } from '@bfr-ui/utils/propTypes';
import { PropType } from 'vue';
import {  FormLayout, LabelAlign, Trigger } from './types/form';
export const defaultFormProps = {
  model: propTypes.object,
  rules: propTypes.object,
  schemas: propTypes.array,
  hideRequiredMark: propTypes.bool.def(false),
  labelAlign: customPropType<LabelAlign>(propTypes.string.def('right')),
  layout: customPropType<FormLayout>(propTypes.string.def('horizontal')),
  labelCol: propTypes.object,
  wrapperCol: propTypes.object,
  colon: propTypes.bool.def(true),
  validateOnRuleChange: propTypes.bool.def(true),
  scrollToFirstError: propTypes.bool.def(true),
  name: propTypes.string,
  validateTrigger: {
    default: 'change',
    type: String  as PropType<Trigger|Array<Trigger>>,
  },
  labelWidth: customPropType<string|number>(propTypes.string.def()),
};
