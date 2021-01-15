// 获取UI的绑定element
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

export function numberFormat(text: number|string|BigInt) {
  return new Intl.NumberFormat().format(Number(text) as number);
}

export function getPercent(value: number, relative = 100) {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`percent value must is a number, you value is ${typeof value}`);
  }
  return `${(Number(value) * 100) / relative}%`;
}
