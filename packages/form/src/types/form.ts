

import { NamePath } from 'ant-design-vue/lib/form/interface';
import { VNode } from 'vue';

export type Trigger = 'change' | 'blur';
export type LabelAlign = 'left' | 'right';
export type FormItemSlot = { extra?: string; help?: string; label?: string; content?: string };
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating';
export type FormLayout = 'horizontal' | 'vertical' | 'inline';
export interface AntFormItem {
  name?: string;
  rules?: object | Array<object>;
  autoLink?: boolean;
  colon?: boolean;
  extra?: string|VNode;
  hasFeedback?: boolean;
  help?: string|VNode;
  htmlFor?: string;
  label?: string | VNode;
  labelCol?: object;
  labelAlign?: LabelAlign;
  required?: boolean;
  validateStatus?: ValidateStatus;
  wrapperCol?: object;
  validateFirst?: boolean;
  validateTrigger?: Trigger | Trigger[];
}
export interface BasicFormItem {
  itemProps: AntFormItem;
  labelWidth?: string | number;
  component?: string;
  slots?: FormItemSlot;
}

export interface BasicFormMethods {
  validate: (nameList?: NamePath[]) => Promise<Recordable>;
  validateFields: (nameList?: NamePath[]) => Promise<Recordable>;
  scrollToField: 	(name: NamePath, options: [ScrollOptions]) => void;
  resetFields: ()=>void;
  clearValidate: (name?: Array<string> | string) => void;
}
export interface BasicForm extends BasicFormMethods {
  model?: object;
  rules?: object;
  schemas?: BasicFormItem[];
  hideRequiredMark?: boolean;
  labelAlign?: LabelAlign;
  layout?: FormLayout;
  labelWidth?: string | number;
  labelCol?: object;
  wrapperCol?: object;
  colon?: boolean;
  validateOnRuleChange?: boolean;
  scrollToFirstError?: boolean;
  name?: string;
  validateTrigger?: Trigger | Trigger[];
}



