// 获取UI的绑定element
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

export function numberFormat(text: number|string|BigInt) {
  return new Intl.NumberFormat().format(Number(text) as number);
}