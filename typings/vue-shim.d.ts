declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}



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


declare type EmitType = (event: string, ...args: any[]) => void;
declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}
declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;
declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
