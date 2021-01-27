import { inject, provide } from 'vue';
import { BasicForm } from '../types/form';

const key = Symbol();
export interface FormContext extends BasicForm{
  model: object;
  setModel: (key: string, value) => void;
  getModel: (key: string) => any;
}
export function setFormContext(instance) {
  provide(key, instance);
}

export function useFormContext() {
  return inject(key) as FormContext;
}
