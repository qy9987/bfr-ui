export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isFunction(arg: unknown): arg is Function {
  return typeof arg === 'function';
}

export function isString(val: unknown): val is string {
  return is(val, 'String');
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined';
};
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
  return val === null;
}
export function isUndefined(val: unknown): val is null {
  return val === undefined;
}
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}
/**
 * 验证数据是否为null或者undefined
 * @param {any} val 需要验证的数据
 * @returns {boolean} 验证结果，为空为true 不为空为false
 */
export function isBaseEmpty(val: any): boolean {
  return isNull(val)||isUndefined(val);
}
