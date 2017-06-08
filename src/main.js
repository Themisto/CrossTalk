import Vue from 'vue'
import Layout from './Layout.vue'
import VueRouter from 'vue-router';
import Home from './pages/home/Home.vue';
import TodoList from './pages/list/TodoList.vue';
import Video from './pages/video/Video.vue';
import Login from './pages/login/Login.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/list', component: TodoList },
  { path: '/video', component: Video },
  { path: '/room/:id', component: Video },
  { path: '/login', component: Login }
];

const router = new VueRouter({
  mode: 'history',
  hashbang: false,
  routes
});

Vue.use(router);

new Vue({
  el: '#app',
  data() {
    return {
      message: 'test msg',
      nativeLang: null,
      foreignLang: null
    };
  },
  router,
  render(h) {
    return h(Layout, {
      props: {
        parentMsg: this.message
      }
    });
  }
});
