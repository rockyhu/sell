<template>
	<div id="app">
		<!--通过:seller="seller"给header组件传seller参数-->
		<v-header :seller="seller"></v-header>
		<div class="tab border-1px">
			<div class="tab-item">
				<router-link :to="{path:'/goods'}">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link :to="{path:'/ratings'}">评论</router-link>
			</div>
			<div class="tab-item">
				<router-link :to="{path:'/seller'}">商家</router-link>
			</div>
		</div>
		<keep-alive>
			<!-- 将seller参数传入子组件 -->
			<router-view :seller="seller"></router-view>
		</keep-alive>
	</div>
</template>

<script type="text/ecmascript-6">
	import header from '@/components/header/header';
	import {urlParse} from '@/common/js/util';

	// 错误代码常量定义
	const ERR_NO = 0;

	export default {
		// 数据
		data() {
			return {
				seller: {
					// 匿名自动执行函数
					id: (() => {
						let queryParam = urlParse();
						return queryParam.id;
					})()
				}
			};
		},
		// 钩子 - created,实例已经创建完成之后被调用
		created() {
			this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
				// 请求成功的回调函数
				let sellerRes = response.body;
				// 状态进行判断
				if (sellerRes.errno === ERR_NO) {
					// ES6新方法，给this.seller添加sellerRes.data属性，然后返回
					// 采用这种方式this.seller.id不会被覆盖掉
					this.seller = Object.assign({}, this.seller, sellerRes.data);
				}
			}, (response) => {
				// 请求失败的回调函数

			});
		},
		// 组件
		components: {
			// 为header组件设置别名
			'v-header': header
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import './common/stylus/mixin.styl'

	#app
		.tab
			display: flex
			width: 100%
			height: 40px
			line-height: 40px
			border-1px(rgba(7, 17, 27, 0.1))
			.tab-item
				flex: 1
				text-align: center
				& > a
					display: block
					font-size: 14px
					color: rgb(77, 85, 93)
					&.active
						color: rgb(240, 20, 20)
</style>