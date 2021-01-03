let lastTime = 0;
const prefixes = 'webkit moz ms o'.split(' ');

let requestAnimationFrame: typeof window.requestAnimationFrame;
let cancelAnimationFrame: typeof window.cancelAnimationFrame;
(() => {
  const getWindowFrame = (name: string) => {
    return name as any;
  };
  requestAnimationFrame = window.requestAnimationFrame;
  cancelAnimationFrame = window.cancelAnimationFrame;
  let prefix;
  for (let i = 0; i < prefixes.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) {
      break;
    }
    prefix = prefixes[i];
    const reqframe = window[getWindowFrame(prefix + 'RequestAnimationFrame')] as unknown as typeof window.requestAnimationFrame;
    const cancel =
      (window[getWindowFrame(prefix + 'CancelAnimationFrame')] ||
      window[getWindowFrame(prefix + 'CancelRequestAnimationFrame')]) as unknown as typeof window.cancelAnimationFrame;

    requestAnimationFrame =
        requestAnimationFrame || reqframe;
    cancelAnimationFrame =
        cancelAnimationFrame ||cancel;
  }

  // If the current browser does not support requestAnimationFrame and cancelAnimationFrame, it will fall back to setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback: Fn) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => {
        /* eslint-disable-next-line */
          callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    cancelAnimationFrame = function (id: number) {
      window.clearTimeout(id);
    };
  }
})();

export { requestAnimationFrame, cancelAnimationFrame };
