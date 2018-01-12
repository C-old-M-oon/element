// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import './common/stylus/index.styl';
import axios from 'axios';

Vue.prototype.$axios = axios;

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
    linkActiveClass: 'active',
    routes: [
        {path: '/', redirect: '/goods'}, // 定义的初始路由路径
        {
            path: '/goods',
            component: goods
        },
        {
            path: '/ratings',
            component: ratings
        },
        {
            path: '/seller',
            component: seller
        }
    ]
});

new Vue({
    router: router,
    render: h => h(App),
    // 2.0事件派发
    data: {
        eventHub: new Vue()
    }
}).$mount('#app');

// 页面加载直接挂载指定路由
// router.push('/goods');

// 以下是vue1.0路由挂载和启动
// let app = Vue.extend(App);
// let router = new VueRouter();

// router.map({
//     '/goods': {
//         component: goods
//     },
//     '/ratings': {
//         component: ratings
//     },
//     '/seller': {
//         component: seller
//     }
// });

// 启动路由，注册挂载点
// router.start(app, '#app');
// router.go('/goods')
