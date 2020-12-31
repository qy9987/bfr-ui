declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}
declare type Nullable<T> = T | null;

declare type CustomizedHTMLElement<T> = HTMLElement & T

declare type Recordable<T extends any = any> = Record<string, T>;

declare type Hash<T> = Recordable<T>

declare type ComponentElement<T extends HTMLElement = HTMLDivElement> = CustomizedHTMLElement<T> | null;
