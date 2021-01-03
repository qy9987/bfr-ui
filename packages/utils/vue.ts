import { App, getCurrentInstance, nextTick, onMounted, onUnmounted } from 'vue';
export function withInstall(...components: any[]) {
  components.forEach(comp => {
    comp.install = (app: App) => {
      app.component(comp.displayName || comp.name, comp);
    };
  });
}
export function tryOnMounted(fn: () => void, sync = true) {
  if (getCurrentInstance()) {
    onMounted(fn);
  } else if (sync) {
    fn();
  } else {
    nextTick(fn);
  }
}
export function tryOnUnmounted(fn: () => Promise<void> | void) {
  getCurrentInstance() && onUnmounted(fn);
}
export function isInSetup() {
  if (!getCurrentInstance()) {
    console.error('Please put useForm function in the setup function!');
  }
}
