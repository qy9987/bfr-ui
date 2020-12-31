import { defineAsyncComponent } from 'vue';
import navConfig from './nav.config';

const LoadingComponent = {
  template: `<div v-loading="true" style="min-height: 500px; width: 100%;"></div>`,
};
const ErrorComponent = {
  template: `
    <div style="text-align: center;padding: 100px 0;">Loading error. Please refresh the page and try again</div>`,
};
const getAsyncComponent = func => {
  return defineAsyncComponent({
    loader: func,
    delay: 0,
    timeout: 30000,
    errorComponent: ErrorComponent,
    loadingComponent: LoadingComponent,
  });
};


const load = function(path) {
  return getAsyncComponent(() => import(/* webpackChunkName: "zh-CN" */ `./pages/${path}.vue`));
};
const loadDocs = function(path) {
  return getAsyncComponent(() => import(/* webpackChunkName: "DOCS zh-CN" */ `./docs/zh-CN${path}.md`));
};

const registerRoute = navConfig => {
  let route = [];
  Object.keys(navConfig).forEach(index => {
    let navs = navConfig;
    route.push({
      path: `/component`,
      redirect: `/component/installation`,
      component: load( 'component'),
      children: [],
    });
    navs.forEach(nav => {
      if (nav.href) return;
      if (nav.groups) {
        nav.groups.forEach(group => {
          group.list.forEach(nav => {
            addRoute(nav,  index);
          });
        });
      } else if (nav.children) {
        nav.children.forEach(nav => {
          addRoute(nav,  index);
        });
      } else {
        addRoute(nav,  index);
      }
    });
  });
  function addRoute(page, index) {
    const component = page.path === '/changelog'
      ? load( 'changelog')
      : loadDocs(page.path);
    let child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
      },
      name: 'component-' + (page.title || page.name),
      component: component.default || component,
    };

    route[index].children.push(child);
  }
  return route;
};

let route = registerRoute(navConfig);

const generateMiscRoutes = function() {
  let guideRoute = {
    path: `/guide`, // 指南
    redirect: `/guide/design`,
    component: load('guide'),
    children: [{
      path: 'nav', // 导航
      name: 'guide-nav',
      component: load('nav'),
    }],
  };

  let indexRoute = {
    path: `/`, // 首页
    name: 'home',
    component: load('index'),
  };

  return [guideRoute,  indexRoute];
};

route = route.concat(generateMiscRoutes());

route = route.concat([{
  path: '/',
  redirect: { path: `/` },
}, {
  path: '/*',
  redirect: { path: `/` },
}]);

export default route;
