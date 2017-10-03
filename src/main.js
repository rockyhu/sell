// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';

// 全局引入stylus样式
import '@/common/stylus/index.styl';

Vue.config.productionTip = false;

// 全局注册组件
Vue.use(VueRouter);
Vue.use(VueResource);

// 创建router实例
const router = new VueRouter({
	// VueRouter的路由模式，默认为hash模式
	mode: 'history',
	// 设置默认激活链接的样式
	linkActiveClass: 'active',
	// 定义路由map
	routes: [
		// 设置默认跳转路由
		{
			'path': '/',
			'redirect': '/goods'
		},
		{
			'path': '/goods',
			'component': goods
		},
		{
			'path': '/ratings',
			'component': ratings
		},
		{
			'path': '/seller',
			'component': seller
		}
	]
});

/* eslint-disable no-new */
// components: { App }这种语法是es6的简写方式相当于components: { App : App }
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {App}
});
