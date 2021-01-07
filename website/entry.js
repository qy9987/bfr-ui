import { createApp, nextTick } from 'vue';
import { createRouter,  createWebHashHistory } from 'vue-router';
import routes from './route.config';
import demoBlock from './components/demo-block';
// import MainFooter from './components/footer';
import MainHeader from './components/header';
import SideNav from './components/side-nav';
import 'highlight.js/styles/color-brewer.css';
import './demo-styles/index.less';
import icon from './icon.json';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn'); // todo: locale based on Doc site lang
import App from './app.vue';
import bfrui from 'bfr-ui';
import antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { SearchOutlined } from '@ant-design/icons-vue';
import '../packages/theme/src/index.less';

const app = createApp(App);

app.config.globalProperties.$icon = icon;

app.component('DemoBlock', demoBlock);
// app.component('MainFooter', MainFooter);
app.component('MainHeader', MainHeader);
app.component('SideNav', SideNav);
// app.component('FooterNav', FooterNav);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

app.use(antd);
app.use(bfrui);
app.use(router);
app.component(SearchOutlined.name, SearchOutlined);

router.isReady().then(()=>{

  router.afterEach(async () => {
    await nextTick();
    // const data = title[route.meta.lang];
    // for (let val in data) {
    //   if (new RegExp('^' + val, 'g').test(route.name)) {
    //     document.title = data[val];
    //     return;
    //   }
    // }
    document.title = 'bfr-ui';
    // ga('send', 'event', 'PageView', route.name);
  });

});

app.mount('#app');
